import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Toast } from "./AdminUi";

export type Lead = {
  id: number;
  name: string;
  phone: string;
  tariff: string;
  promo: string;
  source: string;
  note: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-yellow-500/20 text-yellow-400",
  done: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};
const STATUS_LABEL: Record<string, string> = {
  new: "Новая",
  contacted: "В работе",
  done: "Закрыта",
  cancelled: "Отменена",
};

export function LeadsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lead | null>(null);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("leads", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const res = await api("leads", "PUT", { id: editing.id, status: editing.status, note: editing.note }, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
  };

  const del = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    const res = await api("leads", "DELETE", { id }, token);
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
              <h3 className="text-white font-black">Заявка №{editing.id}</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white"><Icon name="X" size={18} fallback="Circle" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Имя</span><span className="text-white">{editing.name || "—"}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/40">Телефон</span>
                <a href={`tel:${editing.phone}`} className="text-orange-400 font-bold">{editing.phone || "—"}</a>
              </div>
              {editing.tariff && <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/40">Тариф</span><span className="text-white">{editing.tariff}</span></div>}
              {editing.promo && <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/40">Акция</span><span className="text-white">{editing.promo}</span></div>}
              {editing.source && <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/40">Источник</span><span className="text-white">{editing.source}</span></div>}
              <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-white/40">Создана</span><span className="text-white">{new Date(editing.created_at).toLocaleString("ru")}</span></div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Статус</label>
                <select value={editing.status} onChange={e => setEditing(prev => prev && ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none" style={{ background: "#3a3a3a" }}>
                  <option value="new">Новая</option>
                  <option value="contacted">В работе</option>
                  <option value="done">Закрыта</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Заметка</label>
                <textarea value={editing.note || ""} onChange={e => setEditing(prev => prev && ({ ...prev, note: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none resize-none" style={{ background: "#3a3a3a" }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Закрыть</button>
              <button onClick={save} className="px-6 py-2.5 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600">Сохранить</button>
            </div>
          </div>
        </div>
      )}
      <p className="text-white/50 text-sm mb-6">Заявок всего: {items.length}</p>
      <div className="space-y-2">
        {items.map(l => (
          <div key={l.id} className="flex items-center gap-3 p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{l.name || "Без имени"}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] || "bg-white/10 text-white/50"}`}>
                  {STATUS_LABEL[l.status] || l.status}
                </span>
                {l.tariff && <span className="text-xs text-orange-400">{l.tariff}</span>}
                {l.promo && <span className="text-xs text-pink-400">{l.promo}</span>}
              </div>
              <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                <a href={`tel:${l.phone}`} className="text-orange-400 font-semibold">{l.phone}</a>
                <span>{new Date(l.created_at).toLocaleString("ru")}</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setEditing(l)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400"><Icon name="Eye" size={14} fallback="Circle" /></button>
              <button onClick={() => del(l.id)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400"><Icon name="Trash2" size={14} fallback="Circle" /></button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-white/30 text-center py-8">Заявок пока нет</p>}
    </div>
  );
}
