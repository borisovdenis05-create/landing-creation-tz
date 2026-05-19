import { useState, useCallback } from "react";
import { ymGoal, sendLead } from "./analytics";
import { usePublicSettings } from "./publicApi";
import { ConsentCheckboxes, DEFAULT_CONSENTS, consentAllGiven, type ConsentState } from "./ConsentCheckboxes";

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
  const [consents, setConsents] = useState<ConsentState>(DEFAULT_CONSENTS);
  const [showConsentError, setShowConsentError] = useState(false);
  const { settings } = usePublicSettings();
  const submitLabel = settings.btn_lead_submit || "Записаться на обучение →";

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    if (!consentAllGiven(consents)) { setShowConsentError(true); return; }
    setShowConsentError(false);
    setLoading(true);
    ymGoal("lead_form_submit", { tariff: comment || "не указан" });
    await sendLead(name, phone, comment);
    setLoading(false);
    setSent(true);
  }, [name, phone, comment, consents]);

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
        {loading ? "Отправка..." : submitLabel}
      </button>
      <ConsentCheckboxes value={consents} onChange={v => { setConsents(v); setShowConsentError(false); }} dark={dark} />
      {showConsentError && (
        <p className="text-red-500 text-[11px] text-center font-semibold">Для отправки заявки необходимо подтвердить все согласия выше.</p>
      )}
    </form>
  );
}