import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast, ImageUpload } from "./AdminUi";
import type { Review } from "./AdminCrudTabs";

const EMPTY_REVIEW: Review = { author: "", text: "", rating: 5, photo_url: "", source: "", active: true, sort_order: 0 };

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
