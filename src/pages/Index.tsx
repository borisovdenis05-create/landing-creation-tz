import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CallbackModal, LeadForm } from "@/components/gosash/shared";
import HeroSection from "@/components/gosash/HeroSection";
import TariffsFinanceAbout from "@/components/gosash/TariffsFinanceAbout";
import PromosSection from "@/components/gosash/PromosSection";
import InstructorsToFooter from "@/components/gosash/InstructorsToFooter";
import { usePublicList } from "@/components/gosash/shared/publicApi";

type MarqueeItem = { id: number; label: string; shape: string };
const FALLBACK_MARQUEE: MarqueeItem[] = [
  { id: 1, label: "Обучение ПДД", shape: "circle" },
  { id: 2, label: "Безопасное вождение", shape: "triangle" },
  { id: 3, label: "Категория B", shape: "circle" },
  { id: 4, label: "Автодром", shape: "square" },
  { id: 5, label: "Практика вождения", shape: "triangle" },
  { id: 6, label: "Симферополь", shape: "circle" },
  { id: 7, label: "6 филиалов", shape: "square" },
];

export default function Index() {
  const [showCallback, setShowCallback] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const { items: marqueeDb } = usePublicList<MarqueeItem>("public-marquee");
  const marqueeBase = marqueeDb && marqueeDb.length > 0 ? marqueeDb : FALLBACK_MARQUEE;
  // Дублируем для бесшовной анимации
  const marquee = [...marqueeBase, ...marqueeBase];

  const openTariffForm = (tariffName: string, price?: number) => {
    const priceStr = price ? ` — ${price.toLocaleString("ru-RU")} ₽` : "";
    setSelectedTariff(`Интересует тариф: ${tariffName}${priceStr}`);
    setShowLeadModal(true);
  };

  return (
    <div className="min-h-screen font-montserrat" style={{ background: "#f4f4f4", color: "#1a1a1a" }}>

      {showCallback && <CallbackModal onClose={() => setShowCallback(false)} />}

      {showLeadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLeadModal(false)} />
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setShowLeadModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <Icon name="X" size={22} />
            </button>
            <LeadForm
              title="Записаться на обучение"
              subtitle="Заполните форму — мы перезвоним и ответим на все вопросы"
              defaultTariff={selectedTariff}
            />
          </div>
        </div>
      )}

      <HeroSection onCallbackOpen={() => setShowCallback(true)} />

      {/* Разделитель с дорожными знаками */}
      <div className="border-y border-black/10 py-4 overflow-hidden" style={{ background: "#e8e8e8" }}>
        <div className="flex items-center gap-10 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max">
          {marquee.map((item, i) => (
            <span key={`${item.id}-${i}`} className="inline-flex items-center gap-2 text-black/30 text-xs font-bold uppercase tracking-widest flex-shrink-0">
              {item.shape === "circle" && (
                <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="2.5"/><line x1="5" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2.5"/></svg>
              )}
              {item.shape === "triangle" && (
                <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,2 20,19 2,19" fill="none" stroke="#e8921a" strokeWidth="2.5"/><line x1="11" y1="10" x2="11" y2="16" stroke="#e8921a" strokeWidth="2.5"/><circle cx="11" cy="7" r="1.2" fill="#e8921a"/></svg>
              )}
              {item.shape === "square" && (
                <svg width="22" height="22" viewBox="0 0 22 22"><rect x="2" y="2" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/><text x="11" y="15" textAnchor="middle" fontSize="9" fill="currentColor" fontWeight="bold">P</text></svg>
              )}
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <TariffsFinanceAbout onTariffSelect={openTariffForm} />
      <PromosSection />
      <InstructorsToFooter />
    </div>
  );
}