import Icon from "@/components/ui/icon";
import { usePublicList, usePublicSettings } from "./shared/publicApi";

type Faq = { id: number; question: string; answer: string };

const FALLBACK_FAQ: Faq[] = [
  { id: 1, question: "Сколько стоит обучение в автошколе ГОСАШ в Симферополе?", answer: "Стоимость обучения на права категории B — от 39 900 ₽ (программа Базовый Онлайн). Цены зафиксированы в договоре, скрытых платежей нет. Доступна рассрочка 0% на 3–6 месяцев." },
  { id: 2, question: "Нужна ли медицинская справка для записи в автошколу?", answer: "Да, медицинская справка формы 003-В/у обязательна до начала вождения. Пройти медосмотр можно в любой аккредитованной клинике Симферополя. Теоретические занятия можно начать и без справки." },
  { id: 3, question: "Можно ли оплатить обучение в рассрочку?", answer: "Да. Рассрочка 0% на 3, 4 или 6 месяцев без переплат — проценты за вас платит автошкола. Первый платёж через месяц. Доступна для программ Приоритет, Углублённый и ВИП. Также доступен кредит от Т-Банка на срок до 24 месяцев." },
  { id: 4, question: "Можно ли выбрать инструктора по вождению?", answer: "Да, в программах Приоритет, Углублённый, ВИП, Леди Драйв и Материнский капитал вы можете выбрать инструктора. В программах Базовый и Базовый Онлайн инструктор назначается автошколой." },
  { id: 5, question: "Как проходит теория — онлайн или офлайн?", answer: "В большинстве программ доступен выбор: онлайн через личный кабинет или офлайн в учебном классе." },
  { id: 6, question: "Что будет, если не сдам экзамен в ГИБДД с первого раза?", answer: "Можно записаться на дополнительные занятия по вождению. В среднем наши ученики сдают вождение за 1,9 попытки." },
  { id: 7, question: "На каких автомобилях проходит обучение?", answer: "Обучение проводится на KIA RIO — не старше 2019 года. Все автомобили оснащены кондиционером. Доступен выбор АКПП или МКПП." },
  { id: 8, question: "Сколько длится обучение в автошколе?", answer: "Стандартный курс — около 3 месяцев. Расписание гибкое: утро, день, вечер, в том числе выходные." },
  { id: 9, question: "Где находятся филиалы автошколы ГОСАШ?", answer: "В Симферополе работают 5 учебных классов: на Гагарина, Киевской, Залесской, Самокиша и Лермонтова. Плюс автодром на ул. Титова, 77." },
];

export default function FaqSection() {
  const { items } = usePublicList<Faq>("public-faq");
  const { settings } = usePublicSettings();
  const data = items && items.length > 0 ? items : FALLBACK_FAQ;
  const title = settings.faq_title || "Всё что нужно знать об обучении в ГОСАШ";

  if (settings.block_faq === "false") return null;

  return (
    <section id="faq" className="py-20 section-alt">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-2">Частые вопросы</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 uppercase">{title}</h2>
        </div>
        <div className="space-y-3">
          {data.map((item) => (
            <details key={item.id} className="group rounded-xl border border-gray-200 overflow-hidden" style={{ background: "#ffffff" }}>
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none font-bold text-gray-900 text-sm md:text-base group-open:text-orange-500 transition-colors list-none">
                <span>{item.question}</span>
                <Icon name="ChevronDown" size={18} className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200" fallback="Circle" />
              </summary>
              <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100 whitespace-pre-line">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
