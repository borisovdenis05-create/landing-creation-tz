import { ymGoal } from "@/components/gosash/shared";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/403b7c35-5e7e-4b24-939e-e08d2f087325.png";
const PHONE = "+79789937221";
const PHONE_DISPLAY = "+7 (978) 993 72 21";
const HOME_URL = "https://твоя.автошкола82.рф/";

export default function ThankYou() {
  return (
    <div
      className="min-h-screen font-montserrat flex flex-col"
      style={{ background: "#f4f4f4", color: "#1a1a1a" }}
    >
      {/* ============ HEADER ============ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
        style={{ background: "#2e2e2e" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a href={HOME_URL} className="flex-shrink-0">
            <img
              src={LOGO_URL}
              alt="ГОСАШ Автошкола"
              className="h-12 object-contain"
              style={{ filter: "brightness(10)" }}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-4 text-xs font-bold text-white/70 uppercase tracking-wide">
            <a
              href={`${HOME_URL}#tariffs`}
              className="hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Тарифы
            </a>
            <a
              href={`${HOME_URL}#promos`}
              className="hover:text-orange-400 transition-colors whitespace-nowrap text-orange-400"
            >
              Акции
            </a>
            <a
              href="https://автошкола82.рф/instruktory/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Инструкторы
            </a>
            <a
              href={`${HOME_URL}#reviews`}
              className="hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Отзывы
            </a>
            <a
              href={`${HOME_URL}#about`}
              className="hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Филиалы
            </a>
            <a
              href={`${HOME_URL}#contacts`}
              className="hover:text-orange-400 transition-colors whitespace-nowrap"
            >
              Контакты
            </a>
          </nav>

          <div className="hidden md:flex flex-col items-end gap-0.5">
            <a
              href={`tel:${PHONE}`}
              onClick={() => ymGoal("phone_click")}
              className="text-orange-400 font-black text-base hover:text-orange-300 transition-colors tracking-wide"
            >
              {PHONE_DISPLAY}
            </a>
            <span className="text-white/40 text-xs uppercase tracking-wider">
              Пн–Пт: 10:00–18:30
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={HOME_URL}
              className="btn-accent text-xs sm:text-sm py-2 px-3 sm:px-5 whitespace-nowrap"
            >
              <span className="hidden sm:inline">На главную</span>
              <span className="sm:hidden">Главная</span>
            </a>
          </div>
        </div>
      </header>

      {/* ============ THANK YOU CONTENT ============ */}
      <main className="flex-1 flex items-center justify-center pt-20 pb-16 px-4">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Иконка-чекмарк */}
          <div className="flex justify-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "#e8921a" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 24L20 34L38 14"
                  stroke="white"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Карточка */}
          <div
            className="rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl"
            style={{ background: "#2e2e2e" }}
          >
            {/* Бейдж */}
            <div className="flex justify-center mb-6">
              <span
                className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-sm"
                style={{ background: "rgba(232,146,26,0.15)", color: "#e8921a", border: "1px solid rgba(232,146,26,0.3)" }}
              >
                Автошкола ГОСАШ · Симферополь
              </span>
            </div>

            {/* Заголовок */}
            <h1
              className="text-4xl md:text-5xl font-black text-white uppercase mb-5 leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Заявка{" "}
              <span className="text-orange-400">принята!</span>
            </h1>

            {/* Подзаголовок */}
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 font-medium">
              Спасибо за обращение. Наш менеджер свяжется с вами в ближайшее время.
            </p>

            {/* Дополнительная инфо */}
            <div
              className="rounded-xl p-5 mb-8 text-left space-y-3"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-black text-lg leading-none mt-0.5">✓</span>
                <span className="text-white/80 text-sm">
                  Обычно мы перезваниваем в течение <strong className="text-white">15 минут</strong> в рабочее время
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-black text-lg leading-none mt-0.5">✓</span>
                <span className="text-white/80 text-sm">
                  Если хотите связаться прямо сейчас — звоните:{" "}
                  <a
                    href={`tel:${PHONE}`}
                    onClick={() => ymGoal("phone_click")}
                    className="text-orange-400 font-bold hover:text-orange-300 transition-colors"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-orange-400 font-black text-lg leading-none mt-0.5">✓</span>
                <span className="text-white/80 text-sm">
                  Режим работы: <strong className="text-white">Пн–Пт: 10:00–18:30</strong>
                </span>
              </div>
            </div>

            {/* Кнопка */}
            <a
              href={HOME_URL}
              className="btn-accent text-base py-4 px-10 inline-block"
              onClick={() => ymGoal("thank_you_back_to_main")}
            >
              Вернуться на главную
            </a>
          </div>

          {/* Подпись */}
          <p className="mt-6 text-gray-400 text-sm">
            Ждём вас в одном из{" "}
            <a
              href={`${HOME_URL}#about`}
              className="text-orange-400 hover:text-orange-300 transition-colors font-semibold"
            >
              6 филиалов
            </a>{" "}
            автошколы ГОСАШ в Симферополе
          </p>
        </div>
      </main>

      {/* ============ FOOTER ============ */}
      <footer
        className="border-t border-white/10 pt-10 pb-6"
        style={{ background: "#1e1e1e" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            {/* Logo + contact */}
            <div className="flex-shrink-0">
              <img
                src={LOGO_URL}
                alt="ГОСАШ"
                className="h-10 object-contain mb-4"
                style={{ filter: "brightness(10)" }}
              />
              <a
                href={`tel:${PHONE}`}
                className="text-orange-400 font-bold text-lg hover:text-orange-300 transition-colors block mb-1"
              >
                {PHONE_DISPLAY}
              </a>
              <a
                href="mailto:gosavtosimf+111385@mail.ru"
                className="text-white/50 text-sm hover:text-white/80 transition-colors block"
              >
                gosavtosimf+111385@mail.ru
              </a>
            </div>

            {/* Branches */}
            <div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                Филиалы · Пн–Пт: 10:00–18:30
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  { name: "Гагарина", addr: "ул. Гагарина, 20А" },
                  { name: "Киевская", addr: "Киевская ул., 41" },
                  { name: "Залесская", addr: "Залесская ул., 121" },
                  { name: "Самокиша", addr: "ул. Самокиша, 4" },
                  { name: "Лермонтова", addr: "ул. Лермонтова, 13А" },
                  { name: "Автодром Титова", addr: "ул. Титова, 77" },
                ].map((b) => (
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
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                Навигация
              </p>
              <div className="flex flex-col gap-2 text-sm text-white/60">
                <a
                  href={`${HOME_URL}#tariffs`}
                  className="hover:text-orange-400 transition-colors"
                >
                  Тарифы
                </a>
                <a
                  href={`${HOME_URL}#instructors`}
                  className="hover:text-orange-400 transition-colors"
                >
                  Инструкторы
                </a>
                <a
                  href={`${HOME_URL}#about`}
                  className="hover:text-orange-400 transition-colors"
                >
                  Филиалы
                </a>
                <a
                  href={`${HOME_URL}#finance`}
                  className="hover:text-orange-400 transition-colors"
                >
                  Рассрочка
                </a>
                <a
                  href={HOME_URL}
                  className="hover:text-orange-400 transition-colors"
                >
                  На главную
                </a>
              </div>
            </div>
          </div>

          {/* Legal info */}
          <div className="border-t border-white/10 pt-5">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="text-xs text-white/30 space-y-1">
                <p>
                  <span className="text-white/50 font-semibold">Юр. лицо:</span> ООО «СВЕТОФОР»
                </p>
                <p>
                  <span className="text-white/50 font-semibold">ИНН:</span> 9102062316 ·{" "}
                  <span className="text-white/50 font-semibold">КПП:</span> 910201001 ·{" "}
                  <span className="text-white/50 font-semibold">ОГРН:</span> 1149102136875
                </p>
                <p>
                  <span className="text-white/50 font-semibold">Банк:</span> ФИЛИАЛ «ЦЕНТРАЛЬНЫЙ» БАНКА ВТБ (ПАО)
                </p>
              </div>
              <div className="text-xs text-white/30 space-y-1 md:text-right">
                <p>г. Симферополь, Киевская ул., 41</p>
                <p>Городская. Открытая. Современная.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
              <p>© 2026 Автошкола ГОСАШ · Все права защищены</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={HOME_URL}
                  className="hover:text-white/50 transition-colors"
                >
                  Политика конфиденциальности
                </a>
                <a
                  href={HOME_URL}
                  className="hover:text-white/50 transition-colors"
                >
                  Публичная оферта
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
