import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";
import { DOC_META, getDocDefault } from "@/components/gosash/shared/documentDefaults";

type Document = {
  id?: number;
  slug: string;
  title: string;
  content: string;
  active: boolean;
  sort_order: number;
};

const EMPTY_DOC: Document = { slug: "", title: "", content: "", active: true, sort_order: 0 };

export function DocumentsTab({ token }: { token: string }) {
  const [items, setItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Document | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("documents", "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug.trim()) { show("Укажите URL (slug)", "err"); return; }
    setSaving(true);
    const res = await api("documents", editing.id ? "PUT" : "POST", editing, token);
    if (res.ok) { show("Сохранено", "ok"); setEditing(null); load(); }
    else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Удалить документ?")) return;
    const res = await api("documents", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); load(); }
    else show(res.error || "Ошибка", "err");
  };

  const fillTemplate = (slug: string) => {
    const def = getDocDefault(slug);
    setEditing(prev => prev && ({ ...prev, title: prev.title || def.title, content: def.content }));
    show("Шаблон вставлен", "ok");
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10" style={{ background: "#2e2e2e" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
              <h3 className="text-white font-black">{editing.id ? "Редактировать" : "Новый"} документ</h3>
              <button onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <Icon name="X" size={18} fallback="Circle" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="URL (slug)" value={editing.slug} onChange={v => setEditing(e => e && ({...e, slug: v.trim().replace(/^\//, "")}))} />
                <Field label="Порядок" value={String(editing.sort_order)} onChange={v => setEditing(e => e && ({...e, sort_order: parseInt(v)||0}))} type="number" />
              </div>
              <p className="text-white/40 text-[11px] -mt-3">Ссылка на странице: /{editing.slug || "slug"}</p>

              <Field label="Заголовок" value={editing.title} onChange={v => setEditing(e => e && ({...e, title: v}))} />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/60 text-xs uppercase tracking-wide">Содержимое (HTML)</label>
                  {editing.slug && DOC_META.some(m => m.slug === editing.slug) && (
                    <button
                      type="button"
                      onClick={() => fillTemplate(editing.slug)}
                      className="text-orange-400 hover:text-orange-300 text-[11px] font-bold uppercase tracking-wide flex items-center gap-1"
                    >
                      <Icon name="Sparkles" size={12} fallback="Star" />
                      Вставить шаблон
                    </button>
                  )}
                </div>
                <textarea
                  value={editing.content}
                  onChange={e => setEditing(prev => prev && ({...prev, content: e.target.value}))}
                  rows={18}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors font-mono resize-y"
                  style={{ background: "#3a3a3a" }}
                  placeholder="<h2>Заголовок</h2><p>Текст…</p>"
                />
                <p className="text-white/40 text-[11px] mt-1">Поддерживается HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;br&gt;.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={e => setEditing(prev => prev && ({...prev, active: e.target.checked}))}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-white text-sm">Показывать ссылку в футере</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
              <a
                href={`/${editing.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm hover:text-orange-400 hover:border-orange-400 transition-colors flex items-center gap-2"
              >
                <Icon name="ExternalLink" size={14} fallback="Circle" />
                Открыть
              </a>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-white/15 text-white/70 text-sm">Отмена</button>
              <SaveBtn onClick={save} loading={saving} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-white/50 text-sm">Документов: {items.length}</p>
        <button
          onClick={() => setEditing({ ...EMPTY_DOC })}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Icon name="Plus" size={14} fallback="Circle" /> Добавить документ
        </button>
      </div>

      <div className="space-y-3">
        {items.map(d => (
          <div
            key={d.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${d.active ? "border-white/10" : "border-white/5 opacity-60"}`}
            style={{ background: "#3a3a3a" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-bold text-sm">{d.title || d.slug}</p>
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold bg-white/10 text-white/60">/{d.slug}</span>
                {!d.active && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold bg-red-500/20 text-red-300">Скрыт</span>
                )}
              </div>
              <p className="text-white/50 text-xs mt-0.5 truncate">{d.content ? `${d.content.replace(/<[^>]+>/g, " ").trim().slice(0, 120)}…` : "Содержимое не задано — используется шаблон"}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={`/${d.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Открыть"
                className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors"
              >
                <Icon name="ExternalLink" size={14} fallback="Circle" />
              </a>
              <button onClick={() => setEditing(d)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-orange-400 transition-colors">
                <Icon name="Pencil" size={14} fallback="Circle" />
              </button>
              <button onClick={() => del(d.id!)} className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 transition-colors">
                <Icon name="Trash2" size={14} fallback="Circle" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-center py-8">Документы ещё не добавлены</p>}
      </div>
    </div>
  );
}
