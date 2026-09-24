import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const devicesStoreName = 'owner-push-devices';
const deliveryStoreName = 'owner-push-delivery';
const oauthScope = 'https://www.googleapis.com/auth/firebase.messaging';

function devicesStore() {
  return getStore(devicesStoreName);
}

function deliveryStore() {
  return getStore(deliveryStoreName);
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  return JSON.parse(raw);
}

async function accessToken(account) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: account.client_email,
    scope: oauthScope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(`${header}.${payload}`)
    .sign(account.private_key, 'base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${payload}.${signature}`,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error(body.error_description || 'Unable to authorize Firebase Messaging.');
  return body.access_token;
}

function deviceKey(deviceId) {
  return `${deviceId}.json`;
}

export async function listOwnerPushDevices() {
  const listed = await devicesStore().list();
  const devices = await Promise.all((listed.blobs || []).map((blob) => devicesStore().get(blob.key, { type: 'json' })));
  return devices.filter((device) => device?.enabled && device.token);
}

export async function registerOwnerPushDevice({ deviceId, token, deviceName, platform = 'android', appVersion = null }) {
  if (!deviceId || !token) throw new Error('Missing device registration data.');
  const now = new Date().toISOString();
  const payload = {
    deviceId,
    token,
    deviceName: deviceName || 'Android device',
    platform,
    appVersion,
    enabled: true,
    updatedAt: now,
    createdAt: (await devicesStore().get(deviceKey(deviceId), { type: 'json' }))?.createdAt || now,
  };
  await devicesStore().setJSON(deviceKey(deviceId), payload);
  return { ...payload, token: undefined };
}

export async function unregisterOwnerPushDevice(deviceId) {
  if (!deviceId) return { ok: true };
  const current = await devicesStore().get(deviceKey(deviceId), { type: 'json' });
  if (current) {
    await devicesStore().setJSON(deviceKey(deviceId), { ...current, enabled: false, token: null, updatedAt: new Date().toISOString() });
  }
  return { ok: true };
}

async function markInvalidDevice(deviceId, reason) {
  const current = await devicesStore().get(deviceKey(deviceId), { type: 'json' });
  if (current) {
    await devicesStore().setJSON(deviceKey(deviceId), { ...current, enabled: false, token: null, invalidReason: reason, updatedAt: new Date().toISOString() });
  }
}

function deliveryKey(eventId, deviceId) {
  return `${eventId}/${deviceId}.json`;
}

async function alreadyDelivered(eventId, deviceId) {
  return Boolean(await deliveryStore().get(deliveryKey(eventId, deviceId), { type: 'json' }));
}

async function markDelivered(eventId, deviceId, payload) {
  await deliveryStore().setJSON(deliveryKey(eventId, deviceId), {
    ...payload,
    deliveredAt: new Date().toISOString(),
  });
}

function notificationText({ eventType, clientName, kuwaitTime }) {
  const eventLabels = {
    PORTAL_VISIT: {
      title: `🔵 ${clientName} زار بوابة العميل`,
      body: 'زيارة جديدة لبوابة العميل',
    },
    CAMPAIGN_ENABLED: {
      title: `🟢 ${clientName} شغّل الحملة`,
      body: 'تم تشغيل الحملة من بوابة العميل',
    },
    CAMPAIGN_PAUSED: {
      title: `🔴 ${clientName} أوقف الحملة`,
      body: 'تم إيقاف الحملة من بوابة العميل',
    },
  };
  const text = eventLabels[eventType] || {
    title: `Media Land - ${clientName}`,
    body: 'حدث جديد في بوابة العميل',
  };
  return {
    title: text.title,
    body: `${text.body}${kuwaitTime ? `\n${kuwaitTime}` : ''}`,
  };
}

export async function sendOwnerCampaignNotification(event) {
  if (!event || event.actor !== 'CLIENT') return { sent: 0, skipped: true };
  if (!['PORTAL_VISIT', 'CAMPAIGN_ENABLED', 'CAMPAIGN_PAUSED'].includes(event.eventType)) return { sent: 0, skipped: true };

  const account = serviceAccount();
  if (!account?.project_id) {
    console.warn(JSON.stringify({ push: 'missing_firebase_service_account', eventId: event.id }));
    return { sent: 0, configured: false };
  }

  const devices = await listOwnerPushDevices();
  if (!devices.length) return { sent: 0, devices: 0 };

  const token = await accessToken(account);
  const text = notificationText({
    eventType: event.eventType,
    clientName: event.clientName,
    kuwaitTime: event.occurredAtKuwait,
  });
  let sent = 0;

  await Promise.all(devices.map(async (device) => {
    if (await alreadyDelivered(event.id, device.deviceId)) return;
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: device.token,
          notification: {
            title: text.title,
            body: text.body,
          },
          data: {
            eventId: event.id,
            eventType: event.eventType,
            clientSlug: event.clientSlug,
            clientName: event.clientName,
            kuwaitTime: event.occurredAtKuwait || '',
          },
          android: {
            priority: 'HIGH',
            notification: {
              channel_id: 'campaign_activity',
            },
          },
        },
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (response.ok) {
      sent += 1;
      await markDelivered(event.id, device.deviceId, { ok: true, fcmName: body.name || null });
      return;
    }
    const reason = body?.error?.status || body?.error?.message || `HTTP_${response.status}`;
    await markDelivered(event.id, device.deviceId, { ok: false, reason });
    if (['NOT_FOUND', 'INVALID_ARGUMENT', 'UNREGISTERED'].includes(reason)) {
      await markInvalidDevice(device.deviceId, reason);
    }
    console.warn(JSON.stringify({ push: 'send_failed', eventId: event.id, deviceId: device.deviceId, reason }));
  }));

  return { sent, devices: devices.length, title: text.title };
}

export async function sendOwnerTestNotification(deviceId = null) {
  const account = serviceAccount();
  if (!account?.project_id) throw new Error('Firebase service account is not configured.');
  const devices = await listOwnerPushDevices();
  const targets = deviceId ? devices.filter((device) => device.deviceId === deviceId) : devices;
  if (!targets.length) throw new Error('No registered owner device found.');
  const token = await accessToken(account);
  const eventId = `test-${crypto.randomUUID()}`;

  await Promise.all(targets.map(async (device) => {
    const response = await fetch(`https://fcm.googleapis.com/v1/projects/${account.project_id}/messages:send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: device.token,
          data: {
            eventId,
            eventType: 'TEST',
            clientSlug: '',
            clientName: 'Media Land Ads Monitor',
            kuwaitTime: '',
          },
          notification: {
            title: 'Media Land Ads Monitor',
            body: 'الإشعارات تعمل بنجاح.',
          },
          android: {
            priority: 'HIGH',
            notification: {
              channel_id: 'campaign_activity',
            },
          },
        },
      }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error?.message || 'Test push failed.');
    }
  }));

  return { sent: targets.length };
}
