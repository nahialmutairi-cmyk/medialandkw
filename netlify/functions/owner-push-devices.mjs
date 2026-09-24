import { connectActivityStore, isAdminAuthorized } from './_shared/client-portal-activity.mjs';
import {
  registerOwnerPushDevice,
  sendOwnerTestNotification,
  unregisterOwnerPushDevice,
} from './_shared/owner-push-notifications.mjs';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, message: 'Method not allowed.' });
  if (!isAdminAuthorized(event)) return json(401, { ok: false, message: 'Unauthorized.' });
  connectActivityStore(event);

  try {
    const body = JSON.parse(event.body || '{}');
    if (body.action === 'REGISTER') {
      const device = await registerOwnerPushDevice({
        deviceId: body.deviceId,
        token: body.token,
        deviceName: body.deviceName,
        platform: body.platform,
        appVersion: body.appVersion,
      });
      return json(200, { ok: true, device });
    }
    if (body.action === 'UNREGISTER') {
      await unregisterOwnerPushDevice(body.deviceId);
      return json(200, { ok: true });
    }
    if (body.action === 'TEST') {
      const result = await sendOwnerTestNotification(body.deviceId);
      return json(200, { ok: true, ...result });
    }
    return json(400, { ok: false, message: 'Invalid push device action.' });
  } catch (error) {
    return json(500, { ok: false, message: error instanceof Error ? error.message : 'Push device request failed.' });
  }
}

