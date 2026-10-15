import { Instagram, Phone, Send } from 'lucide-react';

export function AlasriaTents() {
  return (
    <main className="alasria-page" dir="rtl">
      <section className="alasria-shell" aria-labelledby="alasria-title">
        <p className="alasria-label">خيام وتجهيزات في الكويت</p>
        <h1 id="alasria-title">خيام عصرية</h1>
        <p className="alasria-copy">
          تصاميم خيام تجمع بين الأناقة والجمال لتناسب مختلف الأذواق والاحتياجات.
        </p>

        <div className="alasria-actions">
          <a className="alasria-button alasria-primary" href="tel:+96598538831">
            <Phone aria-hidden="true" size={20} />
            <span>اتصل بنا</span>
          </a>
          <a className="alasria-button alasria-whatsapp" href="https://wa.me/96598538831">
            <Send aria-hidden="true" size={20} />
            <span>واتساب</span>
          </a>
          <a
            className="alasria-button alasria-instagram"
            href="https://www.instagram.com/alasria.tents/"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram aria-hidden="true" size={20} />
            <span>@alasria.tents</span>
          </a>
        </div>

        <div className="alasria-contact">
          <a href="tel:+96598538831">+965 9853 8831</a>
          <span aria-hidden="true">|</span>
          <a href="https://www.instagram.com/alasria.tents/" target="_blank" rel="noreferrer">
            @alasria.tents
          </a>
        </div>
      </section>
    </main>
  );
}
