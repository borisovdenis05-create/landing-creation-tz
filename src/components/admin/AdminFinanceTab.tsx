import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

export type FinanceBlock = {
  id?: number;
  title: string;
  subtitle: string;
  icon: string;
  rows: [string, string][];
  active: boolean;
  sort_order: number;
};

const EMPTY: FinanceBlock = { title: "", subtitle: "", icon: "Percent", rows: [], active: true, sort_order: 0 };

export function FinanceTab({ token }: { token: string }) {
  const [items, setItems] = useState<FinanceBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FinanceBlock | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("finance", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("finance", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить блок?")) return;
    const res = await api("finance", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
  };

  const setRow = (idx: number, col: 0 | 1, val: string) => {
    setEditing(e => {
      if (!e) return e;
      const rows = e.rows.map((r, i) => i === idx ? (col === 0 ? [val, r[1]] : [r[0], val]) as [string, string] : r);
      return { ...e, rows };
    });
  };
  const addRow = () => setEditing(e => e && ({ ...e, rows: [...e.rows, ["", ""]] }));
  const delRow = (idx: number) => setEditing(e => e && ({ ...e, rows: e.rows.filter((_, i) => i !== idx) }));

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} блок</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Заголовок" value={editing.title} onChange={v => setEditing(e => e && ({ ...e, title: v }))} />
              <Field label="Подзаголовок" value={editing.subtitle} onChange={v => setEditing(e => e && ({ ...e, subtitle: v }))} />
              <Field label="Иконка (lucide)" value={editing.icon} onChange={v => setEditing(e => e && ({ ...e, icon: v }))} />
              <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({ ...e, sort_order: parseInt(v) || 0 }))} type="number" />
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-xs uppercase tracking-wide">Параметры (ключ — значение)</label>
                <button onClick={addRow} className="text-orange-400 text-xs hover:text-orange-300 flex items-center gap-1"><Icon name="Plus" size={12} fallback="Circle" /> Добавить</button>
              </div>
              <div className="space-y-2">
                {editing.rows.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={row[0]} onChange={e => setRow(i, 0, e.target.value)} placeholder="Ключ"
                      className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none" style={{ background: "#3a3a3a" }} />
                    <input value={row[1]} onChange={e => setRow(i, 1, e.target.value)} placeholder="Значение"
                      className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none" style={{ background: "#3a3a3a" }} />
                    <button onClick={() => delRow(i)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400"><Icon name="Trash2" size={14} fallback="Circle" /></button>
                  </div>
                ))}
                {editing.rows.length === 0 && <p className="text-white/30 text-xs">Параметров нет</p>}
              </div>
            </div>
            <label className="flex items-center gap-2 mt-5 cursor-pointer">
              <input type="checkbox" checked={editing.active} onChange={e => setEditing(prev => prev && ({ ...prev, active: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
              <span className="text-white text-sm">Активен</span>
            </label>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Отмена</button>
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Блоков финансов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY, rows: [] })} className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить блок
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(f => (
          <div key={f.id} className="p-5 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <div className="flex items-center gap-3 mb-3">
              <Icon name={f.icon as Parameters<typeof Icon>[0]["name"]} size={24} className="text-orange-400 flex-shrink-0" fallback="Percent" />
              <div className="flex-1">
                <p className="text-white font-black text-sm">{f.title}</p>
                <p className="text-white/50 text-xs">{f.subtitle}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing({ ...f, rows: Array.isArray(f.rows) ? f.rows : [] })} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400"><Icon name="Pencil" size={12} fallback="Circle" /></button>
                <button onClick={() => del(f.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400"><Icon name="Trash2" size={12} fallback="Circle" /></button>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              {(Array.isArray(f.rows) ? f.rows : []).map((r, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="text-white/40">{r[0]}</span>
                  <span className="text-white/70 text-right">{r[1]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-white/30 text-center py-8">Блоков нет</p>}
    </div>
  );
}
