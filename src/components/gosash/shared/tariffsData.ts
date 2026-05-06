const ADMIN_API_URL = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8";

export type Tariff = {
  id: string | number;
  name: string;
  hours: number;
  hoursLabel: string;
  theory: string;
  instructor: string;
  features: string[];
  extras: string[];
  restrictions: string[];
  bonuses: string[];
  price: number;
  gsm: number;
  gsmIncluded?: boolean;
  promo?: { label: string; from: string; to: string };
  featured: boolean;
  badge: string | null;
  color: string;
  installment: string | null;
  duration: string | null;
  ladyUrl?: string | null;
};

type ApiTariff = {
  id: number;
  name: string;
  hours: number;
  hours_label: string;
  theory: string;
  instructor: string;
  price: number;
  gsm: number;
  badge: string | null;
  color: string;
  featured: boolean;
  installment: string | null;
  duration: string | null;
  features: string[];
  restrictions: string[];
  bonuses: string[];
};

function mapApiTariff(t: ApiTariff): Tariff {
  return {
    id: t.id,
    name: t.name,
    hours: t.hours,
    hoursLabel: t.hours_label,
    theory: t.theory,
    instructor: t.instructor,
    features: Array.isArray(t.features) ? t.features : [],
    extras: [],
    restrictions: Array.isArray(t.restrictions) ? t.restrictions : [],
    bonuses: Array.isArray(t.bonuses) ? t.bonuses : [],
    price: t.price,
    gsm: t.gsm,
    featured: t.featured,
    badge: t.badge,
    color: t.color || "",
    installment: t.installment,
    duration: t.duration,
  };
}

export async function fetchTariffs(): Promise<Tariff[] | null> {
  try {
    const res = await fetch(`${ADMIN_API_URL}?action=public-tariffs`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.items?.length) return null;
    return (data.items as ApiTariff[]).map(mapApiTariff);
  } catch {
    return null;
  }
}

export const LOGO_URL = "https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/403b7c35-5e7e-4b24-939e-e08d2f087325.png";
export const HERO_IMAGE = "https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/files/a7e92214-2540-48e3-9a58-cd09b5c9a74b.jpg";
export const PHONE = "+79789937221";
export const PHONE_DISPLAY = "+7 (978) 993 72 21";

export const tariffs = [
  {
    id: "base-online",
    name: "БАЗОВЫЙ ОНЛАЙН",
    hours: 58,
    hoursLabel: "58 ч. МКПП и 56 АКПП",
    theory: "Онлайн формат",
    instructor: "Без выбора инструктора",
    features: [
      "Выбор филиала",
      "KIA RIO АКПП/МКПП",
      "Личный кабинет для онлайн-занятий по теории",
      "Выбор времени занятий по вождению по договорённости с инструктором",
      "Возможность переноса занятий за 24 часа",
      "Мобильное приложение",
      "Сопровождение на всех этапах обучения",
      "Менеджер куратор обучения",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [] as string[],
    price: 45900,
    gsm: 10000,
    gsmIncluded: true,
    promo: { label: "АКЦИЯ", from: "2026-04-27", to: "2026-05-03" },
    featured: false,
    badge: "ОНЛАЙН" as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "base",
    name: "СТАНДАРТ+",
    hours: 58,
    hoursLabel: "58 ч. МКПП и 56 АКПП",
    theory: "Онлайн/офлайн формат",
    instructor: "Выбор филиала",
    features: [
      "Выбор филиала",
      "KIA RIO АКПП/МКПП",
      "Выбор дня и времени занятий по теории",
      "Личный кабинет для онлайн-занятий по теории",
      "Методические материалы",
      "Выбор времени занятий по вождению по договорённости с инструктором",
      "Возможность переноса занятий за 24 часа",
      "Курс «Магистральный» (4 часа)",
      "Мобильное приложение",
      "Сопровождение на всех этапах обучения",
      "Менеджер куратор обучения",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "Видеоурок «Скоростная магистраль. Как чувствовать себя комфортно?»",
    ],
    price: 54900,
    gsm: 10000,
    featured: false,
    badge: null as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "priority",
    name: "ПРИОРИТЕТ",
    hours: 62,
    hoursLabel: "62 ч. МКПП и 60 АКПП",
    theory: "Онлайн/офлайн формат",
    instructor: "Выбор инструктора",
    features: [
      "Выбор филиала",
      "KIA RIO АКПП/МКПП",
      "Выбор дня и времени занятий по теории",
      "Личный кабинет для онлайн-занятий по теории",
      "Методические материалы",
      "Выбор времени занятий по вождению в будние дни",
      "Возможность переноса занятий 24 часа",
      "Выбор инструктора",
      "Курс «Магистральный» (4 часа)",
      "Мобильное приложение",
      "Сопровождение на всех этапах обучения",
      "Менеджер куратор обучения",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "Видеоурок «Скоростная магистраль. Как чувствовать себя комфортно?»",
    ],
    price: 61900,
    gsm: 12000,
    featured: true,
    badge: "ХИТ ПРОДАЖ" as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "deep",
    name: "УГЛУБЛЁННАЯ",
    hours: 70,
    hoursLabel: "70 ч. МКПП и 68 АКПП",
    theory: "Онлайн/офлайн формат",
    instructor: "Выбор инструктора",
    features: [
      "Выбор филиала",
      "KIA RIO АКПП/МКПП",
      "Выбор дня и времени занятий по теории",
      "Личный кабинет для онлайн-занятий по теории",
      "Методические материалы",
      "Выбор времени занятий по вождению в будние и выходные дни",
      "Возможность переноса занятий за 24 часа",
      "Курс «Пробный экзамен» (2 часа)",
      "Курс «Магистральный» (4 часа)",
      "Курс «Парковочный» (4 часа)",
      "Мобильное приложение",
      "Сопровождение на всех этапах обучения",
      "Менеджер куратор обучения",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "Видеоурок «Скоростная магистраль. Как чувствовать себя комфортно?»",
      "Видеоурок «Как безопасно ездить в дождь»",
    ],
    price: 68900,
    gsm: 15000,
    featured: false,
    badge: null as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "matcap",
    name: "МАТЕРИНСКИЙ КАПИТАЛ",
    hours: 62,
    hoursLabel: "62 часа вождения",
    theory: "Онлайн/офлайн",
    instructor: "Выбор инструктора",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Возможность переноса занятий за 24 часа",
      "Выбор инструктора",
      "Выбор времени занятий (вождение)",
      "Выбор времени занятий (теория)",
      "Личный кабинет для онлайн-занятий по теории",
      "Конструктор маршрута (4 часа) — БЕСПЛАТНО",
      "Гарантийное занятие — 6 часов",
      "Персональный менеджер",
      "Топливо включено в стоимость программы",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "3 бесплатных сдачи экзамена в ГИБДД",
      "Вводное занятие «Как правильно учиться в автошколе?»",
      "Видеоурок «Как пользоваться навигатором?»",
      "Видеоурок «Как ездить в дождь»",
      "Видеоурок «Как общаться с ГИБДД»",
    ],
    price: 77900,
    gsm: 0,
    featured: false,
    badge: "МАТ. КАПИТАЛ" as string | null,
    color: "green",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "vip",
    name: "ВИП-программа",
    hours: 72,
    hoursLabel: "72 часа вождения",
    theory: "Индивидуальная теория",
    instructor: "Выбор ТОП-инструктора",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Возможность переноса занятий за 24 часа",
      "Выбор ТОП-инструктора",
      "Выбор времени занятий (вождение)",
      "Индивидуальная теория",
      "Личный кабинет для онлайн-занятий по теории",
      "Курс Парковочный (4 часа) — 5 000 ₽",
      "Курс Магистральный (4 часа) — 4 500 ₽",
      "Курс Городской (4 часа) — 4 500 ₽",
      "Пробный Экзамен (2 часа) — 2 500 ₽",
      "Топливо включено в стоимость программы",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "Вводное занятие «Как правильно учиться в автошколе?»",
      "Видеоурок «Как пользоваться навигатором?»",
      "Видеоурок «Как ездить в дождь»",
      "Видеоурок «Как общаться с ГИБДД»",
      "Видеоурок «Скоростная магистраль»",
      "Видеоурок от психолога + чек-лист «Как перестать бояться водить»",
    ],
    price: 109900,
    gsm: 0,
    featured: false,
    badge: "VIP" as string | null,
    color: "navy",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "lady",
    name: "ЛЕДИ ДРАЙВ",
    hours: 72,
    hoursLabel: "72 часа (МКПП) / 70 часов (АКПП)",
    theory: "Онлайн/офлайн",
    instructor: "Инструктор Высшей категории",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Возможность переноса занятий за 24 часа",
      "Инструктор Высшей категории",
      "Выбор времени занятий (вождение)",
      "Выбор времени занятий (теория)",
      "Личный кабинет для онлайн-занятий по теории",
      "Курс Парковочный (4 часа)",
      "Курс Магистральный (4 часа)",
      "Курс Кольца города НОВЫЙ (4 часа)",
      "Курс Твой маршрут (4 часа)",
      "Курс Экзаменационный НОВЫЙ (4 часа)",
      "Пробный Экзамен (2 часа)",
      "Топливо включено в стоимость программы",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "4 видеоурока от психолога (стресс во время обучения и экзамена)",
      "Видео о детской безопасности",
      "Видео о перевозке животных",
      "Оформление Европротокола и действия при ДТП",
      "Правила заправки авто",
      "Спецусловия от партнёров (ТЭС, ТИТО, G1, DIMEGRY, Фотограф Чалая)",
    ],
    price: 71900,
    gsm: 15000,
    featured: false,
    badge: "🌸 ЛЕДИ ДРАЙВ" as string | null,
    color: "pink",
    installment: "15 000 / 25 000 / 25 000 / 24 900 ₽" as string | null,
    duration: "3,5 месяца" as string | null,
    ladyUrl: "https://леди.автошкола82.рф/" as string | null,
  },
  {
    id: "retraining",
    name: "ПЕРЕОБУЧЕНИЕ (АКПП→МКПП)",
    hours: 32,
    hoursLabel: "32 часа вождения",
    theory: "Не требуется",
    instructor: "Без выбора инструктора",
    features: [
      "Обучение на МКПП для водителей с правами АКПП",
      "KIA RIO МКПП",
      "Выбор филиала",
      "Топливо включено в стоимость программы",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [] as string[],
    price: 25900,
    gsm: 0,
    featured: false,
    badge: "ПЕРЕОБУЧЕНИЕ" as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
];

export const instructors = [
  { name: "Андрей Викторович", exp: "12 лет", spec: "МКПП / АКПП, спокойный стиль", top: true, lady: false },
  { name: "Сергей Николаевич", exp: "8 лет", spec: "МКПП, работа со страхами", top: false, lady: false },
  { name: "Басова Наталья Евгеньевна", exp: "", spec: "АКПП · Леди Драйв", top: false, lady: true },
  { name: "Мусаев Мамбет Эмирасанович", exp: "", spec: "АКПП · Леди Драйв", top: false, lady: true },
  { name: "Макриди Юлия Николаевна", exp: "", spec: "МКПП · Леди Драйв", top: false, lady: true },
  { name: "Гуйван Евгений Владимирович", exp: "", spec: "МКПП · Леди Драйв", top: false, lady: true },
  { name: "Айрапетян Николай Кимович", exp: "", spec: "МКПП · Леди Драйв", top: false, lady: true },
  { name: "Богданов Игорь Васильевич", exp: "", spec: "МКПП · Леди Драйв", top: false, lady: true },
];

export const faqs = [
  { q: "Нужна ли медицинская справка?", a: "Да, медсправка формы 003-В/у обязательна до начала обучения. Вы можете пройти медосмотр в любой аккредитованной клинике Симферополя." },
  { q: "Что делать, если не сдам экзамен с первого раза?", a: "Не переживайте — это нормально. Вы можете записаться на дополнительные занятия. В тарифе «Материнский капитал» — 3 бесплатные пересдачи в ГИБДД." },
  { q: "Можно ли учиться в рассрочку?", a: "Да! Рассрочка 0% на 3, 4 или 6 месяцев от Т-Банка. Первый платёж — через месяц. Проценты платит школа, не вы. Доступна для тарифов Приоритет, Углублённый и ВИП." },
  { q: "Как происходит перенос занятий?", a: "Занятия можно перенести, предупредив инструктора заранее. Расписание гибкое — утро, день, вечер в будни и выходные." },
  { q: "Что входит в стоимость? Есть ли скрытые платежи?", a: "Нет скрытых платежей! Стоимость обучения фиксируется в договоре. В программах Материнский капитал, ВИП-программа, Леди Драйв и Переобучение топливо включено в стоимость." },
];

export const partners = [
  { name: "ТЭС", desc: "Сеть АЗС" },
  { name: "ТИТО", desc: "Партнёрские условия" },
  { name: "G1", desc: "Фитнес Парк" },
  { name: "DIMEGRY", desc: "Партнёрские условия" },
  { name: "Фотограф Чалая", desc: "Фотосессия" },
];