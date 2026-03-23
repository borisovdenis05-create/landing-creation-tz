import { useState, useEffect } from "react";
import { api } from "@/components/admin/adminApi";
import Icon from "@/components/ui/icon";

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

function PromoModal({ promo, onClose }: { promo: Promo; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#1a1a1a" }}
      >
        {/* Изображение */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={promo.image_url}
            alt={promo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85))" }} />
          {promo.badge && (
            <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
              {promo.badge}
            </span>
          )}
        </div>

        {/* Контент */}
        <div className="p-6">
          <h3 className="text-white font-black text-xl leading-tight mb-1">{promo.title}</h3>
          {promo.subtitle && (
            <p className="text-orange-400 font-bold text-base mb-4">{promo.subtitle}</p>
          )}
          <p className="text-white/70 text-sm leading-relaxed">{promo.description}</p>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm hover:bg-orange-600 transition-colors"
          >
            Понятно
          </button>
        </div>

        {/* Крестик */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/40 text-white/70 hover:text-white transition-colors"
        >
          <Icon name="X" size={16} fallback="Circle" />
        </button>
      </div>
    </div>
  );
}

function PromoCard({ promo, onClick }: { promo: Promo; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-2xl overflow-hidden text-left cursor-pointer focus:outline-none"
      style={{
        aspectRatio: "947 / 328",
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* Фото */}
      <img
        src={promo.image_url}
        alt={promo.title}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* Тёмный оверлей при наведении */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.25)" }}
      />

      {/* Бейдж */}
      {promo.badge && (
        <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
          {promo.badge}
        </span>
      )}

      {/* Подсказка "нажмите" */}
      <div
        className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full
          opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
      >
        <Icon name="Info" size={12} fallback="Circle" />
        Подробнее
      </div>
    </button>
  );
}

// Заглушки на случай пустой БД
const FALLBACK_PROMOS: Promo[] = [
  {
    id: 1,
    title: "Бесконечная уверенность за рулём",
    subtitle: "8 часов за 8 000 ₽",
    description: "Специальная программа для тех, кто хочет быстро преодолеть страх вождения. 8 часов практики с опытным инструктором — только для женщин.",
    image_url: "https://cdn.poehali.dev/files/517c9c30-606e-4d4e-bf36-4451bd75c1f6.jpg",
    badge: "Только для женщин",
    active: true,
    sort_order: 1,
  },
  {
    id: 2,
    title: "Вернём 13%",
    subtitle: "При наличии официального трудоустройства",
    description: "Получите налоговый вычет 13% за обучение в нашей автошколе. Мы поможем оформить все необходимые документы для возврата средств через налоговую службу.",
    image_url: "https://cdn.poehali.dev/files/e9f1ae46-1dbc-4d5f-9ab4-12ef2042b37d.jpg",
    badge: "Налоговый вычет",
    active: true,
    sort_order: 2,
  },
  {
    id: 3,
    title: "Он не простит ошибку. Мы научим их не делать",
    subtitle: "15 000 ₽ вместо 17 000 ₽",
    description: "Специальный курс репетиции экзамена по вождению. Занятия проходят в формате реального экзамена ГИБДД. Акция действует с 20 по 31 марта!",
    image_url: "https://cdn.poehali.dev/files/375bf488-40fb-4d56-8e8a-b68eb09cfcb2.jpg",
    badge: "20–31 марта",
    active: true,
    sort_order: 3,
  },
];

export default function PromosSection() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Promo | null>(null);

  useEffect(() => {
    api("/promos", "GET")
      .then((res) => {
        const items = (res.items || []).filter((p: Promo) => p.active);
        setPromos(items.length > 0 ? items : FALLBACK_PROMOS);
      })
      .catch(() => setPromos(FALLBACK_PROMOS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (promos.length === 0) return null;

  return (
    <section id="promos" className="py-16" style={{ background: "#f4f4f4" }}>
      {selected && <PromoModal promo={selected} onClose={() => setSelected(null)} />}

      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-10">
          <p className="text-orange-500 font-black text-xs uppercase tracking-[0.2em] mb-2">Специальные предложения</p>
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase leading-tight">
            Акции <span className="text-orange-500">&amp;</span> скидки
          </h2>
        </div>

        {/* Баннеры */}
        <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} onClick={() => setSelected(promo)} />
          ))}
        </div>
      </div>
    </section>
  );
}
