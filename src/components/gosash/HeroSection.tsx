import { LOGO_URL, PHONE, PHONE_DISPLAY, LeadForm } from "./shared";

const BG_IMAGE = "https://cdn.poehali.dev/files/b056ef9e-5ddc-40e9-ae9c-be43ba9a34b0.jpg";

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
            <a href="#tariffs" className="hover:text-red-500 transition-colors whitespace-nowrap">Тарифы</a>
            <a href="https://автошкола82.рф/instruktory/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors whitespace-nowrap">Инструкторы</a>
            <a href="#reviews" className="hover:text-red-500 transition-colors whitespace-nowrap">Отзывы</a>
            <a href="#about" className="hover:text-red-500 transition-colors whitespace-nowrap">Филиалы</a>
            <a href="#contacts" className="hover:text-red-500 transition-colors whitespace-nowrap">Контакты</a>
          </nav>

          <div className="hidden md:flex flex-col items-end gap-0.5">
            <a href={`tel:${PHONE}`} className="text-red-500 font-black text-base hover:text-red-400 transition-colors tracking-wide">
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/40 text-xs uppercase tracking-wider">Пн–Пт: 10:00–18:30</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onCallbackOpen} className="btn-accent text-sm py-2 px-5 whitespace-nowrap">
              Обратный звонок
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col pt-20 overflow-hidden"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Затемнение */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)" }} />

        {/* Верхний контент */}
        <div className="relative flex-1 flex items-start">
          <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 w-full">
            <div className="max-w-xl">
              {/* Заголовок */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-5 uppercase drop-shadow-lg" style={{ letterSpacing: "-0.02em" }}>
                Стань<br />
                <span className="text-red-500">уверенным</span><br />
                водителем
              </h1>

              {/* Описание */}
              <p className="text-white/90 text-lg mb-6 leading-relaxed font-medium drop-shadow">
                Городская автошкола Симферополя с вдумчивым подходом и 6 программами обучения.
              </p>

              {/* Преимущества */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["Прозрачные платежи", "Рассрочка 0%", "KIA RIO АКПП/МКПП"].map(t => (
                  <span key={t} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-sm font-semibold rounded-sm">
                    <span className="text-red-400 font-black">✓</span> {t}
                  </span>
                ))}
              </div>

              {/* Кнопки */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#tariffs" className="btn-accent text-base py-4 px-8">
                  Выбрать тариф
                </a>
                <button onClick={onCallbackOpen} className="btn-outline-yellow text-base py-4 px-8">
                  Записаться на пробное
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижний правый угол — форма */}
        <div className="relative max-w-7xl mx-auto px-4 pb-10 w-full flex justify-end">
          <div className="w-full max-w-sm p-6 border border-white/15 backdrop-blur-md shadow-2xl" style={{ background: "rgba(0,0,0,0.55)", borderRadius: "8px" }}>
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