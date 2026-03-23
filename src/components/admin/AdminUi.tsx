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

// ─── LoginForm ────────────────────────────────────────────────────────────────
export function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await api("/login", "POST", { login, password });
    if (res.ok) {
      localStorage.setItem("gosash_admin_token", res.token);
      onLogin(res.token);
    } else {
      setError(res.error || "Ошибка");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1a1a1a" }}>
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-black text-sm uppercase hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

export { useToast };
