import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Toast } from "./AdminUi";

type MediaItem = {
  id: number;
  url: string;
  filename: string;
  s3_key: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  alt: string;
  tag: string;
  created_at: string;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(2)} МБ`;
}

export function MediaTab({ token }: { token: string }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("media", "GET", undefined, token).then((res) => {
      setItems(res.items || []);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const b64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const res = await api("upload", "POST", { image: b64, filename: file.name }, token);
        if (!res.url) show(`Ошибка загрузки ${file.name}`, "err");
      } catch {
        show(`Ошибка загрузки ${file.name}`, "err");
      }
    }
    setUploading(false);
    show("Файлы загружены", "ok");
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить файл из медиатеки?")) return;
    const res = await api("media", "DELETE", { id }, token);
    if (res.ok) { show("Удалено", "ok"); setPreview(null); load(); }
    else show(res.error || "Ошибка", "err");
  };

  const updItem = async (item: MediaItem, patch: Partial<MediaItem>) => {
    const next = { ...item, ...patch };
    setItems(items.map((x) => x.id === item.id ? next : x));
    await api("media", "PUT", { id: item.id, alt: next.alt, tag: next.tag }, token);
  };

  const copy = async (url: string) => {
    try { await navigator.clipboard.writeText(url); show("Ссылка скопирована", "ok"); } catch { show("Не удалось скопировать", "err"); }
  };

  const filtered = items.filter((i) =>
    !search ||
    i.filename.toLowerCase().includes(search.toLowerCase()) ||
    i.alt.toLowerCase().includes(search.toLowerCase()) ||
    i.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && <Toast {...toast} />}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="file"
          ref={inputRef}
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Icon name={uploading ? "Loader" : "Upload"} size={14} fallback="Circle" />
          {uploading ? "Загрузка..." : "Загрузить файлы"}
        </button>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" fallback="Circle" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени, alt или тегу"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400"
              style={{ background: "#3a3a3a" }}
            />
          </div>
        </div>
        <p className="text-white/40 text-xs">Файлов: {items.length}</p>
      </div>

      {loading ? (
        <div className="text-white/50 py-12 text-center">Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
          <Icon name="ImageOff" size={48} className="text-white/20 mx-auto mb-3" fallback="Circle" />
          <p className="text-white/40 text-sm">{items.length === 0 ? "Медиатека пуста. Загрузите первые файлы" : "Ничего не найдено"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((i) => (
            <button
              key={i.id}
              onClick={() => setPreview(i)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-orange-400 transition-colors"
              style={{ background: "#3a3a3a" }}
            >
              <img src={i.url} alt={i.alt || i.filename} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{i.filename}</p>
                <p className="text-white/60 text-[10px]">{formatSize(i.size_bytes)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4" style={{ background: "rgba(0,0,0,0.8)" }} onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 p-6" style={{ background: "#2e2e2e" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-black text-lg truncate flex-1">{preview.filename}</h3>
              <button onClick={() => setPreview(null)} className="text-white/40 hover:text-white"><Icon name="X" size={20} fallback="Circle" /></button>
            </div>
            <div className="rounded-xl overflow-hidden mb-4 border border-white/10" style={{ background: "#1a1a1a" }}>
              <img src={preview.url} alt={preview.alt} className="w-full max-h-[60vh] object-contain mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Alt-текст</label>
                <input
                  value={preview.alt}
                  onChange={(e) => setPreview({ ...preview, alt: e.target.value })}
                  onBlur={() => updItem(preview, { alt: preview.alt })}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400"
                  style={{ background: "#3a3a3a" }}
                />
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-wide block mb-1.5">Тег (категория)</label>
                <input
                  value={preview.tag}
                  onChange={(e) => setPreview({ ...preview, tag: e.target.value })}
                  onBlur={() => updItem(preview, { tag: preview.tag })}
                  placeholder="hero, отзывы, акции..."
                  className="w-full px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400"
                  style={{ background: "#3a3a3a" }}
                />
              </div>
            </div>
            <div className="text-white/40 text-xs space-y-1 mb-4">
              <p>Размер: {formatSize(preview.size_bytes)} · Тип: {preview.mime_type || "—"}</p>
              <p className="break-all">URL: {preview.url}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => copy(preview.url)} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white text-sm font-semibold hover:border-orange-400 transition-colors flex items-center justify-center gap-2">
                <Icon name="Copy" size={14} fallback="Circle" /> Скопировать ссылку
              </button>
              <a href={preview.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-lg border border-white/10 text-white text-sm font-semibold hover:border-orange-400 transition-colors flex items-center justify-center gap-2">
                <Icon name="ExternalLink" size={14} fallback="Circle" /> Открыть
              </a>
              <button onClick={() => del(preview.id)} className="px-4 py-2.5 rounded-lg border border-red-400/40 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                <Icon name="Trash2" size={14} fallback="Circle" /> Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaTab;
