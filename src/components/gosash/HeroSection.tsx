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
            <a href="#tariffs" className="hover:text-yellow-400 transition-colors">Тарифы</a>
            <a href="#instructors" className="hover:text-yellow-400 transition-colors">Инструкторы</a>
            <a href="#reviews" className="hover:text-yellow-400 transition-colors">Отзывы</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">Филиалы</a>
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
      <section id="hero" className="relative min-h-screen flex items-center pt-20 bg-navy overflow-hidden">
        {/* Декоративная сетка */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fdbb30 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Жёлтый акцент-блок справа */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-yellow-400/10 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Левая колонка — текст */}
            <div className="animate-fade-up z-10" style={{ opacity: 0, animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-sm font-semibold">Набор 2026 открыт</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
                Стань уверенным<br />
                <span className="text-yellow-400">водителем</span><br />
                в Симферополе
              </h1>
              <p className="text-white/90 text-lg mb-5 leading-relaxed font-medium">
                Городская автошкола с вдумчивым подходом и&nbsp;6&nbsp;программами обучения.
              </p>
              <div className="flex flex-wrap gap-2 mb-8 text-sm">
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-white font-medium"><span className="text-yellow-400 font-black">✓</span> Прозрачные платежи</span>
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-white font-medium"><span className="text-yellow-400 font-black">✓</span> Рассрочка 0%</span>
                <span className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-white font-medium"><span className="text-yellow-400 font-black">✓</span> KIA RIO АКПП/МКПП</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#tariffs" className="btn-accent text-base py-4 px-8 font-bold">
                  Выбрать тариф
                </a>
                <button onClick={onCallbackOpen} className="btn-outline-yellow text-base py-4 px-8">
                  Записаться на пробное
                </button>
              </div>
              <div className="flex flex-wrap gap-8">
                {[["56–70", "часов вождения"], ["6", "тарифов"], ["0%", "рассрочка"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-3xl font-black text-yellow-400">{num}</p>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка — авто + форма */}
            <div className="flex flex-col gap-6 z-10">
              {/* Автомобиль */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/15 to-transparent" />
                <img
                  src={HERO_IMAGE}
                  alt="Учебный автомобиль KIA RIO"
                  className="w-full max-w-lg object-contain drop-shadow-2xl relative z-10"
                  style={{ filter: "drop-shadow(0 20px 60px rgba(253,187,48,0.25))" }}
                />
              </div>
              {/* Форма */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <LeadForm
                  title="Записаться на пробное занятие"
                  subtitle="Бесплатная консультация · Ответим за 15 минут"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}