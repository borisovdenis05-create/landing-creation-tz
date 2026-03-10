import { useState } from "react";
import Icon from "@/components/ui/icon";
import { tariffs, partners, PHONE, PHONE_DISPLAY } from "./shared";

const BRANCHES = [
  { name: "Гагарина", addr: "ул. Гагарина, 20А", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAb-1K", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0993%2C44.9354&z=17&pt=34.0993,44.9354,pm2rdm" },
  { name: "Киевская", addr: "Киевская ул., 41", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAfQLi", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0869%2C44.9527&z=17&pt=34.0869,44.9527,pm2rdm" },
  { name: "Залесская", addr: "Залесская ул., 121", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAjU2Y", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0417%2C44.9763&z=17&pt=34.0417,44.9763,pm2rdm" },
  { name: "Самокиша", addr: "ул. Самокиша, 4", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAnA6k", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0950%2C44.9480&z=17&pt=34.0950,44.9480,pm2rdm" },
  { name: "Лермонтова", addr: "ул. Лермонтова, 13А", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBArZ88", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0807%2C44.9434&z=17&pt=34.0807,44.9434,pm2rdm" },
  { name: "Автодром Титова", addr: "ул. Титова, 77", type: "Автодром", mapUrl: "https://yandex.ru/maps/-/CPBAvA4B", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0700%2C44.9310&z=17&pt=34.0700,44.9310,pm2rdm" },
];

function BranchMap() {
  const [active, setActive] = useState(0);
  const branch = BRANCHES[active];
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "#2e2e2e" }}>
      <div className="flex flex-col md:flex-row h-[480px]">
        {/* Список филиалов */}
        <div className="md:w-64 flex-shrink-0 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 flex flex-col" style={{ background: "#3a3a3a" }}>
          {BRANCHES.map((b, i) => (
            <button
              key={b.name}
              onClick={() => setActive(i)}
              className={`text-left px-4 py-3.5 border-b border-white/10 last:border-b-0 transition-all flex items-start gap-3 ${active === i ? "border-l-4 border-l-red-500" : "hover:bg-white/5 border-l-4 border-l-transparent"}`}
              style={active === i ? { background: "rgba(227,0,0,0.08)" } : undefined}
            >
              <span className="text-base mt-0.5">{b.type === "Автодром" ? "🏁" : "🏫"}</span>
              <div>
                <p className={`font-bold text-sm ${active === i ? "text-white" : "text-white/70"}`}>{b.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{b.addr}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${b.type === "Автодром" ? "bg-red-500/10 text-red-400" : "bg-white/10 text-white/60"}`}>{b.type}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Карта */}
        <div className="flex-1 relative">
          <iframe
            key={branch.embedUrl}
            src={branch.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title={branch.name}
            allowFullScreen
          />
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all border border-white/10"
            style={{ background: "#2e2e2e" }}
          >
            <Icon name="ExternalLink" size={12} fallback="Circle" />
            Открыть в Яндекс Картах
          </a>
        </div>
      </div>
    </div>
  );
}

interface TariffsFinanceAboutProps {
  onTariffSelect: (tariffName: string) => void;
}

export default function TariffsFinanceAbout({ onTariffSelect }: TariffsFinanceAboutProps) {
  return (
    <>
      {/* ============ TARIFFS ============ */}
      <section id="tariffs" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">Выберите свою программу обучения</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Все цены фиксируются в договоре. ГСМ (бензин) — отдельно. Никаких скрытых платежей.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tariffs.map((t) => (
              <div
                key={t.id}
                className={`tariff-card p-6 flex flex-col ${t.featured ? "featured" : ""} ${
                  t.color === "navy" ? "border-red-500" : ""
                } ${t.color === "pink" ? "border-pink-300" : ""}`}
                style={{ background: "#2e2e2e" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-black text-white">
                    {t.name}
                  </h3>
                  {t.badge && (
                    <span className={`badge-hit flex-shrink-0 ml-2 ${
                      t.color === "navy" ? "bg-red-500 text-white" :
                      t.color === "pink" ? "bg-pink-100 text-pink-700" :
                      t.color === "green" ? "bg-green-100 text-green-700" : ""
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Car" size={15} className="text-red-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-white font-semibold">{t.hoursLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="BookOpen" size={15} className="text-red-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-white/60">Теория: {t.theory}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="User" size={15} className="text-red-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-white/60">{t.instructor}</span>
                  </div>
                  {t.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={15} className="text-red-500 flex-shrink-0" fallback="Circle" />
                      <span className="text-white/60">Срок: {t.duration}</span>
                    </div>
                  )}

                  {t.features.length > 0 && (
                    <div className="border-t border-white/10 pt-3 mt-2 space-y-1">
                      {t.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-xs">
                          <Icon name="Check" size={12} className="text-green-500 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-white/60">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.restrictions.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {t.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2 text-xs">
                          <Icon name="X" size={12} className="text-red-400 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-white/40">{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.extras.length > 0 && (
                    <div className="rounded-lg px-3 py-2 mt-2 space-y-1 border border-white/10" style={{ background: "#222222" }}>
                      <p className="text-xs text-white/40 font-semibold uppercase tracking-wide mb-1">Доп. курсы</p>
                      {t.extras.map((e) => (
                        <div key={e} className="flex items-start gap-2 text-xs">
                          <span className="text-white/40 mt-0.5">•</span>
                          <span className="text-white/50">{e}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.bonuses.length > 0 && (
                    <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                      <p className="text-xs text-white/40 font-semibold uppercase tracking-wide mb-1">Бонусы</p>
                      {t.bonuses.map((b) => (
                        <div key={b} className="flex items-start gap-2 text-xs">
                          <span className="text-red-500 font-bold mt-0.5">+</span>
                          <span className="text-white/60">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className={`text-3xl font-black ${t.featured ? "text-red-500" : t.color === "pink" ? "text-pink-400" : "text-white"}`}>
                    {t.price.toLocaleString()} ₽
                  </p>
                  {t.gsm > 0 ? (
                    <>
                      <p className="text-xs text-white/40 mt-0.5">без ГСМ</p>
                      <p className="text-xs text-white/40">ГСМ (бензин): ~{t.gsm.toLocaleString()} ₽</p>
                      <p className="text-xs text-white/50 font-medium mt-1">
                        Итого с ГСМ: ~{(t.price + t.gsm).toLocaleString()} ₽
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-white/40 mt-0.5">включая все курсы программы</p>
                  )}
                  {t.installment && (
                    <div className="mt-2 border border-red-500/30 rounded-lg px-3 py-1.5" style={{ background: "rgba(227,0,0,0.08)" }}>
                      <p className="text-xs text-red-400 font-semibold">Рассрочка: {t.installment}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onTariffSelect(t.name)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    t.featured
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Выбрать тариф
                </button>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ============ FINANCE ============ */}
      <section id="finance" className="py-20 text-white" style={{ background: "#2e2e2e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">

            <h2 className="text-3xl md:text-4xl font-black mb-3 uppercase">Платите как удобно</h2>
            <p className="text-white/70 max-w-xl mx-auto">Рассрочка 0% или кредит от Т-Банка</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="rounded-2xl p-8 border border-white/15" style={{ background: "#3a3a3a" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <Icon name="Percent" size={22} className="text-white" fallback="Star" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Рассрочка 0%</h3>
                  <p className="text-white/60 text-sm">Выгодно — без переплат</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  ["Срок", "3, 4 или 6 месяцев"],
                  ["Переплата", "0% — платит школа"],
                  ["Первый платёж", "Через месяц"],
                  ["Дата платежа", "Любая удобная"],
                  ["Доступно для", "Приоритет, Углублённый, ВИП"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start text-sm border-b border-white/10 pb-2">
                    <span className="text-white/60">{k}</span>
                    <span className="text-white font-semibold text-right ml-4">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-8 border border-white/15" style={{ background: "#3a3a3a" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <Icon name="CreditCard" size={22} className="text-white" fallback="Star" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Кредит</h3>
                  <p className="text-white/60 text-sm">Гибко — минимальный платёж</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  ["Срок", "до 24 месяцев"],
                  ["Сумма", "от 3 000 до 500 000 ₽"],
                  ["Доступно", "На всех тарифах"],
                  ["Платёж", "Минимальный ежемесячный"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start text-sm border-b border-white/10 pb-2">
                    <span className="text-white/60">{k}</span>
                    <span className="text-white font-semibold text-right ml-4">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-8 border border-white/15 mb-8" style={{ background: "#3a3a3a" }}>
            <h3 className="text-xl font-black mb-6 text-center uppercase">Как оформить за 3 шага</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: "1", text: "Заполните онлайн-заявку на нашем сайте" },
                { num: "2", text: "Дождитесь одобрения — обычно в течение дня" },
                { num: "3", text: "Заключите договор и начните обучение" },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    {s.num}
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed pt-1.5">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a href="#lead-form" className="btn-accent text-base px-10 py-4">
              Оформить заявку
            </a>
          </div>

          <div className="mt-8 p-4 rounded-xl border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-xs leading-relaxed text-center">
              * Кредитные продукты предоставляются АО «Тинькофф Банк» (Т-Банк). Процентная ставка — от 6,709% до 70% годовых. Сумма и срок определяются банком индивидуально. Период охлаждения — 4 часа (в соответствии с ФЗ № 9-ФЗ). Подробности на сайте tbank.ru.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="py-20" style={{ background: "#f4f4f4" }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Филиалы */}
          <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center uppercase">
              6 филиалов в разных районах Симферополя
            </h3>
            <p className="text-gray-600 text-center text-sm mb-8">Пн–Пт: 10:00–18:30 · Обед: 13:30–14:00 · <a href={`tel:${PHONE}`} className="text-red-500 font-bold hover:text-red-400">{PHONE_DISPLAY}</a></p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Филиал на Гагарина", addr: "ул. Гагарина, 20А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAb-1K" },
                { name: "Филиал на Киевской", addr: "Киевская ул., 41, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAfQLi" },
                { name: "Филиал на Залесской", addr: "Залесская ул., 121, Симферополь", rating: 4.8, map: "https://yandex.ru/maps/-/CPBAjU2Y" },
                { name: "Филиал на Самокиша", addr: "ул. Самокиша, 4, Симферополь", rating: 4.9, map: "https://yandex.ru/maps/-/CPBAnA6k" },
                { name: "Филиал на Лермонтова", addr: "ул. Лермонтова, 13А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBArZ88" },
              ].map((branch) => (
                <div key={branch.name} className="border border-white/10 rounded-2xl p-5 hover:border-red-500 hover:shadow-md transition-all" style={{ background: "#2e2e2e" }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-white text-sm">{branch.name}</p>
                      <p className="text-white/50 text-xs mt-0.5">{branch.addr}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 border border-white/15 rounded-lg px-2 py-1" style={{ background: "#222222" }}>
                      <span className="text-red-500 text-xs">📍</span>
                      <span className="font-black text-sm text-white">{branch.rating.toFixed(1)}</span>
                      <div className="flex gap-0.5 ml-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xs ${s <= Math.round(branch.rating) ? "text-red-500" : "text-white/20"}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a
                    href={branch.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Icon name="Map" size={12} fallback="Circle" />
                    Карта проезда
                  </a>
                </div>
              ))}
            </div>

          </div>

          {/* Интерактивная карта */}
          <BranchMap />
        </div>
      </section>
    </>
  );
}