import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast, ImageUpload } from "./AdminUi";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Tariff = {
  id?: number; name: string; hours: number; hours_label: string;
  theory: string; instructor: string; price: number; gsm: number;
  badge: string; color: string; featured: boolean; installment: string;
  duration: string; features: string[]; restrictions: string[]; bonuses: string[];
  sort_order: number; active: boolean;
};

export type Branch = {
  id?: number; name: string; addr: string; rating: number;
  map_url: string; active: boolean; sort_order: number;
};

export type Instructor = {
  id?: number; name: string; experience: string; specialization: string;
  photo_url: string; is_top: boolean; is_lady: boolean; active: boolean; sort_order: number;
};

export type Review = {
  id?: number; author: string; text: string; rating: number;
  photo_url: string; source: string; active: boolean; sort_order: number;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────
const EMPTY_TARIFF: Tariff = {
  name: "", hours: 56, hours_label: "56 часов вождения", theory: "Онлайн/офлайн",
  instructor: "Без выбора инструктора", price: 0, gsm: 0, badge: "", color: "",
  featured: false, installment: "", duration: "", features: [], restrictions: [],
  bonuses: [], sort_order: 0, active: true,
};

const EMPTY_BRANCH: Branch = { name: "", addr: "", rating: 5.0, map_url: "", active: true, sort_order: 0 };
const EMPTY_INSTRUCTOR: Instructor = { name: "", experience: "", specialization: "", photo_url: "", is_top: false, is_lady: false, active: true, sort_order: 0 };
const EMPTY_REVIEW: Review = { author: "", text: "", rating: 5, photo_url: "", source: "", active: true, sort_order: 0 };

// ─── TariffEditor ─────────────────────────────────────────────────────────────
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

// ─── Tab: Tariffs ─────────────────────────────────────────────────────────────
export function TariffsTab({ token }: { token: string }) {
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
export function BranchesTab({ token }: { token: string }) {
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
export function InstructorsTab({ token }: { token: string }) {
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
export function ReviewsTab({ token }: { token: string }) {
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
