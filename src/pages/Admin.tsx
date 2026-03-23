import { useState, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8";

function api(path: string, method = "GET", body?: unknown, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Admin-Token"] = token;
  return fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
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

// ─── Reusable ─────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = "text", rows }: {
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

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2">
      <Icon name="Save" size={14} fallback="Circle" />
      {loading ? "Сохранение..." : "Сохранить"}
    </button>
  );
}

function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl flex items-center gap-2 ${type === "ok" ? "bg-green-600" : "bg-red-600"}`}>
      <Icon name={type === "ok" ? "CheckCircle" : "XCircle"} size={16} fallback="Circle" />
      {msg}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

function ImageUpload({ value, onChange, token }: { value: string; onChange: (url: string) => void; token: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      const res = await api("/upload", "POST", { image: b64, filename: file.name }, token);
      if (res.url) onChange(res.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

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

// ─── Tab: Settings ────────────────────────────────────────────────────────────
function SettingsTab({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useState(() => {
    api("/settings", "GET", undefined, token).then(res => {
      setData(res);
      setLoading(false);
    });
  });

  const set = (key: string, value: string) => setData(d => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    const res = await api("/settings", "POST", { data }, token);
    show(res.ok ? "Настройки сохранены" : res.error, res.ok ? "ok" : "err");
    setSaving(false);
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-8">
      {toast && <Toast {...toast} />}
      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Globe" size={14} className="text-orange-400" fallback="Circle" /> SEO
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title (title страницы)" value={data.site_title||""} onChange={v => set("site_title",v)} />
          <Field label="Keywords" value={data.site_keywords||""} onChange={v => set("site_keywords",v)} />
          <Field label="Description" value={data.site_description||""} onChange={v => set("site_description",v)} rows={2} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Layout" size={14} className="text-orange-400" fallback="Circle" /> Первый экран
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Заголовок H1" value={data.hero_h1||""} onChange={v => set("hero_h1",v)} />
          <Field label="Подзаголовок" value={data.hero_subtitle||""} onChange={v => set("hero_subtitle",v)} rows={2} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Phone" size={14} className="text-orange-400" fallback="Circle" /> Контакты
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Телефон (числа)" value={data.phone||""} onChange={v => set("phone",v)} />
          <Field label="Телефон (отображение)" value={data.phone_display||""} onChange={v => set("phone_display",v)} />
          <Field label="Email" value={data.email||""} onChange={v => set("email",v)} />
          <Field label="Режим работы" value={data.work_hours||""} onChange={v => set("work_hours",v)} />
          <Field label="ВКонтакте (ссылка)" value={data.vk_url||""} onChange={v => set("vk_url",v)} />
          <Field label="Telegram (ссылка)" value={data.tg_url||""} onChange={v => set("tg_url",v)} />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveBtn onClick={save} loading={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Blocks ──────────────────────────────────────────────────────────────
const BLOCKS = [
  { key: "block_hero", label: "Первый экран (Hero)" },
  { key: "block_tariffs", label: "Тарифы" },
  { key: "block_fleet", label: "Автопарк" },
  { key: "block_finance", label: "Финансовый блок" },
  { key: "block_faq", label: "FAQ" },
  { key: "block_about", label: "Филиалы" },
  { key: "block_stats", label: "Статистика" },
  { key: "block_instructors", label: "Инструкторы" },
  { key: "block_reviews", label: "Отзывы" },
  { key: "block_footer", label: "Футер" },
];

function BlocksTab({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useState(() => {
    api("/settings", "GET", undefined, token).then(res => {
      setData(res);
      setLoading(false);
    });
  });

  const toggle = (key: string) => setData(d => ({ ...d, [key]: d[key] === "true" ? "false" : "true" }));

  const save = async () => {
    setSaving(true);
    const blockData = Object.fromEntries(BLOCKS.map(b => [b.key, data[b.key] || "true"]));
    const res = await api("/settings", "POST", { data: blockData }, token);
    show(res.ok ? "Сохранено" : res.error, res.ok ? "ok" : "err");
    setSaving(false);
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      <p className="text-white/50 text-sm mb-6">Включите или отключите отображение блоков на лендинге</p>
      <div className="space-y-3">
        {BLOCKS.map(b => (
          <div key={b.key} className="flex items-center justify-between p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <span className="text-white text-sm font-semibold">{b.label}</span>
            <button onClick={() => toggle(b.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${data[b.key] !== "false" ? "bg-orange-500" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data[b.key] !== "false" ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <SaveBtn onClick={save} loading={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Tariffs ─────────────────────────────────────────────────────────────
type Tariff = {
  id?: number; name: string; hours: number; hours_label: string;
  theory: string; instructor: string; price: number; gsm: number;
  badge: string; color: string; featured: boolean; installment: string;
  duration: string; features: string[]; restrictions: string[]; bonuses: string[];
  sort_order: number; active: boolean;
};

const EMPTY_TARIFF: Tariff = {
  name: "", hours: 56, hours_label: "56 часов вождения", theory: "Онлайн/офлайн",
  instructor: "Без выбора инструктора", price: 0, gsm: 0, badge: "", color: "",
  featured: false, installment: "", duration: "", features: [], restrictions: [],
  bonuses: [], sort_order: 0, active: true,
};

function TariffEditor({ tariff, onSave, onCancel, token }: {
  tariff: Tariff; onSave: () => void; onCancel: () => void; token: string;
}) {
  const [d, setD] = useState<Tariff>({ ...tariff });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const set = (key: keyof Tariff, val: unknown) => setD(prev => ({ ...prev, [key]: val }));

  const listField = (label: string, key: "features" | "restrictions" | "bonuses") => (
    <div>
      <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">{label}</label>
      <textarea
        value={(d[key] as string[]).join("\n")}
        onChange={e => set(key, e.target.value.split("\n"))}
        rows={4}
        className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors resize-none"
        style={{ background: "#3a3a3a" }}
        placeholder="По одному пункту на строку"
      />
    </div>
  );

  const save = async () => {
    setSaving(true);
    const res = await api("/tariffs", d.id ? "PUT" : "POST", d, token);
    if (res.ok) { show("Сохранено", "ok"); setTimeout(onSave, 500); }
    else show(res.error, "err");
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      {toast && <Toast {...toast} />}
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-black text-lg">{d.id ? "Редактировать тариф" : "Новый тариф"}</h3>
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} fallback="Circle" /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Название" value={d.name} onChange={v => set("name", v)} />
          <Field label="Бейдж (необязательно)" value={d.badge || ""} onChange={v => set("badge", v)} />
          <Field label="Часов вождения (число)" value={String(d.hours)} onChange={v => set("hours", parseInt(v)||0)} type="number" />
          <Field label="Подпись часов" value={d.hours_label} onChange={v => set("hours_label", v)} />
          <Field label="Теория" value={d.theory} onChange={v => set("theory", v)} />
          <Field label="Инструктор" value={d.instructor} onChange={v => set("instructor", v)} />
          <Field label="Цена (₽)" value={String(d.price)} onChange={v => set("price", parseInt(v)||0)} type="number" />
          <Field label="ГСМ (₽, 0 = включено)" value={String(d.gsm)} onChange={v => set("gsm", parseInt(v)||0)} type="number" />
          <Field label="Рассрочка" value={d.installment || ""} onChange={v => set("installment", v)} />
          <Field label="Срок обучения" value={d.duration || ""} onChange={v => set("duration", v)} />
          <Field label="Порядок сортировки" value={String(d.sort_order)} onChange={v => set("sort_order", parseInt(v)||0)} type="number" />
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Цвет карточки</label>
            <select value={d.color} onChange={e => set("color", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none"
              style={{ background: "#3a3a3a" }}>
              <option value="">Стандартный</option>
              <option value="navy">Оранжевая рамка (VIP)</option>
              <option value="pink">Розовая рамка (Леди)</option>
              <option value="green">Зелёная метка</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={d.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-white text-sm">Хит продаж</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={d.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-white text-sm">Активен</span>
          </label>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {listField("Включено в тариф", "features")}
          {listField("Ограничения", "restrictions")}
          {listField("Бонусы", "bonuses")}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm hover:text-white transition-colors">Отмена</button>
          <SaveBtn onClick={save} loading={saving} />
        </div>
      </div>
    </div>
  );
}

function TariffsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tariff | null>(null);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("/tariffs", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useState(() => { load(); });

  const del = async (id: number) => {
    if (!confirm("Удалить тариф?")) return;
    const res = await api("/tariffs", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error, "err");
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && <TariffEditor tariff={editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} token={token} />}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Тарифов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY_TARIFF })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить тариф
        </button>
      </div>
      <div className="space-y-3">
        {items.map(t => (
          <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: "#3a3a3a" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{t.name}</p>
                {t.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{t.badge}</span>}
                {!t.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Скрыт</span>}
                {t.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Хит</span>}
              </div>
              <p className="text-white/50 text-xs mt-0.5">{t.hours_label} · {t.price.toLocaleString("ru-RU")} ₽</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditing(t)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 hover:border-orange-400/40 transition-colors">
                <Icon name="Pencil" size={14} fallback="Circle" />
              </button>
              <button onClick={() => del(t.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors">
                <Icon name="Trash2" size={14} fallback="Circle" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Тарифы не добавлены</p>}
      </div>
    </div>
  );
}

// ─── Tab: Branches ────────────────────────────────────────────────────────────
type Branch = { id?: number; name: string; addr: string; rating: number; map_url: string; active: boolean; sort_order: number; };
const EMPTY_BRANCH: Branch = { name: "", addr: "", rating: 5.0, map_url: "", active: true, sort_order: 0 };

function BranchesTab({ token }: { token: string }) {
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    api("/branches", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useState(() => { load(); });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("/branches", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error, "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить филиал?")) return;
    const res = await api("/branches", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error, "err");
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} филиал</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Название" value={editing.name} onChange={v => setEditing(e => e && ({...e, name: v}))} />
              <Field label="Адрес" value={editing.addr} onChange={v => setEditing(e => e && ({...e, addr: v}))} />
              <Field label="Рейтинг (0–5)" value={String(editing.rating)} onChange={v => setEditing(e => e && ({...e, rating: parseFloat(v)||5}))} type="number" />
              <Field label="Ссылка на Яндекс Карты" value={editing.map_url} onChange={v => setEditing(e => e && ({...e, map_url: v}))} />
              <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({...e, sort_order: parseInt(v)||0}))} type="number" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.active} onChange={e => setEditing(prev => prev && ({...prev, active: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
                <span className="text-white text-sm">Активен</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Отмена</button>
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Филиалов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY_BRANCH })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить филиал
        </button>
      </div>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{b.name}</p>
              <p className="text-white/50 text-xs">{b.addr} · ⭐ {Number(b.rating).toFixed(1)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(b)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"><Icon name="Pencil" size={14} fallback="Circle" /></button>
              <button onClick={() => del(b.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} fallback="Circle" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Филиалы не добавлены</p>}
      </div>
    </div>
  );
}

// ─── Tab: Instructors ─────────────────────────────────────────────────────────
type Instructor = { id?: number; name: string; experience: string; specialization: string; photo_url: string; is_top: boolean; is_lady: boolean; active: boolean; sort_order: number; };
const EMPTY_INSTRUCTOR: Instructor = { name: "", experience: "", specialization: "", photo_url: "", is_top: false, is_lady: false, active: true, sort_order: 0 };

function InstructorsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    api("/instructors", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useState(() => { load(); });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("/instructors", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error, "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить инструктора?")) return;
    const res = await api("/instructors", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} инструктор</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="ФИО" value={editing.name} onChange={v => setEditing(e => e && ({...e, name: v}))} />
              <Field label="Опыт (напр. «12 лет»)" value={editing.experience} onChange={v => setEditing(e => e && ({...e, experience: v}))} />
              <Field label="Специализация" value={editing.specialization} onChange={v => setEditing(e => e && ({...e, specialization: v}))} />
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Фото</label>
                <ImageUpload value={editing.photo_url} onChange={v => setEditing(e => e && ({...e, photo_url: v}))} token={token} />
              </div>
              <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({...e, sort_order: parseInt(v)||0}))} type="number" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.is_top} onChange={e => setEditing(prev => prev && ({...prev, is_top: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-white text-sm">ТОП-инструктор</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.is_lady} onChange={e => setEditing(prev => prev && ({...prev, is_lady: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-white text-sm">Леди Драйв</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.active} onChange={e => setEditing(prev => prev && ({...prev, active: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-white text-sm">Активен</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Отмена</button>
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Инструкторов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY_INSTRUCTOR })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить
        </button>
      </div>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            {i.photo_url ? <img src={i.photo_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Icon name="User" size={16} className="text-white/40" fallback="Circle" /></div>}
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{i.name}</p>
              <p className="text-white/50 text-xs">{i.specialization} {i.experience && `· ${i.experience}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(i)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"><Icon name="Pencil" size={14} fallback="Circle" /></button>
              <button onClick={() => del(i.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} fallback="Circle" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Инструкторы не добавлены</p>}
      </div>
    </div>
  );
}

// ─── Tab: Reviews ─────────────────────────────────────────────────────────────
type Review = { id?: number; author: string; text: string; rating: number; photo_url: string; source: string; active: boolean; sort_order: number; };
const EMPTY_REVIEW: Review = { author: "", text: "", rating: 5, photo_url: "", source: "", active: true, sort_order: 0 };

function ReviewsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    api("/reviews", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useState(() => { load(); });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("/reviews", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error, "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return;
    const res = await api("/reviews", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} отзыв</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Имя автора" value={editing.author} onChange={v => setEditing(e => e && ({...e, author: v}))} />
              <Field label="Текст отзыва" value={editing.text} onChange={v => setEditing(e => e && ({...e, text: v}))} rows={4} />
              <Field label="Рейтинг (1–5)" value={String(editing.rating)} onChange={v => setEditing(e => e && ({...e, rating: parseInt(v)||5}))} type="number" />
              <Field label="Источник (напр. Google, 2ГИС)" value={editing.source} onChange={v => setEditing(e => e && ({...e, source: v}))} />
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Фото автора</label>
                <ImageUpload value={editing.photo_url} onChange={v => setEditing(e => e && ({...e, photo_url: v}))} token={token} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.active} onChange={e => setEditing(prev => prev && ({...prev, active: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
                  <span className="text-white text-sm">Активен</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Отмена</button>
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Отзывов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY_REVIEW })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить отзыв
        </button>
      </div>
      <div className="space-y-3">
        {items.map(r => (
          <div key={r.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            {r.photo_url ? <img src={r.photo_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> : <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><Icon name="User" size={16} className="text-white/40" fallback="Circle" /></div>}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">{r.author} {r.source && <span className="text-white/40 font-normal">· {r.source}</span>}</p>
              <p className="text-white/50 text-xs mt-0.5 truncate">{r.text}</p>
              <p className="text-orange-400 text-xs mt-0.5">{"★".repeat(r.rating)}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(r)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"><Icon name="Pencil" size={14} fallback="Circle" /></button>
              <button onClick={() => del(r.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} fallback="Circle" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Отзывы не добавлены</p>}
      </div>
    </div>
  );
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "settings", label: "Настройки", icon: "Settings" },
  { id: "blocks", label: "Блоки", icon: "Layout" },
  { id: "tariffs", label: "Тарифы", icon: "Tag" },
  { id: "branches", label: "Филиалы", icon: "MapPin" },
  { id: "instructors", label: "Инструкторы", icon: "Users" },
  { id: "reviews", label: "Отзывы", icon: "Star" },
];

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gosash_admin_token"));
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <LoginForm onLogin={setToken} />;

  const logout = () => {
    localStorage.removeItem("gosash_admin_token");
    setToken(null);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#1a1a1a" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/10 transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "#2e2e2e" }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" size={18} className="text-white" fallback="Circle" />
            </div>
            <div>
              <p className="text-white font-black text-sm">ГОСАШ</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-orange-500 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <Icon name={tab.icon as Parameters<typeof Icon>[0]["name"]} size={16} fallback="Circle" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <a href="/" target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Icon name="ExternalLink" size={16} fallback="Circle" />
            Открыть сайт
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Icon name="LogOut" size={16} fallback="Circle" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 border-b border-white/10" style={{ background: "#2e2e2e" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
            <Icon name="Menu" size={20} fallback="Circle" />
          </button>
          <h2 className="text-white font-black text-base flex-1">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
        </header>
        <main className="flex-1 p-6">
          {activeTab === "settings" && <SettingsTab token={token} />}
          {activeTab === "blocks" && <BlocksTab token={token} />}
          {activeTab === "tariffs" && <TariffsTab token={token} />}
          {activeTab === "branches" && <BranchesTab token={token} />}
          {activeTab === "instructors" && <InstructorsTab token={token} />}
          {activeTab === "reviews" && <ReviewsTab token={token} />}
        </main>
      </div>
    </div>
  );
}
