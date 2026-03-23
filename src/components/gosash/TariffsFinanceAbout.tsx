import TariffsSection from "./TariffsSection";
import FinanceSection from "./FinanceSection";
import FaqSection from "./FaqSection";
import AboutSection from "./AboutSection";

interface TariffsFinanceAboutProps {
  onTariffSelect: (tariffName: string) => void;
}

export default function TariffsFinanceAbout({ onTariffSelect }: TariffsFinanceAboutProps) {
  return (
    <>
      <TariffsSection onTariffSelect={onTariffSelect} />
      <FinanceSection />
      <FaqSection />
      <AboutSection />
    </>
  );
}
