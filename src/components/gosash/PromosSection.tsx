import { useState, useEffect } from "react";
import { api } from "@/components/admin/adminApi";
import Icon from "@/components/ui/icon";
import { ymGoal } from "@/components/gosash/shared";
import { usePublicList, usePublicSettings } from "@/components/gosash/shared/publicApi";

type DbPromo = { id: number; title: string; subtitle: string; description: string; image_url: string; badge: string };

export type Promo = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  badge: string;
  active: boolean;
  sort_order: number;
};

type PromoCardData = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  badge?: string;
  price?: string;
  old_price?: string;
  period?: string;
  condition?: string;
  button_label: string;
};

function LeadModal({ promo, onClose }: { promo: PromoCardData; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    ymGoal("promo_form_submit", { promo: promo.title });
    try {
      await api("lead", "POST", { name, phone, promo: promo.title, source: "promo" });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#1a1a1a" }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 text-white/70 hover:text-white transition-colors"
        >
          <Icon name="X" size={16} fallback="Circle" />
        </button>

        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={28} className="text-white" fallback="Circle" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">Заявка отправлена!</h3>
              <p className="text-white/60 text-sm">Мы свяжемся с вами в ближайшее время</p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <>
              <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-1">Записаться на акцию</p>
              <h3 className="text-white font-black text-lg leading-snug mb-5">{promo.title}</h3>
              <input type="hidden" name="promo" value={promo.title} />
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  required
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-orange-500 transition-colors"
                  style={{ background: "#2a2a2a" }}
                />
                <input
                  required
                  type="tel"
                  placeholder="Номер телефона"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/10 focus:outline-none focus:border-orange-500 transition-colors"
                  style={{ background: "#2a2a2a" }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading ? "Отправляем..." : "Отправить заявку"}
                </button>
              </form>
              <p className="text-white/30 text-xs text-center mt-3">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PromoCard({ promo, onApply }: { promo: PromoCardData; onApply: () => void }) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
      {/* Изображение */}
      <div>
        <img
          src={promo.image_url}
          alt={promo.title}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 p-5">
        {promo.badge && (
          <span className="inline-block self-start bg-orange-100 text-orange-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            {promo.badge}
          </span>
        )}

        <h3 className="font-black text-gray-900 text-base leading-snug mb-2">{promo.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 whitespace-pre-line">{promo.description}</p>

        {promo.condition && (
          <p className="text-gray-400 text-xs italic mb-3">{promo.condition}</p>
        )}

        {/* Цена */}
        {(promo.price || promo.old_price) && (
          <div className="flex items-baseline gap-3 mb-3">
            {promo.old_price && (
              <span className="text-gray-400 text-sm line-through">{promo.old_price}</span>
            )}
            {promo.price && (
              <span className="text-orange-500 font-black text-xl">{promo.price}</span>
            )}
          </div>
        )}

        {/* Срок */}
        {promo.period && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
            <Icon name="Calendar" size={13} fallback="Circle" />
            {promo.period}
          </div>
        )}

        <button
          onClick={onApply}
          className="w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-colors mt-auto"
        >
          {promo.button_label}
        </button>
      </div>
    </div>
  );
}

const STATIC_PROMOS: PromoCardData[] = [
  {
    id: 1,
    title: "Категории две — выгода общая!",
    description: "Запишитесь на обучение сразу на две категории — А + В и получите скидку 3 000 рублей!\n\nАкция действует ограниченное количество времени — успейте воспользоваться выгодным предложением уже сейчас.\n\nС автошколой ГОСАШ вам доступно больше:\n• обучение сразу на две категории;\n• удобное расписание, современный автопарк, внимательные инструкторы;\n• возможность оплаты в рассрочку или за счёт средств материнского капитала.\n\nОставляйте заявку прямо сейчас, чтобы зафиксировать свою выгоду!\nИзменили название, сохранили качество! Автошкола ГОСАШ — ваш самый короткий путь к правам!",
    image_url: "https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/e9260c5e-c233-4ebf-9949-15dff5306ae2.jpg",
    badge: "Скидка 3 000 ₽",
    old_price: undefined,
    price: "Скидка 3 000 ₽",
    period: undefined,
    button_label: "Оставить заявку",
  },
  {
    id: 2,
    title: "Материнский капитал на обучение в автошколе",
    description: "С 2018 года стало возможным использовать материнский капитал на обучение в автошколе.\n\nНа сегодняшний день автошколы приравнены к образовательным учреждениям, имеют лицензии и выдают номерные дипломы. А это значит, что материнский капитал можно направить на оплату обучения в автошколе.\n\nСамые важные требования по законодательству о маткапитале:\n\n• Обучать в автошколе можно любого ребенка в семье, родного или усыновленного. А не только того, который дал право на материнский капитал.\n• Ребенку, давшему право на сертификат, должно исполниться 3 года на момент обращения за средствами на автошколу.\n• Ребенку, который будет обучаться, должно быть не менее 16 и не более 24 лет включительно на начало учебы.\n• Автошкола должна иметь Лицензию и утвержденную программу обучения, находилась на территории РФ.\n\nВажно знать: оплатить материнским капиталом можно только обучение ребёнка, для оплаты обучения матери его использовать нельзя.",
    image_url: "https://cdn.poehali.dev/projects/dc9c6050-1ae8-4fec-9c2b-93988f0a3169/bucket/04609627-f402-4a0d-88d8-7fa472dbb944.jpg",
    badge: "Материнский капитал",
    button_label: "Записаться",
  },
  {
    id: 3,
    title: "Вернём 13% за обучение",
    description: "Налоговый вычет. При официальном трудоустройстве вы можете вернуть 13% от стоимости обучения. Возможность частично вернуть деньги за оплату есть у тех, кто:\n\n• официально трудоустроен и оплачивает подоходный налог;\n• оплатил обучение в автошколе.\n\nТолько при соблюдении этих двух условий возможен возврат финансов. Причем получить 13% может не только лично ученик автошколы, но и его родственники.\n\nЧтобы выполнить процедуру, вам нужно подготовить конкретный перечень документов:\n\n• налоговую декларацию 3-НДФЛ;\n• заявление на возврат с расчетным счетом для зачисления средств;\n• справку о доходах;\n• паспорт гражданина РФ;\n• чеки об оплате;\n• нотариально заверенную копию договора с автошколой (должна быть указана полная цена за обучение);\n• копию лицензии учебного заведения.\n\nПраво распространяется на сумму за тот год, когда вы оплатили услуги. Подавать документы можно только на следующий год после оплаты. Возврат действует в течение 3-х лет.\n\nЖдем вас на обучение в ГОСАШ!",
    image_url: "https://cdn.poehali.dev/files/e9f1ae46-1dbc-4d5f-9ab4-12ef2042b37d.jpg",
    badge: "Налоговый вычет",
    condition: "По статье 218 Налогового кодекса РФ",
    button_label: "Узнать подробности",
  },
];

function dbToCard(p: DbPromo): PromoCardData {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    image_url: p.image_url,
    badge: p.badge || undefined,
    price: p.subtitle || undefined,
    button_label: "Оставить заявку",
  };
}

export default function PromosSection() {
  const [selected, setSelected] = useState<PromoCardData | null>(null);
  const { items: dbPromos, loading } = usePublicList<DbPromo>("public-promos");
  const { settings } = usePublicSettings();

  if (loading) return null;
  if (settings.block_promos === "false") return null;

  const promos: PromoCardData[] = dbPromos && dbPromos.length > 0
    ? dbPromos.map(dbToCard)
    : STATIC_PROMOS;

  return (
    <section id="promos" className="py-16" style={{ background: "#f4f4f4" }}>
      {selected && <LeadModal promo={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-2">Специальные предложения</p>
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase leading-tight">
            Акции <span style={{ color: "#F5C518" }}>&amp;</span>{" "}
            <span style={{ color: "#F5C518" }}>СКИДКИ</span>
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} onApply={() => { ymGoal("promo_card_click", { promo: promo.title }); setSelected(promo); }} />
          ))}
        </div>
      </div>
    </section>
  );
}