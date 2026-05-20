import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast, ImageUpload } from "./AdminUi";
import type { Instructor } from "./AdminCrudTabs";

const EMPTY_INSTRUCTOR: Instructor = { name: "", experience: "", specialization: "", photo_url: "", is_top: false, is_lady: false, active: true, sort_order: 0 };

export function InstructorsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Instructor | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("instructors", "GET", undefined, token)
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
    const res = await api("instructors", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить инструктора?")) return;
    const res = await api("instructors", "DELETE", { id }, token);
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
              <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({...e, sort_order: parseInt(v)||0}))} type="number" />
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Фото</label>
                <ImageUpload value={editing.photo_url} onChange={v => setEditing(e => e && ({...e, photo_url: v}))} token={token} />
              </div>
              <div className="flex gap-4 flex-wrap">
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