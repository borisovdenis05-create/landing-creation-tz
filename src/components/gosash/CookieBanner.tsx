import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const STORAGE_KEY = "gosash_cookie_consent_v1";

type Prefs = {
  necessary: true;
  analytics: boolean;
  functional: boolean;
  decidedAt: string;
};

function loadPrefs(): Prefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Prefs;
  } catch {
    /* noop */
  }
  return null;
}

function savePrefs(p: Omit<Prefs, "decidedAt">) {
  const full: Prefs = { ...p, decidedAt: new Date().toISOString() };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(full)); } catch { /* noop */ }
}

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!loadPrefs()) setShow(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  const acceptAll = () => {
    savePrefs({ necessary: true, analytics: true, functional: true });
    setShow(false);
  };
  const declineOptional = () => {
    savePrefs({ necessary: true, analytics: false, functional: false });
    setShow(false);
  };
  const saveCustom = () => {
    savePrefs({ necessary: true, analytics, functional });
    setShow(false);
  };

  const Check = ({ checked, disabled, onToggle, label, hint }: {
    checked: boolean; disabled?: boolean; onToggle?: () => void; label: string; hint: string;
  }) => (
    <label className={`flex items-start gap-3 p-3 rounded-xl border ${disabled ? "border-white/5 bg-white/5" : "border-white/10 hover:border-orange-400/40 cursor-pointer"}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors ${
          checked ? "bg-orange-500 border-orange-500" : "bg-transparent border-white/30"
        } ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {checked && <Icon name="Check" size={13} className="text-white" fallback="Circle" />}
      </button>
      <div>
        <p className="text-white text-sm font-bold">{label}</p>
        <p className="text-white/50 text-xs mt-0.5 leading-snug">{hint}</p>
      </div>
    </label>
  );

  return (
    <>
      <div className="fixed bottom-3 left-3 right-3 md:left-auto md:right-5 md:bottom-5 md:max-w-md z-[120] rounded-2xl border border-white/10 shadow-2xl"
           style={{ background: "#2e2e2e" }}>
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🍪</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-base">Мы используем cookie</p>
            </div>
          </div>

          <p className="text-white/70 text-[13px] leading-relaxed mb-2">
            Мы используем файлы cookie, чтобы сайт работал корректно, а также Яндекс.Метрику и Roistat для сбора анонимной статистики и улучшения работы сайта.
          </p>
          <p className="text-white/50 text-[12px] leading-relaxed mb-4">
            Нажимая «Принять всё», вы соглашаетесь на использование всех типов cookie. Вы можете выбрать, какие cookie разрешить, или отклонить все, кроме строго необходимых.
          </p>

          {settingsOpen && (
            <div className="space-y-2 mb-4">
              <Check
                checked={true}
                disabled
                label="Строго необходимые (всегда включены)"
                hint="Обеспечивают работу сайта и форм записи. Отключить нельзя."
              />
              <Check
                checked={analytics}
                onToggle={() => setAnalytics(v => !v)}
                label="Аналитические cookie"
                hint="Яндекс.Метрика, Roistat — помогают анализировать трафик и улучшать сайт."
              />
              <Check
                checked={functional}
                onToggle={() => setFunctional(v => !v)}
                label="Функциональные cookie"
                hint="Запоминают ваши настройки (если применимо)."
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={settingsOpen ? saveCustom : acceptAll}
              className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-colors"
            >
              {settingsOpen ? "Сохранить настройки" : "Принять всё"}
            </button>
            {!settingsOpen && (
              <button
                onClick={declineOptional}
                className="flex-1 px-4 py-2.5 border border-white/15 text-white/80 font-bold text-sm rounded-lg hover:bg-white/5 transition-colors"
              >
                Отклонить необязательные
              </button>
            )}
            <button
              onClick={() => setSettingsOpen(v => !v)}
              className="px-4 py-2.5 border border-white/15 text-white/80 font-bold text-sm rounded-lg hover:bg-white/5 transition-colors"
            >
              {settingsOpen ? "Скрыть" : "Настроить"}
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-white/40">
            <a href="/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline">
              Политика использования cookie
            </a>
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 underline">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
