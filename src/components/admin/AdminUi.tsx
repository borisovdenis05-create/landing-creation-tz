import { useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast, useImageUpload } from "./adminApi";

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, type = "text", rows }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number;
}) {
  return (
    <div>
      <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">{label}</label>
      {rows ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)} rows={rows}
          className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors resize-none"
          style={{ background: "#3a3a3a" }}
        />
      ) : (
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors"
          style={{ background: "#3a3a3a" }}
        />
      )}
    </div>
  );
}

// ─── SaveBtn ──────────────────────────────────────────────────────────────────
export function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2">
      <Icon name="Save" size={14} fallback="Circle" />
      {loading ? "Сохранение..." : "Сохранить"}
    </button>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl flex items-center gap-2 ${type === "ok" ? "bg-green-600" : "bg-red-600"}`}>
      <Icon name={type === "ok" ? "CheckCircle" : "XCircle"} size={16} fallback="Circle" />
      {msg}
    </div>
  );
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────
export function ImageUpload({ value, onChange, token }: { value: string; onChange: (url: string) => void; token: string }) {
  const { inputRef, uploading, handleFile } = useImageUpload(token, onChange);

  return (
    <div className="flex items-center gap-3">
      {value && <img src={value} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />}
      <button type="button" onClick={() => inputRef.current?.click()}
        className="px-3 py-2 rounded-lg border border-white/15 text-white/70 text-xs hover:border-orange-400 hover:text-white transition-colors flex items-center gap-1.5"
        style={{ background: "#3a3a3a" }}>
        <Icon name="Upload" size={12} fallback="Circle" />
        {uploading ? "Загрузка..." : "Загрузить фото"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {value && (
        <input value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white/60 text-xs outline-none"
          style={{ background: "#3a3a3a" }} placeholder="URL фото" />
      )}
    </div>
  );
}

// ─── DiagModal ────────────────────────────────────────────────────────────────
type LogEntry = { time: string; level: "info" | "ok" | "warn" | "err"; text: string };

function DiagModal({ logs, onClose }: { logs: LogEntry[]; onClose: () => void }) {
  const levelColor: Record<string, string> = {
    info: "#60a5fa", ok: "#4ade80", warn: "#facc15", err: "#f87171",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.75)" }}>
      <div className="w-full max-w-lg mx-4 rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#1e1e1e" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-white font-bold text-sm flex items-center gap-2">
            <Icon name="Terminal" size={14} fallback="Circle" />
            Диагностика авторизации
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <Icon name="X" size={16} fallback="Circle" />
          </button>
        </div>
        <div className="p-4 space-y-1.5 max-h-80 overflow-y-auto font-mono text-xs">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-white/30 shrink-0">{l.time}</span>
              <span style={{ color: levelColor[l.level] }}>[{l.level.toUpperCase()}]</span>
              <span className="text-white/80 break-all">{l.text}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-white/30">Логи появятся после попытки входа</p>}
        </div>
        <div className="px-5 py-3 border-t border-white/10 text-white/30 text-xs">
          Endpoint: {new URL("https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8/login").href}
        </div>
      </div>
    </div>
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────
export function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (level: LogEntry["level"], text: string) => {
    const time = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [...prev, { time, level, text }]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLogs([]);

    const endpoint = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8/login";
    const redirectUrl = `${window.location.origin}${window.location.pathname}?cp`;

    addLog("info", `POST → ${endpoint}`);
    addLog("info", `redirectUrl после входа: ${redirectUrl}`);

    let res: Response | null = null;
    let data: Record<string, unknown> = {};

    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      addLog(
        res.status === 200 ? "ok" : res.status >= 500 ? "err" : "warn",
        `HTTP статус ответа: ${res.status} ${res.statusText}`
      );

      const contentType = res.headers.get("content-type") || "";
      addLog("info", `Content-Type: ${contentType}`);

      const text = await res.text();
      addLog("info", `Тело ответа: ${text.slice(0, 300)}`);

      try {
        data = JSON.parse(text);
      } catch {
        addLog("err", "Ответ не является валидным JSON");
      }

      if (res.status === 302 || res.redirected) {
        addLog("warn", `Обнаружен редирект → ${res.url}`);
      }

      const setCookie = res.headers.get("set-cookie");
      if (setCookie) addLog("info", `Set-Cookie: ${setCookie}`);

    } catch (err) {
      addLog("err", `Сетевая ошибка: ${String(err)}`);
    }

    if (data && data.ok) {
      addLog("ok", "Аутентификация успешна, токен получен");
      localStorage.setItem("gosash_admin_token", data.token as string);
      onLogin(data.token as string);
    } else {
      const errMsg = (data?.error as string) || (res ? `HTTP ${res.status}` : "Нет соединения");
      addLog("err", `Ошибка: ${errMsg}`);
      setError(errMsg);
      setShowDiag(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a1a" }}>
      {showDiag && <DiagModal logs={logs} onClose={() => setShowDiag(false)} />}
      <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: "#2e2e2e" }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={28} className="text-white" fallback="Circle" />
          </div>
          <h1 className="text-white font-black text-2xl uppercase">ГОСАШ Админ</h1>
          <p className="text-white/50 text-sm mt-1">Административная панель</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Логин</label>
            <input
              value={login} onChange={e => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/15 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              style={{ background: "#3a3a3a" }}
              placeholder="Введите логин"
            />
          </div>
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Пароль</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/15 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              style={{ background: "#3a3a3a" }}
              placeholder="Введите пароль"
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-500/30 p-3" style={{ background: "rgba(239,68,68,0.08)" }}>
              <p className="text-red-400 text-sm">{error}</p>
              <button type="button" onClick={() => setShowDiag(true)}
                className="text-xs text-orange-400 hover:text-orange-300 mt-1.5 flex items-center gap-1">
                <Icon name="Terminal" size={11} fallback="Circle" />
                Показать диагностику
              </button>
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm uppercase hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <button type="button" onClick={() => { setLogs([]); setShowDiag(true); }}
          className="mt-4 w-full text-xs text-white/20 hover:text-white/50 transition-colors text-center">
          Диагностика
        </button>
      </div>
    </div>
  );
}

export { useToast };