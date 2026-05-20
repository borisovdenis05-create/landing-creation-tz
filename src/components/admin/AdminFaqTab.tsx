import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

export type Faq = { id?: number; question: string; answer: string; active: boolean; sort_order: number };

const EMPTY: Faq = { question: "", answer: "", active: true, sort_order: 0 };

export function FaqTab({ token }: { token: string }) {
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("faq", "GET", undefined, token)
      .then(res => {
        setItems(Array.isArray(res?.items) ? res.items : []);
        if (res?.error) show(res.error, "err");
      })
      .catch(err => show(String(err), "err"))
      .finally(() => setLoading(false));
  }, [token, show]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const res = await api("faq", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить вопрос?")) return;
    const res = await api("faq", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-xl rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} вопрос</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-4">
              <Field label="Вопрос" value={editing.question} onChange={v => setEditing(e => e && ({ ...e, question: v }))} />
              <Field label="Ответ" value={editing.answer} onChange={v => setEditing(e => e && ({ ...e, answer: v }))} rows={6} />
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
        <p className="text-white/50 text-sm">Вопросов: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY })} className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить вопрос
        </button>
      </div>
      <div className="space-y-3">
        {items.map(f => (
          <div key={f.id} className="p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold text-sm">{f.question}</p>
                  {!f.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Скрыт</span>}
                </div>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(f)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"><Icon name="Pencil" size={14} fallback="Circle" /></button>
                <button onClick={() => del(f.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors"><Icon name="Trash2" size={14} fallback="Circle" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Вопросов нет</p>}
      </div>
    </div>
  );
}