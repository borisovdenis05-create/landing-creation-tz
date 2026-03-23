import { useState } from "react";
import Icon from "@/components/ui/icon";
import { PHONE, PHONE_DISPLAY } from "./shared";

const BRANCHES = [
  { name: "Гагарина", addr: "ул. Гагарина, 20А", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAb-1K", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0993%2C44.9354&z=17&pt=34.0993,44.9354,pm2rdm" },
  { name: "Киевская", addr: "Киевская ул., 41", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAfQLi", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0869%2C44.9527&z=17&pt=34.0869,44.9527,pm2rdm" },
  { name: "Залесская", addr: "Залесская ул., 121", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAjU2Y", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0417%2C44.9763&z=17&pt=34.0417,44.9763,pm2rdm" },
  { name: "Самокиша", addr: "ул. Самокиша, 4", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBAnA6k", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0950%2C44.9480&z=17&pt=34.0950,44.9480,pm2rdm" },
  { name: "Лермонтова", addr: "ул. Лермонтова, 13А", type: "Учебный класс", mapUrl: "https://yandex.ru/maps/-/CPBArZ88", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0807%2C44.9434&z=17&pt=34.0807,44.9434,pm2rdm" },
  { name: "Автодром Титова", addr: "ул. Титова, 77", type: "Автодром", mapUrl: "https://yandex.ru/maps/-/CPBAvA4B", embedUrl: "https://yandex.ru/map-widget/v1/?ll=34.0700%2C44.9310&z=17&pt=34.0700,44.9310,pm2rdm" },
];

const BRANCH_CARDS = [
  { name: "Филиал на Гагарина", addr: "ул. Гагарина, 20А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAb-1K" },
  { name: "Филиал на Киевской", addr: "Киевская ул., 41, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBAfQLi" },
  { name: "Филиал на Залесской", addr: "Залесская ул., 121, Симферополь", rating: 4.8, map: "https://yandex.ru/maps/-/CPBAjU2Y" },
  { name: "Филиал на Самокиша", addr: "ул. Самокиша, 4, Симферополь", rating: 4.9, map: "https://yandex.ru/maps/-/CPBAnA6k" },
  { name: "Филиал на Лермонтова", addr: "ул. Лермонтова, 13А, Симферополь", rating: 5.0, map: "https://yandex.ru/maps/-/CPBArZ88" },
];

const STATS = [
  { value: "94,5%", label: "учеников сдают теорию в ГИБДД с первого раза", icon: "GraduationCap" },
  { value: "19", label: "лицензированных инструкторов в штате", icon: "Users" },
  { value: "1,9", label: "попытки нужно в среднем для сдачи вождения в городе", icon: "Car" },
  { value: "356 лет", label: "общий опыт работы инструкторов", icon: "Award" },
  { value: "9,4/10", label: "оценка качества услуг учениками", icon: "Star" },
  { value: "122", label: "ученика в год обучает каждый инструктор", icon: "BookOpen" },
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

export default function AboutSection() {
  return (
    <>
      {/* ============ ABOUT ============ */}
      <section id="about" className="py-20" style={{ background: "#f4f4f4" }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Филиалы */}
          <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 text-center uppercase">
              Филиалы в разных районах Симферополя
            </h3>
            <p className="text-gray-600 text-center text-sm mb-8">
              Пн–Пт: 10:00–18:30 · Обед: 13:30–14:00 ·{" "}
              <a href={`tel:${PHONE}`} className="text-orange-500 font-bold hover:text-orange-400">{PHONE_DISPLAY}</a>
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {BRANCH_CARDS.map((branch) => (
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
                        {[1, 2, 3, 4, 5].map(s => (
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
            {STATS.map((stat) => (
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
