import Icon from "@/components/ui/icon";
import { tariffs } from "./shared";

interface TariffsSectionProps {
  onTariffSelect: (tariffName: string) => void;
}

export default function TariffsSection({ onTariffSelect }: TariffsSectionProps) {
  return (
    <>
      {/* ============ TARIFFS ============ */}
      <section id="tariffs" className="py-20 section-alt">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">Выберите свою программу обучения</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Все цены фиксируются в договоре. Никаких скрытых платежей.
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
                          <Icon name="Plus" size={12} className="text-orange-400 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-white/60">{e}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.bonuses.length > 0 && (
                    <div className="rounded-lg px-3 py-2 mt-2 space-y-1 border border-orange-500/20" style={{ background: "rgba(232,146,26,0.05)" }}>
                      <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide mb-1">Бонусы</p>
                      {t.bonuses.map((b) => (
                        <div key={b} className="flex items-start gap-2 text-xs">
                          <Icon name="Gift" size={12} className="text-orange-400 flex-shrink-0 mt-0.5" fallback="Circle" />
                          <span className="text-white/60">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-3">
                    <p className="text-2xl font-black text-white">
                      {t.price.toLocaleString("ru-RU")} ₽
                    </p>
                    {t.gsm > 0 && (
                      <p className="text-white/40 text-xs mt-0.5">+ ГСМ от {t.gsm.toLocaleString("ru-RU")} ₽</p>
                    )}
                  </div>

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
    </>
  );
}
