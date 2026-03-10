import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CallbackModal, LeadForm } from "@/components/gosash/shared";
import HeroSection from "@/components/gosash/HeroSection";
import TariffsFinanceAbout from "@/components/gosash/TariffsFinanceAbout";
import InstructorsToFooter from "@/components/gosash/InstructorsToFooter";

export default function Index() {
  const [showCallback, setShowCallback] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);

  const openTariffForm = (tariffName: string) => {
    setSelectedTariff(`Интересует тариф: ${tariffName}`);
    setShowLeadModal(true);
  };

  return (
    <div className="min-h-screen bg-white font-montserrat">

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
      <div className="bg-navy/5 border-y border-navy/10 py-4 overflow-hidden">
        <div className="flex items-center gap-10 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max">
          {[
            { shape: "circle", label: "Обучение ПДД" },
            { shape: "triangle", label: "Безопасное вождение" },
            { shape: "circle", label: "Категория B" },
            { shape: "square", label: "Автодром" },
            { shape: "triangle", label: "Практика вождения" },
            { shape: "circle", label: "Симферополь" },
            { shape: "square", label: "6 филиалов" },
            { shape: "circle", label: "Обучение ПДД" },
            { shape: "triangle", label: "Безопасное вождение" },
            { shape: "circle", label: "Категория B" },
            { shape: "square", label: "Автодром" },
            { shape: "triangle", label: "Практика вождения" },
            { shape: "circle", label: "Симферополь" },
            { shape: "square", label: "6 филиалов" },
          ].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-navy/60 text-sm font-semibold uppercase tracking-widest flex-shrink-0">
              {item.shape === "circle" && (
                <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" strokeWidth="2.5"/><line x1="5" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2.5"/></svg>
              )}
              {item.shape === "triangle" && (
                <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,2 20,19 2,19" fill="none" stroke="#fdbb30" strokeWidth="2.5"/><line x1="11" y1="10" x2="11" y2="16" stroke="#fdbb30" strokeWidth="2.5"/><circle cx="11" cy="7" r="1.2" fill="#fdbb30"/></svg>
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
      <InstructorsToFooter />
    </div>
  );
}