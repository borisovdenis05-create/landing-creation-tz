import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";
import type { Tariff } from "./AdminCrudTabs";

const EMPTY_TARIFF: Tariff = {
  name: "", hours: 56, hours_label: "56 часов вождения", theory: "Онлайн/офлайн",
  instructor: "Без выбора инструктора", price: 0, old_price: null, gsm: 0, badge: "", color: "",
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
    const res = await api("tariffs", d.id ? "PUT" : "POST", d, token);
    if (res.ok) { show("Сохранено", "ok"); setTimeout(onSave, 500); }
    else show(res.error || "Ошибка", "err");
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
          <Field label="Старая цена (₽, пусто = без скидки)" value={d.old_price ? String(d.old_price) : ""} onChange={v => set("old_price", v ? parseInt(v) : null)} type="number" />
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

export function TariffsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tariff | null>(null);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("tariffs", "GET", undefined, token)
      .then(res => {
        setItems(Array.isArray(res?.items) ? res.items : []);
        if (res?.error) show(res.error, "err");
      })
      .catch(err => show(String(err), "err"))
      .finally(() => setLoading(false));
  }, [token, show]);

  useEffect(() => { load(); }, [load]);

  const del = async (id: number) => {
    if (!confirm("Удалить тариф?")) return;
    const res = await api("tariffs", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error || "Ошибка", "err");
  };

  const toggleActive = async (t: Tariff) => {
    const res = await api("tariffs", "PUT", { ...t, active: !t.active }, token);
    if (res.ok) { show(t.active ? "Скрыто" : "Показано", "ok"); load(); }
    else show(res.error || "Ошибка", "err");
  };

  const dragId = useRef<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const handleDrop = async (targetId: number) => {
    const fromId = dragId.current;
    dragId.current = null;
    setDragOverId(null);
    if (fromId == null || fromId === targetId) return;
    const fromIdx = items.findIndex(x => x.id === fromId);
    const toIdx = items.findIndex(x => x.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const next = [...items];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setItems(next);
    const order = next.map(t => t.id!).filter(Boolean);
    const res = await api("tariffs-reorder", "POST", { order }, token);
    if (res.ok) show("Порядок обновлён", "ok");
    else { show(res.error || "Ошибка", "err"); load(); }
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
      <p className="text-white/40 text-xs mb-3 flex items-center gap-2">
        <Icon name="GripVertical" size={12} fallback="Circle" />
        Перетаскивайте карточки за ручку слева, чтобы изменить порядок отображения на сайте
      </p>
      <div className="space-y-3">
        {items.map(t => (
          <div
            key={t.id}
            draggable
            onDragStart={() => { dragId.current = t.id!; }}
            onDragOver={e => { e.preventDefault(); if (dragOverId !== t.id) setDragOverId(t.id!); }}
            onDragLeave={() => { if (dragOverId === t.id) setDragOverId(null); }}
            onDrop={() => handleDrop(t.id!)}
            onDragEnd={() => { dragId.current = null; setDragOverId(null); }}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
              dragOverId === t.id ? "border-orange-400 bg-orange-500/10" : "border-white/10 hover:border-white/20"
            }`}
            style={{ background: dragOverId === t.id ? undefined : "#3a3a3a" }}>
            <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70 transition-colors" title="Перетащить">
              <Icon name="GripVertical" size={18} fallback="Circle" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{t.name}</p>
                {t.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{t.badge}</span>}
                {!t.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Скрыт</span>}
                {t.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Хит</span>}
              </div>
              <p className="text-white/50 text-xs mt-0.5">
                {t.hours_label} ·{" "}
                {t.old_price ? (
                  <span className="line-through text-white/30 mr-1">{t.old_price.toLocaleString("ru-RU")} ₽</span>
                ) : null}
                <span className={t.old_price ? "text-orange-400 font-semibold" : ""}>{t.price.toLocaleString("ru-RU")} ₽</span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActive(t)}
                title={t.active ? "Скрыть карточку" : "Показать карточку"}
                className={`p-2 rounded-lg border transition-colors ${
                  t.active
                    ? "border-white/10 text-white/60 hover:text-yellow-400 hover:border-yellow-400/40"
                    : "border-red-400/40 text-red-400 hover:text-green-400 hover:border-green-400/40"
                }`}>
                <Icon name={t.active ? "Eye" : "EyeOff"} size={14} fallback="Circle" />
              </button>
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