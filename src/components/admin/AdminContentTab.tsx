import Icon from "@/components/ui/icon";

type SectionCard = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  tab: string;
  hint?: string;
};

const SECTIONS: SectionCard[] = [
  { id: "hero", title: "Hero (главный экран)", desc: "Заголовок, описание, фон, телефон", icon: "Image", tab: "settings", hint: "Раздел «Настройки сайта»" },
  { id: "hero_features", title: "Hero — преимущества", desc: "3 плашки под заголовком", icon: "Sparkles", tab: "hero_features" },
  { id: "marquee", title: "Бегущая строка", desc: "Текст с фигурами в шапке сайта", icon: "TextCursor", tab: "marquee" },
  { id: "tariffs", title: "Программы обучения", desc: "Тарифы, цены, скидки, состав", icon: "Tag", tab: "tariffs" },
  { id: "promos", title: "Специальные предложения", desc: "Акции с картинками", icon: "Megaphone", tab: "promos" },
  { id: "fleet", title: "Автомобили (Автопарк)", desc: "Видимость и заголовок секции", icon: "Car", tab: "settings", hint: "Включить/выключить в «Видимость блоков»" },
  { id: "finance", title: "Рассрочка / Финансы", desc: "Варианты оплаты, условия рассрочки и кредита", icon: "Percent", tab: "finance" },
  { id: "faq", title: "Частые вопросы (FAQ)", desc: "Вопросы и ответы", icon: "HelpCircle", tab: "faq" },
  { id: "branches", title: "Филиалы", desc: "Адреса, рейтинги, карты", icon: "MapPin", tab: "branches" },
  { id: "reviews", title: "Довольные выпускники / Отзывы", desc: "Карточки отзывов с фото и оценкой", icon: "Star", tab: "reviews" },
  { id: "stats", title: "ГОСАШ в цифрах", desc: "Статистика и достижения", icon: "BarChart3", tab: "stats" },
  { id: "instructors", title: "Инструкторы", desc: "Команда автошколы", icon: "Users", tab: "instructors" },
  { id: "contacts", title: "Контакты", desc: "Телефон, email, соцсети, часы работы", icon: "Phone", tab: "settings", hint: "Раздел «Настройки сайта»" },
];

export function ContentTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div>
      <p className="text-white/50 text-sm mb-6">
        Все секции сайта. Нажмите на карточку, чтобы перейти к редактору.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.tab)}
            className="group text-left p-5 rounded-xl border border-white/10 hover:border-orange-400/60 hover:bg-orange-500/5 transition-all"
            style={{ background: "#3a3a3a" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon name={s.icon as Parameters<typeof Icon>[0]["name"]} size={18} fallback="Circle" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">{s.title}</p>
                <p className="text-white/50 text-xs mt-1 leading-snug">{s.desc}</p>
                {s.hint && (
                  <p className="text-orange-400/80 text-[10px] mt-2 uppercase tracking-wide font-semibold">→ {s.hint}</p>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-white/30 group-hover:text-orange-400 flex-shrink-0 mt-1" fallback="Circle" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContentTab;
