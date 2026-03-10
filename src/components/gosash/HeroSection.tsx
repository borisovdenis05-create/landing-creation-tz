import { LOGO_URL, HERO_IMAGE, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

interface HeroSectionProps {
  onCallbackOpen: () => void;
}

export default function HeroSection({ onCallbackOpen }: HeroSectionProps) {
  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="flex-shrink-0">
            <img src={LOGO_URL} alt="ГОСАШ Автошкола" className="h-12 object-contain" style={{ filter: "brightness(10)" }} />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-white/70 uppercase tracking-wider">
            <a href="#tariffs" className="hover:text-red-500 transition-colors">Тарифы</a>
            <a href="#instructors" className="hover:text-red-500 transition-colors">Инструкторы</a>
            <a href="#reviews" className="hover:text-red-500 transition-colors">Отзывы</a>
            <a href="#about" className="hover:text-red-500 transition-colors">Филиалы</a>
            <a href="#contacts" className="hover:text-red-500 transition-colors">Контакты</a>
          </nav>

          <div className="hidden md:flex flex-col items-end gap-0.5">
            <a href={`tel:${PHONE}`} className="text-red-500 font-black text-base hover:text-red-400 transition-colors tracking-wide">
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/40 text-xs uppercase tracking-wider">Пн–Пт: 10:00–18:30</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCallbackOpen}
              className="btn-accent text-sm py-2 px-5 whitespace-nowrap"
            >
              Обратный звонок
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ background: "#111111" }}>
        {/* Красная диагональная полоса */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[120%] h-[120%]" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(227,0,0,0.08) 100%)" }} />
        </div>
        {/* Сетка точек */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Левая колонка — текст */}
            <div className="animate-fade-up z-10" style={{ opacity: 0, animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/40 px-4 py-1.5 mb-6" style={{ borderRadius: "2px" }}>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Набор 2026 открыт</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-5 uppercase" style={{ letterSpacing: "-0.02em" }}>
                Стань<br />
                <span className="text-red-500">уверенным</span><br />
                водителем
              </h1>
              <p className="text-white/60 text-lg mb-6 leading-relaxed font-medium" style={{ textTransform: "none", letterSpacing: "normal", fontWeight: 500 }}>
                Городская автошкола Симферополя с вдумчивым подходом и 6 программами обучения.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Прозрачные платежи", "Рассрочка 0%", "KIA RIO АКПП/МКПП"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 border border-white/15 px-3 py-1.5 text-white/80 text-sm font-semibold" style={{ borderRadius: "2px", textTransform: "none", letterSpacing: "normal" }}>
                    <span className="text-red-500 font-black text-base">✓</span> {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <a href="#tariffs" className="btn-accent text-base py-4 px-8">
                  Выбрать тариф
                </a>
                <button onClick={onCallbackOpen} className="btn-outline-yellow text-base py-4 px-8">
                  Записаться на пробное
                </button>
              </div>
              <div className="flex flex-wrap gap-8 border-t border-white/10 pt-8">
                {[["56–70", "часов вождения"], ["6", "тарифов"], ["0%", "рассрочка"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-4xl font-black text-red-500" style={{ letterSpacing: "-0.03em" }}>{num}</p>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка — авто + форма */}
            <div className="flex flex-col gap-5 z-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(227,0,0,0.12) 0%, transparent 70%)" }} />
                <img
                  src={HERO_IMAGE}
                  alt="Учебный автомобиль"
                  className="w-full max-w-lg object-contain relative z-10"
                  style={{ filter: "drop-shadow(0 20px 60px rgba(227,0,0,0.2))" }}
                />
              </div>
              <div className="p-6 border border-white/10" style={{ background: "#1a1a1a", borderRadius: "4px" }}>
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
