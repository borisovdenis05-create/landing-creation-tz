import Icon from "@/components/ui/icon";
import { instructors, LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm, ymGoal } from "./shared";
import { FooterPolicyButtons } from "./PolicyModals";
import { usePublicList, usePublicSettings } from "./shared/publicApi";

type DbReview = { id: number; author: string; text: string; rating: number; photo_url: string; source: string };

const FALLBACK_REVIEWS: DbReview[] = [
  { id: 1, author: "Мавиле Хашимова", source: "Яндекс карты", photo_url: "", rating: 5, text: "Хочу выразить искреннюю благодарность автошколе за качественное обучение и профессиональный подход. Занятия по теории проходили понятно и интересно, материал объяснялся доступно, с примерами из реальных дорожных ситуаций." },
  { id: 2, author: "Анжела К.", source: "Яндекс карты", photo_url: "", rating: 5, text: "Лучшая автошкола! Много лет хотела сесть за руль, боялась... Но девочки администраторы всё рассказали, объяснили. Инструктор по теории Павел Михайлович и инструктор по вождению Рейнгард Илья просто супер люди!" },
  { id: 3, author: "Валентина Власенко", source: "Яндекс карты", photo_url: "", rating: 5, text: "Идеальное сочетание профессионализма и человеческого подхода! Я прошла обучение в данной автошколе и могу с уверенностью сказать: это был лучший выбор!" },
  { id: 4, author: "Алина Тодорская", source: "Яндекс карты", photo_url: "", rating: 5, text: "Хочется выразить благодарность Госавтошколе за высокий уровень профессионализма! Ни капли не пожалела, что выбрала именно эту школу." },
];

export default function InstructorsToFooter() {
  const { items: reviewsDb } = usePublicList<DbReview>("public-reviews");
  const { settings } = usePublicSettings();
  const reviews = reviewsDb && reviewsDb.length > 0 ? reviewsDb : FALLBACK_REVIEWS;
  const reviewsTitle = settings.reviews_title || "Довольные выпускники о нас";
  const logo = settings.logo_url || LOGO_URL;
  const phone = settings.phone || PHONE;
  const phoneDisplay = settings.phone_display || PHONE_DISPLAY;
  const phoneCaption = settings.phone_caption || "";
  const infoUrl = settings.info_url || "";
  const infoLabel = settings.info_label || "Сведения об образовательной организации";

  return (
    <>


      {/* ============ REVIEWS ============ */}
      {settings.block_reviews !== "false" && (
        <section id="reviews" className="py-20" style={{ background: "#f4f4f4" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase">{reviewsTitle}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="border border-white/10 rounded-2xl p-6" style={{ background: "#2e2e2e" }}>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <span key={i} className="text-orange-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-5 whitespace-pre-line">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.author} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {r.author[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white text-sm">{r.author}</p>
                      {r.source && <p className="text-white/40 text-xs">{r.source}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ LEAD FORM (FOOTER CTA) ============ */}
      <section id="lead-form" className="py-20" style={{ background: "#2e2e2e" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-3">Начните сегодня</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
                Остались вопросы?<br />
                <span className="text-orange-400">Запишитесь</span> на бесплатную консультацию
              </h2>
              <div className="space-y-3 text-white/70 text-sm">
                {phoneCaption && (
                  <p className="text-white/50 text-xs">{phoneCaption}</p>
                )}
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={18} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                  <a href={`tel:${phone}`} onClick={() => ymGoal("phone_click")} className="text-orange-400 font-bold text-lg hover:text-orange-300">{phoneDisplay}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" size={18} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                  <a href="https://yandex.ru/maps/-/CPBAfQLi" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Киевская ул., 41, Симферополь</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={18} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                  <span>Пн–Пт: 10:00–18:30</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-7 border border-white/10" style={{ background: "#3a3a3a" }}>
              <LeadForm
                title="Отправить заявку"
                subtitle="Перезвоним в течение 15 минут"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10 pt-10 pb-6" style={{ background: "#1e1e1e" }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            {/* Logo + contact */}
            <div className="flex-shrink-0">
              <img src={logo} alt="ГОСАШ" className="h-10 object-contain mb-4" />
              {phoneCaption && (
                <p className="text-white/50 text-xs mb-1">{phoneCaption}</p>
              )}
              <a href={`tel:${phone}`} className="text-orange-400 font-bold text-lg hover:text-orange-300 transition-colors block mb-1">
                {phoneDisplay}
              </a>
              <a href="mailto:gosavtosimf+111385@mail.ru" className="text-white/50 text-sm hover:text-white/80 transition-colors block mb-3">
                gosavtosimf+111385@mail.ru
              </a>
              {infoUrl && (
                <a
                  href={infoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-wide border border-orange-400/40 rounded-md px-3 py-1.5"
                >
                  <Icon name="FileText" size={12} fallback="Info" />
                  {infoLabel}
                </a>
              )}
            </div>

            {/* Branches */}
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Филиалы · Пн–Пт: 10:00–18:30</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  { name: "Гагарина", addr: "ул. Гагарина, 20А" },
                  { name: "Киевская", addr: "Киевская ул., 41" },
                  { name: "Залесская", addr: "Залесская ул., 121" },
                  { name: "Самокиша", addr: "ул. Самокиша, 4" },
                  { name: "Лермонтова", addr: "ул. Лермонтова, 13А" },
                  { name: "Автодром Титова", addr: "ул. Титова, 77" },
                ].map(b => (
                  <div key={b.name} className="flex items-center gap-1.5 text-sm">
                    <span className="text-orange-400 text-xs">📍</span>
                    <span className="text-white/70">{b.name}:</span>
                    <span className="text-white/40">{b.addr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Навигация</p>
              <div className="flex flex-col gap-2 text-sm text-white/60">
                <a href="#tariffs" className="hover:text-orange-400 transition-colors">Тарифы</a>
                <a href="#instructors" className="hover:text-orange-400 transition-colors">Инструкторы</a>
                <a href="#about" className="hover:text-orange-400 transition-colors">Филиалы</a>
                <a href="#finance" className="hover:text-orange-400 transition-colors">Рассрочка</a>
                <a href="#lead-form" className="hover:text-orange-400 transition-colors">Записаться</a>
              </div>
            </div>
          </div>

          {/* Legal info */}
          <div className="border-t border-white/10 pt-5">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="text-xs text-white/30 space-y-1">
                <p><span className="text-white/50 font-semibold">Юр. лицо:</span> ООО «СВЕТОФОР»</p>
                <p><span className="text-white/50 font-semibold">ИНН:</span> 9102062316 · <span className="text-white/50 font-semibold">КПП:</span> 910201001 · <span className="text-white/50 font-semibold">ОГРН:</span> 1149102136875</p>
                <p><span className="text-white/50 font-semibold">Банк:</span> ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ» БАНКА ВТБ (ПАО)</p>
              </div>
              <div className="text-xs text-white/30 space-y-1 md:text-right">
                <p>г. Симферополь, Киевская ул., 41</p>
                <p>Городская. Открытая. Современная.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
              <p>© 2026 Автошкола ГОСАШ · Все права защищены</p>
              <div className="flex flex-wrap gap-4">
                <FooterPolicyButtons />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}