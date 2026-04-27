import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, target: string, params?: object) => void;
  }
}

const YM_ID = 101026698;
const LEAD_GOALS = new Set(["lead_form_submit", "callback_request", "promo_form_submit"]);
export function ymGoal(target: string, params?: object) {
  window.ym?.(YM_ID, "reachGoal", target, params);
  if (LEAD_GOALS.has(target)) {
    window.ym?.(YM_ID, "reachGoal", "lead", params);
  }
}

const SEND_LEAD_URL = "https://functions.poehali.dev/d8995d2d-80a5-44fe-b27d-99cdaca844e6";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

async function sendLead(name: string, phone: string, comment = "") {
  await fetch(SEND_LEAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, comment, ...getUtmParams() }),
  });
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
    hoursLabel: "58 часов вождения",
    theory: "Только онлайн",
    instructor: "Без выбора инструктора",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Личный кабинет для онлайн-занятий по теории",
    ],
    extras: [] as string[],
    restrictions: ["Нет выбора инструктора", "Нет переноса занятий за 24 часа", "Теория только онлайн (офлайн недоступна)"],
    bonuses: [] as string[],
    price: 39900,
    gsm: 10000,
    featured: false,
    badge: "ОНЛАЙН" as string | null,
    color: "",
    installment: null as string | null,
    duration: null as string | null,
  },
  {
    id: "base",
    name: "БАЗОВЫЙ",
    hours: 58,
    hoursLabel: "58 часов вождения",
    theory: "Онлайн/офлайн",
    instructor: "Без выбора инструктора",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Личный кабинет для онлайн-занятий по теории",
    ],
    extras: [] as string[],
    restrictions: ["Нет выбора инструктора", "Нет переноса занятий за 24 часа"],
    bonuses: [] as string[],
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
      "Курс Магистральный (4 часа) — 4 500 ₽",
    ],
    extras: [] as string[],
    restrictions: [] as string[],
    bonuses: [
      "Вводное занятие «Как правильно учиться в автошколе?»",
      "Видеоурок «Как пользоваться навигатором?»",
      "Видеоурок «Как ездить в дождь»",
      "Видеоурок «Как общаться с ГИБДД»",
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
    name: "УГЛУБЛЁННЫЙ",
    hours: 72,
    hoursLabel: "72 часа вождения",
    theory: "Онлайн/офлайн",
    instructor: "Выбор ТОП-инструктора",
    features: [
      "Выбор филиала",
      "Методические материалы",
      "KIA RIO АКПП/МКПП",
      "Возможность переноса занятий за 24 часа",
      "Выбор ТОП-инструктора",
      "Выбор времени занятий (вождение)",
      "Выбор времени занятий (теория)",
      "Личный кабинет для онлайн-занятий по теории",
      "Курс Парковочный (4 часа) — 5 000 ₽",
      "Курс Магистральный (4 часа) — 4 500 ₽",
      "Курс Городской (4 часа) — 4 500 ₽",
      "Пробный Экзамен (2 часа) — 2 500 ₽",
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

export interface LeadFormProps {
  title?: string;
  subtitle?: string;
  defaultTariff?: string;
  dark?: boolean;
}

export function LeadForm({ title, subtitle, defaultTariff = "", dark = false }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState(defaultTariff);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);
    ymGoal("lead_form_submit", { tariff: comment || "не указан" });
    await sendLead(name, phone, comment);
    setLoading(false);
    setSent(true);
  }, [name, phone, comment]);

  const inputClass = `w-full rounded-lg px-4 py-3 text-sm font-medium outline-none transition-colors border-2 ${
    dark
      ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-yellow-400"
  }`;

  if (sent) {
    return (
      <div className={`text-center py-8 ${dark ? "text-white" : "text-navy"}`}>
        <div className="text-5xl mb-4">✅</div>
        <p className="text-xl font-bold mb-2">Заявка отправлена!</p>
        <p className={`text-sm ${dark ? "text-white/70" : "text-gray-500"}`}>Мы позвоним вам в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {title && <h3 className={`text-xl font-bold mb-1 ${dark ? "text-white" : "text-navy"}`}>{title}</h3>}
      {subtitle && <p className={`text-sm mb-4 ${dark ? "text-white/70" : "text-gray-500"}`}>{subtitle}</p>}
      <input
        type="text"
        placeholder="Ваше имя *"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="tel"
        placeholder="+7 (___) ___ __ __ *"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="text"
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className={inputClass}
      />
      <button type="submit" disabled={loading} className="btn-accent w-full text-base py-4 font-bold disabled:opacity-60">
        {loading ? "Отправка..." : "Записаться на обучение →"}
      </button>
      <p className={`text-xs text-center ${dark ? "text-white/40" : "text-gray-400"}`}>
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
}

export interface CallbackModalProps {
  onClose: () => void;
}

export function CallbackModal({ onClose }: CallbackModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!name || !phone) return;
    setLoading(true);
    ymGoal("callback_request");
    await sendLead(name, phone, "Обратный звонок");
    setLoading(false);
    setSent(true);
  }, [name, phone]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <Icon name="X" size={22} />
        </button>
        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">📞</div>
            <p className="text-xl font-bold text-navy mb-2">Ждите звонка!</p>
            <p className="text-gray-500 text-sm">Перезвоним в течение 15 минут в рабочее время.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-navy mb-1">Обратный звонок</h3>
            <p className="text-gray-500 text-sm mb-5">Оставьте номер — перезвоним за 15 минут</p>
            <div className="space-y-3">
              <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm border-2 border-gray-200 outline-none focus:border-yellow-400" />
              <input type="tel" placeholder="+7 (___) ___ __ __" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm border-2 border-gray-200 outline-none focus:border-yellow-400" />
              <button onClick={handleSend} disabled={loading} className="btn-primary w-full text-base py-4 disabled:opacity-60">
                {loading ? "Отправка..." : "Жду звонка"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}