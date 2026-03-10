import Icon from "@/components/ui/icon";
import { tariffs, partners, PHONE, PHONE_DISPLAY } from "./shared";

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
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">Категория B · 2026</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-3">Выберите свою программу обучения</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Все цены фиксируются в договоре. ГСМ (бензин) — отдельно. Никаких скрытых платежей.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tariffs.map((t) => (
              <div
                key={t.id}
                className={`tariff-card p-6 flex flex-col ${t.featured ? "featured" : ""} ${
                  t.color === "navy" ? "border-navy" : ""
                } ${t.color === "pink" ? "border-pink-300" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className={`text-lg font-black ${t.color === "navy" ? "text-navy" : "text-gray-900"}`}>
                    {t.name}
                  </h3>
                  {t.badge && (
                    <span className={`badge-hit flex-shrink-0 ml-2 ${
                      t.color === "navy" ? "bg-navy text-white" :
                      t.color === "pink" ? "bg-pink-100 text-pink-700" :
                      t.color === "green" ? "bg-green-100 text-green-700" : ""
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Car" size={15} className="text-yellow-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-gray-700 font-semibold">{t.hoursLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="BookOpen" size={15} className="text-yellow-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-gray-600">Теория: {t.theory}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="User" size={15} className="text-yellow-500 flex-shrink-0" fallback="Circle" />
                    <span className="text-gray-600">{t.instructor}</span>
                  </div>
                  {t.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={15} className="text-yellow-500 flex-shrink-0" fallback="Circle" />
                      <span className="text-gray-600">Срок: {t.duration}</span>
                    </div>
                  )}

                  {t.features.length > 0 && (
                    <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
                      {t.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-xs">
                          <Icon name="Check" size={12} className="text-green-500 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-gray-600">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.restrictions.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {t.restrictions.map((r) => (
                        <div key={r} className="flex items-start gap-2 text-xs">
                          <Icon name="X" size={12} className="text-red-400 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-gray-400">{r}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.extras.length > 0 && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2 mt-2 space-y-1">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Доп. курсы</p>
                      {t.extras.map((e) => (
                        <div key={e} className="flex items-start gap-2 text-xs">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span className="text-gray-500">{e}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.bonuses.length > 0 && (
                    <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Бонусы</p>
                      {t.bonuses.map((b) => (
                        <div key={b} className="flex items-start gap-2 text-xs">
                          <span className="text-yellow-500 font-bold mt-0.5">+</span>
                          <span className="text-gray-600">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <p className={`text-3xl font-black ${t.featured ? "text-yellow-500" : t.color === "pink" ? "text-pink-600" : "text-navy"}`}>
                    {t.price.toLocaleString()} ₽
                  </p>
                  {t.gsm > 0 ? (
                    <>
                      <p className="text-xs text-gray-400 mt-0.5">без ГСМ</p>
                      <p className="text-xs text-gray-400">ГСМ (бензин): ~{t.gsm.toLocaleString()} ₽</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Итого с ГСМ: ~{(t.price + t.gsm).toLocaleString()} ₽
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5">включая все курсы программы</p>
                  )}
                  {t.installment && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-yellow-700 font-semibold">Рассрочка: {t.installment}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onTariffSelect(t.name)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    t.featured
                      ? "bg-yellow-400 text-navy hover:bg-yellow-500"
                      : "bg-navy text-white hover:bg-navy/80"
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
      <section id="finance" className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">Т-Банк</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Платите как удобно</h2>
            <p className="text-white/70 max-w-xl mx-auto">Рассрочка 0% или кредит от Т-Банка</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/15">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Icon name="Percent" size={22} className="text-navy" fallback="Star" />
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

            <div className="bg-white/10 rounded-2xl p-8 border border-white/15">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <Icon name="CreditCard" size={22} className="text-navy" fallback="Star" />
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

          <div className="bg-white/10 rounded-2xl p-8 border border-white/15 mb-8">
            <h3 className="text-xl font-black mb-6 text-center">Как оформить за 3 шага</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: "1", text: "Заполните онлайн-заявку на нашем сайте" },
                { num: "2", text: "Дождитесь одобрения — обычно в течение дня" },
                { num: "3", text: "Заключите договор и начните обучение" },
              ].map(s => (
                <div key={s.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-navy font-black text-lg flex-shrink-0">
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

          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/40 text-xs leading-relaxed text-center">
              * Кредитные продукты предоставляются АО «Тинькофф Банк» (Т-Банк). Процентная ставка — от 6,709% до 70% годовых. Сумма и срок определяются банком индивидуально. Период охлаждения — 4 часа (в соответствии с ФЗ № 9-ФЗ). Подробности на сайте tbank.ru.
            </p>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-14">
            <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-2">Почему мы</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-8">Почему выбирают ГОСАШ?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "Heart", title: "Вдумчивые инструкторы", desc: "Подбираем подход к каждому ученику. Помогаем преодолеть страх и обрести уверенность на дороге." },
                { icon: "Shield", title: "Полная прозрачность", desc: "Никаких скрытых платежей. Цена фиксируется в договоре. ГСМ — отдельно, по факту." },
                { icon: "Car", title: "Современный автопарк", desc: "Комфортные KIA RIO с АКПП и МКПП. Учебные авто в отличном техническом состоянии." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-yellow-400/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={22} className="text-yellow-500" fallback="Star" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Филиалы */}
          <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-navy mb-2 text-center">
              Автошкола ГОСАШ предлагает на выбор один из 6 классов в разных районах
            </h3>
            <p className="text-gray-500 text-center text-sm mb-8">Пн–Пт: 10:00–18:30 · Обед: 13:30–14:00 · <a href={`tel:${PHONE}`} className="text-yellow-500 font-bold hover:text-yellow-600">{PHONE_DISPLAY}</a></p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Филиал на Гагарина", addr: "ул. Гагарина, 20А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAb-1K" },
                { name: "Филиал на Киевской", addr: "Киевская ул., 41, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAfQLi" },
                { name: "Филиал на Залесской", addr: "Залесская ул., 121, Симферополь", rating: 4.8, map: "https://yandex.ru/maps/-/CPBAjU2Y" },
                { name: "Филиал на Самокиша", addr: "ул. Самокиша, 4, Симферополь", rating: 4.9, map: "https://yandex.ru/maps/-/CPBAnA6k" },
                { name: "Филиал на Лермонтова", addr: "ул. Лермонтова, 13А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBArZ88" },
              ].map((branch) => (
                <div key={branch.name} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-yellow-400 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-navy text-sm">{branch.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{branch.addr}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1">
                      <span className="text-red-500 text-xs">📍</span>
                      <span className="font-black text-sm text-navy">{branch.rating.toFixed(1)}</span>
                      <div className="flex gap-0.5 ml-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xs ${s <= Math.floor(branch.rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a
                    href={branch.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Icon name="Map" size={12} fallback="Circle" />
                    Карта проезда
                  </a>
                </div>
              ))}
            </div>

            {/* Автодром */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-yellow-400 hover:shadow-md transition-all max-w-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-navy text-sm">Автодром на Титова</p>
                  <p className="text-gray-500 text-xs mt-0.5">ул. Титова, 77, Симферополь</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1">
                  <span className="text-red-500 text-xs">📍</span>
                  <span className="font-black text-sm text-navy">4.7</span>
                  <div className="flex gap-0.5 ml-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-xs ${s <= 4 ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="https://yandex.ru/maps/-/CPBAvA4B"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                <Icon name="Map" size={12} fallback="Circle" />
                Карта проезда
              </a>
            </div>
          </div>

          {/* Общая карта */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 h-80">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=34.0900%2C44.9500&z=13&pt=34.0802,44.9523,pm2rdm~34.1093,44.9432,pm2rdm~34.0650,44.9750,pm2rdm~34.0920,44.9580,pm2rdm~34.1020,44.9490,pm2rdm~34.0750,44.9420,pm2rdm~34.0600,44.9380,pm2rdm"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Все филиалы ГОСАШ на карте"
            />
          </div>
        </div>
      </section>
    </>
  );
}