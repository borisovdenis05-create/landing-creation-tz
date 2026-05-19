import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { ymGoal, sendLead } from "./analytics";
import { usePublicSettings } from "./publicApi";

export interface CallbackModalProps {
  onClose: () => void;
}

export function CallbackModal({ onClose }: CallbackModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { settings } = usePublicSettings();
  const submitLabel = settings.btn_callback_submit || "Жду звонка";

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
                {loading ? "Отправка..." : submitLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}