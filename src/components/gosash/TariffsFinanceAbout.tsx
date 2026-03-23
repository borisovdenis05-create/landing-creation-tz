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
      {/* Мобильный переключатель */}
      <div className="md:hidden overflow-x-auto flex gap-0 border-b border-white/10" style={{ background: "#3a3a3a" }}>
        {BRANCHES.map((b, i) => (
          <button
            key={b.name}
            onClick={() => setActive(i)}
            className={`flex-shrink-0 px-3 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${active === i ? "border-orange-400 text-white bg-orange-500/10" : "border-transparent text-white/50 hover:text-white/80"}`}
          >
            {b.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row" style={{ height: "480px" }}>
        {/* Список филиалов (только desktop) */}
        <div className="hidden md:flex md:w-64 flex-shrink-0 overflow-y-auto border-r border-white/10 flex-col" style={{ background: "#3a3a3a" }}>
          {BRANCHES.map((b, i) => (
            <button
              key={b.name}
              onClick={() => setActive(i)}
              className={`text-left px-4 py-3.5 border-b border-white/10 last:border-b-0 transition-all flex items-start gap-3 ${active === i ? "border-l-4 border-l-orange-400" : "hover:bg-white/5 border-l-4 border-l-transparent"}`}
              style={active === i ? { background: "rgba(232,146,26,0.08)" } : undefined}
            >
              <span className="text-base mt-0.5">{b.type === "Автодром" ? "🏁" : "🏫"}</span>
              <div>
                <p className={`font-bold text-sm ${active === i ? "text-white" : "text-white/70"}`}>{b.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{b.addr}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block ${b.type === "Автодром" ? "bg-orange-500/10 text-orange-400" : "bg-white/10 text-white/60"}`}>{b.type}</span>
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
                  t.color === "navy" ? "border-orange-400" : ""
                } ${t.color === "pink" ? "border-pink-300" : ""}`}
                style={{ background: "#2e2e2e" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-black text-white">{t.name}</h3>
                  {t.badge && (
                    <span className={`badge-hit flex-shrink-0 ml-2 ${
                      t.color === "navy" ? "bg-orange-500 text-white" :
                      t.color === "pink" ? "bg-pink-100 text-pink-700" :
                      t.color === "green" ? "bg-green-100 text-green-700" : ""
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Car" size={15} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                    <span className="text-white font-semibold">{t.hoursLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="BookOpen" size={15} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                    <span className="text-white/60">Теория: {t.theory}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="User" size={15} className="text-orange-400 flex-shrink-0" fallback="Circle" />
                    <span className="text-white/60">{t.instructor}</span>
                  </div>
                  {t.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={15} className="text-orange-400 flex-shrink-0" fallback="Circle" />
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
                          <Icon name="X" size={12} className="text-orange-400 flex-shrink-0 mt-0.5" fallback="Circle" />
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
                  <p className={`text-3xl font-black ${t.featured ? "text-orange-400" : t.color === "pink" ? "text-pink-400" : "text-white"}`}>
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
                    <div className="mt-2 border border-orange-500/30 rounded-lg px-3 py-1.5" style={{ background: "rgba(232,146,26,0.08)" }}>
                      <p className="text-xs text-orange-400 font-semibold flex flex-wrap gap-x-1">
                        <span className="whitespace-nowrap">Рассрочка:</span>
                        {t.installment.split("/").map((part, i, arr) => (
                          <span key={i} className="whitespace-nowrap">{part.trim()}{i < arr.length - 1 ? " /" : ""}</span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>

                {"ladyUrl" in t && t.ladyUrl && (
                  <a
                    href={t.ladyUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/40 flex items-center justify-center gap-2 mb-2"
                  >
                    <Icon name="ExternalLink" size={14} fallback="Circle" />
                    Узнать подробнее
                  </a>
                )}
                <button
                  onClick={() => onTariffSelect(t.name)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    t.featured
                      ? "bg-orange-500 text-white hover:bg-orange-600"
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

      {/* ============ FLEET ============ */}
      <section id="fleet" className="py-20" style={{ background: "#f4f4f4" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">Автомобили</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">Учитесь на современных автомобилях KIA RIO</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              Весь учебный парк автошколы ГОСАШ — одна марка, одна модель. Никаких «сюрпризов» со старыми машинами.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Только брендированные машины не старше 2019 года",
                desc: "Во всех автомобилях работают кондиционер и отопление — комфортные условия обучения в любую погоду.",
                icon: "Car",
              },
              {
                num: "02",
                title: "Равные условия для всех учеников",
                desc: "Разница между машинами минимальная — только год выпуска. Все KIA RIO одинаково оснащены и обслуживаются.",
                icon: "Users",
              },
              {
                num: "03",
                title: "Выбор коробки передач",
                desc: "Можно учиться на АКПП или МКПП — выбирайте тот тип коробки, который подходит именно вам.",
                icon: "Settings",
              },
              {
                num: "04",
                title: "Своевременное техническое обслуживание",
                desc: "Техническое состояние по регламенту — никаких срывов занятий из-за поломки автомобиля.",
                icon: "Wrench",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex gap-5 p-6 rounded-2xl border border-white/10 hover:border-orange-400/40 transition-all"
                style={{ background: "#2e2e2e" }}
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <span className="text-orange-400 font-black text-xl">{item.num}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={16} className="text-orange-400" fallback="Circle" />
                    <h3 className="text-white font-black text-sm uppercase">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
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
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
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
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
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
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
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

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 section-alt">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">Частые вопросы</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">Всё что нужно знать об обучении в ГОСАШ</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Сколько стоит обучение в автошколе ГОСАШ в Симферополе?",
                a: "Стоимость обучения на права категории B — от 39 900 ₽ (программа Базовый Онлайн). Цены зафиксированы в договоре, скрытых платежей нет. ГСМ (бензин) оплачивается отдельно по факту — от 10 000 ₽. Доступна рассрочка 0% на 3–6 месяцев.",
              },
              {
                q: "Нужна ли медицинская справка для записи в автошколу?",
                a: "Да, медицинская справка формы 003-В/у обязательна до начала вождения. Пройти медосмотр можно в любой аккредитованной клинике Симферополя. Теоретические занятия можно начать и без справки.",
              },
              {
                q: "Можно ли оплатить обучение в рассрочку?",
                a: "Да. Рассрочка 0% на 3, 4 или 6 месяцев без переплат — проценты за вас платит автошкола. Первый платёж через месяц. Доступна для программ Приоритет, Углублённый и ВИП. Также доступен кредит от Т-Банка на срок до 24 месяцев.",
              },
              {
                q: "Можно ли выбрать инструктора по вождению?",
                a: "Да, в программах Приоритет, Углублённый, ВИП, Леди Драйв и Материнский капитал вы можете выбрать инструктора. В программах Базовый и Базовый Онлайн инструктор назначается автошколой.",
              },
              {
                q: "Как проходит теория — онлайн или офлайн?",
                a: "В большинстве программ доступен выбор: онлайн через личный кабинет или офлайн в учебном классе. Программа Базовый Онлайн предусматривает только онлайн-теорию — это удобно, если сложно приезжать в класс по расписанию.",
              },
              {
                q: "Что будет, если не сдам экзамен в ГИБДД с первого раза?",
                a: "Можно записаться на дополнительные занятия по вождению. В программе Материнский капитал включено 3 бесплатные пересдачи экзамена в ГИБДД. В среднем наши ученики сдают вождение за 1,9 попытки.",
              },
              {
                q: "На каких автомобилях проходит обучение?",
                a: "Обучение проводится на KIA RIO — не старше 2019 года. Все автомобили брендированы, оснащены кондиционером и отоплением. Доступен выбор коробки передач: АКПП или МКПП.",
              },
              {
                q: "Сколько длится обучение в автошколе?",
                a: "Продолжительность зависит от программы. Стандартный курс — около 3 месяцев. Программа Леди Драйв рассчитана на 3,5 месяца. Расписание гибкое: утро, день, вечер, в том числе выходные.",
              },
              {
                q: "Где находятся филиалы автошколы ГОСАШ?",
                a: "В Симферополе работают 5 учебных классов: на Гагарина, Киевской, Залесской, Самокиша и Лермонтова. Плюс собственный автодром на ул. Титова, 77. Режим работы: Пн–Пт с 10:00 до 18:30.",
              },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl border border-gray-200 overflow-hidden" style={{ background: "#ffffff" }}>
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none font-bold text-gray-900 text-sm md:text-base group-open:text-orange-500 transition-colors list-none">
                  <span>{item.q}</span>
                  <Icon name="ChevronDown" size={18} className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200" fallback="Circle" />
                </summary>
                <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="py-20" style={{ background: "#f4f4f4" }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Филиалы */}
          <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center uppercase">
              Филиалы в разных районах Симферополя
            </h3>
            <p className="text-gray-600 text-center text-sm mb-8">Пн–Пт: 10:00–18:30 · Обед: 13:30–14:00 · <a href={`tel:${PHONE}`} className="text-orange-500 font-bold hover:text-orange-400">{PHONE_DISPLAY}</a></p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { name: "Филиал на Гагарина", addr: "ул. Гагарина, 20А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAb-1K" },
                { name: "Филиал на Киевской", addr: "Киевская ул., 41, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAfQLi" },
                { name: "Филиал на Залесской", addr: "Залесская ул., 121, Симферополь", rating: 4.8, map: "https://yandex.ru/maps/-/CPBAjU2Y" },
                { name: "Филиал на Самокиша", addr: "ул. Самокиша, 4, Симферополь", rating: 4.9, map: "https://yandex.ru/maps/-/CPBAnA6k" },
                { name: "Филиал на Лермонтова", addr: "ул. Лермонтова, 13А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBArZ88" },
              ].map((branch) => (
                <div key={branch.name} className="border border-white/10 rounded-2xl p-5 hover:border-orange-400 hover:shadow-md transition-all" style={{ background: "#2e2e2e" }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-bold text-white text-sm">{branch.name}</p>
                      <p className="text-white/50 text-xs mt-0.5">{branch.addr}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 border border-white/15 rounded-lg px-2 py-1" style={{ background: "#222222" }}>
                      <span className="text-orange-400 text-xs">📍</span>
                      <span className="font-black text-sm text-white">{branch.rating.toFixed(1)}</span>
                      <div className="flex gap-0.5 ml-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xs ${s <= Math.round(branch.rating) ? "text-orange-400" : "text-white/20"}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a
                    href={branch.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 transition-colors"
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

      {/* ============ STATS ============ */}
      <section className="py-20" style={{ background: "#2e2e2e" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase">ГОСАШ в цифрах</h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm">Факты, которые говорят сами за себя</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { value: "94,5%", label: "учеников сдают теорию в ГИБДД с первого раза", icon: "GraduationCap" },
              { value: "19", label: "лицензированных инструкторов в штате", icon: "Users" },
              { value: "1,9", label: "попытки нужно в среднем для сдачи вождения в городе", icon: "Car" },
              { value: "356 лет", label: "общий опыт работы инструкторов", icon: "Award" },
              { value: "9,4/10", label: "оценка качества услуг учениками", icon: "Star" },
              { value: "122", label: "ученика в год обучает каждый инструктор", icon: "BookOpen" },
            ].map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl p-6 flex flex-col items-center text-center border border-white/10 hover:border-orange-400/40 transition-all"
                style={{ background: "#3a3a3a" }}
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={stat.icon as Parameters<typeof Icon>[0]["name"]} size={22} className="text-orange-400" fallback="Circle" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-white mb-2 leading-none">{stat.value}</p>
                <p className="text-white/50 text-xs md:text-sm leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}