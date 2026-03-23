import { LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

const BG_IMAGE = "https://cdn.poehali.dev/files/e3619330-6419-457e-8867-8459672dfecb.jpg";

interface HeroSectionProps {
  onCallbackOpen: () => void;
}

export default function HeroSection({ onCallbackOpen }: HeroSectionProps) {
  return (
    <>
      {/* ============ HEADER ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ background: "#2e2e2e" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="flex-shrink-0">
            <img src={LOGO_URL} alt="ГОСАШ Автошкола" className="h-12 object-contain" style={{ filter: "brightness(10)" }} />
          </a>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-white/70 uppercase tracking-wide">
            <a href="#tariffs" className="hover:text-orange-400 transition-colors whitespace-nowrap">Тарифы</a>
            <a href="https://автошкола82.рф/instruktory/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors whitespace-nowrap">Инструкторы</a>
            <a href="#reviews" className="hover:text-orange-400 transition-colors whitespace-nowrap">Отзывы</a>
            <a href="#about" className="hover:text-orange-400 transition-colors whitespace-nowrap">Филиалы</a>
            <a href="#contacts" className="hover:text-orange-400 transition-colors whitespace-nowrap">Контакты</a>
          </nav>

          <div className="hidden md:flex flex-col items-end gap-0.5">
            <a href={`tel:${PHONE}`} className="text-orange-400 font-black text-base hover:text-orange-300 transition-colors tracking-wide">
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/40 text-xs uppercase tracking-wider">Пн–Пт: 10:00–18:30</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onCallbackOpen} className="btn-accent text-xs sm:text-sm py-2 px-3 sm:px-5 whitespace-nowrap">
              <span className="hidden sm:inline">Обратный звонок</span>
              <span className="sm:hidden">Перезвоните</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section
        id="hero"
        className="relative flex flex-col pt-20 overflow-hidden hero-bg-animate"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Затемнение */}
        <div className="absolute inset-0 hero-overlay" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)" }} />

        {/* Контент — прибит к низу */}
        <div className="relative flex-1 flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-10 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              {/* Левый блок — текст */}
              <div className="max-w-xl">
                {/* Заголовок */}
                <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-5 uppercase drop-shadow-lg" style={{ letterSpacing: "-0.02em" }}>
                  Стань<br />
                  <span className="text-orange-400">уверенным</span><br />
                  водителем
                </h1>

                {/* Описание */}
                <p className="hero-desc text-white/90 text-lg mb-6 leading-relaxed font-medium drop-shadow">
                  Городская автошкола Симферополя с вдумчивым подходом и 6 программами обучения.
                </p>

                {/* Преимущества */}
                <div className="hero-badges flex flex-wrap gap-2 mb-8">
                  {["Прозрачные платежи", "Рассрочка 0%", "KIA RIO АКПП/МКПП"].map(t => (
                    <span key={t} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-sm font-semibold rounded-sm">
                      <span className="text-orange-400 font-black">✓</span> {t}
                    </span>
                  ))}
                </div>

                {/* Кнопки */}
                <div className="hero-buttons flex flex-col sm:flex-row gap-3">
                  <a href="#tariffs" className="btn-accent text-base py-4 px-8">
                    Выбрать тариф
                  </a>
                  <button onClick={onCallbackOpen} className="btn-outline-yellow text-base py-4 px-8">
                    Записаться на пробное
                  </button>
                </div>
              </div>

              {/* Правый блок — форма */}
              <div className="hero-form w-full lg:w-auto flex-shrink-0 lg:pr-6">
                <div className="w-full lg:w-[380px] p-6 border border-white/15 backdrop-blur-md shadow-2xl" style={{ background: "rgba(0,0,0,0.55)", borderRadius: "8px" }}>
                  <LeadForm
                    title="Записаться на пробное занятие"
                    subtitle="Бесплатная консультация · Ответим за 15 минут"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}