import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

// ─── Универсальный простой CRUD-таб для одного текстового поля + shape (марки)
type SimpleItem = { id?: number; label: string; shape?: string; active: boolean; sort_order: number };

function SimpleListTab({
  token,
  action,
  title,
  withShape,
}: {
  token: string;
  action: string;
  title: string;
  withShape?: boolean;
}) {
  const [items, setItems] = useState<SimpleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SimpleItem | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api(action, "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token, action]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api(action, editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить?")) return;
    const res = await api(action, "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} элемент</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Текст" value={editing.label} onChange={v => setEditing(e => e && ({ ...e, label: v }))} />
              {withShape && (
                <div>
                  <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Знак</label>
                  <select value={editing.shape || "circle"} onChange={e => setEditing(prev => prev && ({ ...prev, shape: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none" style={{ background: "#3a3a3a" }}>
                    <option value="circle">Круг (запрет/предписание)</option>
                    <option value="triangle">Треугольник (предупреждение)</option>
                    <option value="square">Квадрат (информация)</option>
                  </select>
                </div>
              )}
              <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({ ...e, sort_order: parseInt(v) || 0 }))} type="number" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.active} onChange={e => setEditing(prev => prev && ({ ...prev, active: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
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
        <p className="text-white/50 text-sm">{title}: {items.length}</p>
        <button
          onClick={() => setEditing({ label: "", shape: withShape ? "circle" : undefined, active: true, sort_order: 0 })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить
        </button>
      </div>
      <div className="space-y-2">
        {items.map(it => (
          <div key={it.id} className="flex items-center gap-3 p-3 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">{it.label}</p>
              {withShape && <p className="text-white/40 text-xs">{it.shape}</p>}
            </div>
            {!it.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Скрыт</span>}
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(it)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400"><Icon name="Pencil" size={12} fallback="Circle" /></button>
              <button onClick={() => del(it.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400"><Icon name="Trash2" size={12} fallback="Circle" /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-white/30 text-center py-8">Пусто</p>}
    </div>
  );
}

export function MarqueeTab({ token }: { token: string }) {
  return <SimpleListTab token={token} action="marquee" title="Элементов бегущей строки" withShape />;
}

export function HeroFeaturesTab({ token }: { token: string }) {
  return <SimpleListTab token={token} action="hero-features" title="Преимуществ Hero" />;
}
