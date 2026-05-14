import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";
import type { Branch } from "./AdminCrudTabs";

const EMPTY_BRANCH: Branch = { name: "", addr: "", rating: 5.0, map_url: "", active: true, sort_order: 0 };

export function BranchesTab({ token }: { token: string }) {
  const [items, setItems] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("branches", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("branches", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить филиал?")) return;
    const res = await api("branches", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error || "Ошибка", "err");
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