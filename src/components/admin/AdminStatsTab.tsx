import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

export type Stat = { id?: number; value: string; label: string; icon: string; active: boolean; sort_order: number };

const EMPTY: Stat = { value: "", label: "", icon: "Star", active: true, sort_order: 0 };

export function StatsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("stats", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("stats", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить показатель?")) return;
    const res = await api("stats", "DELETE", { id }, token);
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
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} показатель</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Значение (напр. «94,5%»)" value={editing.value} onChange={v => setEditing(e => e && ({ ...e, value: v }))} />
              <Field label="Подпись" value={editing.label} onChange={v => setEditing(e => e && ({ ...e, label: v }))} rows={2} />
              <Field label="Иконка (lucide name)" value={editing.icon} onChange={v => setEditing(e => e && ({ ...e, icon: v }))} />
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
        <p className="text-white/50 text-sm">Показателей: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY })} className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(s => (
          <div key={s.id} className="flex items-center gap-3 p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <Icon name={s.icon as Parameters<typeof Icon>[0]["name"]} size={28} className="text-orange-400 flex-shrink-0" fallback="Star" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base">{s.value}</p>
              <p className="text-white/50 text-xs leading-snug">{s.label}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => setEditing(s)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"><Icon name="Pencil" size={12} fallback="Circle" /></button>
              <button onClick={() => del(s.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors"><Icon name="Trash2" size={12} fallback="Circle" /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-white/30 text-center py-8">Нет показателей</p>}
    </div>
  );
}
