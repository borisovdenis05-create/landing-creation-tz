import { LOGO_URL, HERO_IMAGE, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

interface HeroSectionProps {
  onCallbackOpen: () => void;
}

export default function HeroSection({ onCallbackOpen }: HeroSectionProps) {
  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="flex-shrink-0">
            <img src={LOGO_URL} alt="ГОСАШ Автошкола" className="h-12 object-contain" style={{ filter: "brightness(10)" }} />
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/80">
            <a href="#about" className="hover:text-yellow-400 transition-colors">Об автошколе</a>
            <a href="#tariffs" className="hover:text-yellow-400 transition-colors">Тарифы</a>
            <a href="#instructors" className="hover:text-yellow-400 transition-colors">Инструкторы</a>
            <a href="#reviews" className="hover:text-yellow-400 transition-colors">Отзывы</a>
            <a href="#contacts" className="hover:text-yellow-400 transition-colors">Контакты</a>
          </nav>

          <div className="hidden md:flex flex-col items-end gap-1">
            <a href={`tel:${PHONE}`} className="text-yellow-400 font-bold text-base hover:text-yellow-300 transition-colors">
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/50 text-xs">Пн–Пт: 10:00–18:30</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCallbackOpen}
              className="btn-outline-yellow text-sm py-2 px-4 hidden sm:inline-block"
            >
              Обратный звонок
            </button>
            <a href="#lead-form" className="btn-accent text-sm py-2 px-4 whitespace-nowrap">
              Записаться
            </a>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
        <div className="absolute inset-0 bg-navy/30" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-sm font-semibold">Набор 2026 открыт</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
              Стань уверенным<br />
              <span className="text-yellow-400">водителем</span><br />
              в Симферополе
            </h1>
            <p className="text-white/80 text-lg mb-4 leading-relaxed">
              Городская автошкола с вдумчивым подходом и&nbsp;6&nbsp;программами обучения.
            </p>
            <div className="flex flex-wrap gap-3 mb-8 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><span className="text-yellow-400">✓</span> Полная прозрачность платежей</span>
              <span className="flex items-center gap-1.5"><span className="text-yellow-400">✓</span> Рассрочка 0% от Т-Банка</span>
              <span className="flex items-center gap-1.5"><span className="text-yellow-400">✓</span> KIA RIO (АКПП/МКПП)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="#tariffs" className="btn-accent text-base py-4 px-8 font-bold">
                Выбрать тариф
              </a>
              <button onClick={onCallbackOpen} className="btn-outline-yellow text-base py-4 px-8">
                Записаться на пробное
              </button>
            </div>
            <div className="flex flex-wrap gap-6">
              {[["56–70", "часов вождения"], ["6", "тарифов обучения"], ["0%", "рассрочка"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-yellow-400">{num}</p>
                  <p className="text-white/60 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <LeadForm
              title="Записаться на пробное занятие"
              subtitle="Бесплатная консультация · Ответим за 15 минут"
            />
          </div>
        </div>
      </section>
    </>
  );
}