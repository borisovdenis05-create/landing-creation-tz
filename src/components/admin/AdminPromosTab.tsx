import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast, ImageUpload } from "./AdminUi";
import type { Promo } from "@/components/gosash/PromosSection";

const EMPTY_PROMO: Promo = { id: 0, title: "", subtitle: "", description: "", image_url: "", badge: "", active: true, sort_order: 0 };

function PromoEditor({ promo, onSave, onCancel, token }: { promo: Promo; onSave: () => void; onCancel: () => void; token: string }) {
  const [d, setD] = useState<Promo>({ ...promo });
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();
  const set = (key: keyof Promo, val: unknown) => setD(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    const res = await api("promos", d.id ? "PUT" : "POST", d, token);
    if (res.ok) { show("Сохранено", "ok"); setTimeout(onSave, 500); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      {toast && <Toast {...toast} />}
      <div className="w-full max-w-xl rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-black text-lg">{d.id ? "Редактировать акцию" : "Новая акция"}</h3>
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors"><Icon name="X" size={20} fallback="Circle" /></button>
        </div>
        <div className="space-y-4">
          <ImageUpload label="Изображение баннера" value={d.image_url} onChange={url => set("image_url", url)} token={token} />
          <Field label="Заголовок" value={d.title} onChange={v => set("title", v)} />
          <Field label="Подзаголовок / цена" value={d.subtitle} onChange={v => set("subtitle", v)} />
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Описание (текст при открытии)</label>
            <textarea value={d.description} onChange={e => set("description", e.target.value)} rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors resize-none"
              style={{ background: "#3a3a3a" }} placeholder="Подробное описание акции..." />
          </div>
          <Field label="Бейдж (необязательно)" value={d.badge} onChange={v => set("badge", v)} />
          <Field label="Порядок сортировки" value={String(d.sort_order)} onChange={v => set("sort_order", parseInt(v) || 0)} type="number" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={d.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-white text-sm">Активна (отображается на сайте)</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm hover:text-white transition-colors">Отмена</button>
          <SaveBtn onClick={save} loading={saving} />
        </div>
      </div>
    </div>
  );
}

export function PromosTab({ token }: { token: string }) {
  const [items, setItems] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Promo | null>(null);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("promos", "GET", undefined, token)
      .then(res => {
        setItems(Array.isArray(res?.items) ? res.items : []);
        if (res?.error) show(res.error, "err");
      })
      .catch(err => show(String(err), "err"))
      .finally(() => setLoading(false));
  }, [token, show]);

  useEffect(() => { load(); }, [load]);

  const del = async (id: number) => {
    if (!confirm("Удалить акцию?")) return;
    const res = await api("promos", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error || "Ошибка", "err");
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && <PromoEditor promo={editing} onSave={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} token={token} />}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Акций: {items.length}</p>
        <button onClick={() => setEditing({ ...EMPTY_PROMO })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить акцию
        </button>
      </div>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors" style={{ background: "#3a3a3a" }}>
            {p.image_url
              ? <img src={p.image_url} alt="" className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
              : <div className="w-20 h-14 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><Icon name="Image" size={20} className="text-white/30" fallback="Circle" /></div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm truncate">{p.title || "Без названия"}</p>
                {p.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{p.badge}</span>}
                {!p.active && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Скрыта</span>}
              </div>
              {p.subtitle && <p className="text-orange-400 text-xs mt-0.5 font-semibold">{p.subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setEditing(p)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 hover:border-orange-400/40 transition-colors">
                <Icon name="Pencil" size={14} fallback="Circle" />
              </button>
              <button onClick={() => del(p.id)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors">
                <Icon name="Trash2" size={14} fallback="Circle" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Акции не добавлены</p>}
      </div>
    </div>
  );
}