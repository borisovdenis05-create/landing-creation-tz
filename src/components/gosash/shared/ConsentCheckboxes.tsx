import Icon from "@/components/ui/icon";

export interface ConsentState {
  personalData: boolean;
  sms: boolean;
  policy: boolean;
}

export const DEFAULT_CONSENTS: ConsentState = {
  personalData: true,
  sms: true,
  policy: true,
};

interface Props {
  value: ConsentState;
  onChange: (v: ConsentState) => void;
  dark?: boolean;
}

export function consentAllGiven(v: ConsentState): boolean {
  return v.personalData && v.sms && v.policy;
}

export function ConsentCheckboxes({ value, onChange, dark = false }: Props) {
  const textColor = dark ? "text-white/80" : "text-gray-700";
  const linkColor = dark ? "text-orange-300 hover:text-orange-200" : "text-orange-500 hover:text-orange-600";

  const Row = ({
    checked, onToggle, children,
  }: { checked: boolean; onToggle: () => void; children: React.ReactNode }) => (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors ${
          checked
            ? "bg-orange-500 border-orange-500"
            : dark ? "bg-transparent border-white/30" : "bg-white border-gray-300"
        }`}
        aria-pressed={checked}
      >
        {checked && <Icon name="Check" size={13} className="text-white" fallback="Circle" />}
      </button>
      <span className={`text-[12px] leading-snug ${textColor}`}>{children}</span>
    </label>
  );

  return (
    <div className="space-y-2 mt-3">
      <Row
        checked={value.personalData}
        onToggle={() => onChange({ ...value, personalData: !value.personalData })}
      >
        Согласие на обработку Ваших персональных данных
      </Row>
      <Row
        checked={value.sms}
        onToggle={() => onChange({ ...value, sms: !value.sms })}
      >
        Согласие на отправку СМС-сообщений
      </Row>
      <Row
        checked={value.policy}
        onToggle={() => onChange({ ...value, policy: !value.policy })}
      >
        Нажимая на кнопку, Вы соглашаетесь с условиями{" "}
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={`underline ${linkColor}`}>
          Политики конфиденциальности
        </a>{" "}
        и{" "}
        <a href="/user-consent" target="_blank" rel="noopener noreferrer" className={`underline ${linkColor}`}>
          Согласием на обработку ПД
        </a>
      </Row>
    </div>
  );
}
