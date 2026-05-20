import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

type SeoSettings = {
  site_title: string;
  site_description: string;
  site_keywords: string;
  seo_og_image: string;
  seo_canonical_url: string;
  seo_favicon: string;
  seo_robots: string;
  seo_sitemap: string;
  seo_redirects: string;
};

type Redirect = { from: string; to: string; code?: number };

const DEFAULT_SEO: SeoSettings = {
  site_title: "",
  site_description: "",
  site_keywords: "",
  seo_og_image: "",
  seo_canonical_url: "",
  seo_favicon: "",
  seo_robots: "User-agent: *\nAllow: /\nSitemap: /sitemap.xml",
  seo_sitemap: "",
  seo_redirects: "[]",
};

export function SeoTab({ token }: { token: string }) {
  const [d, setD] = useState<SeoSettings>(DEFAULT_SEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"meta" | "robots" | "sitemap" | "redirects" | "audit">("meta");
  const { toast, show } = useToast();

  const load = useCallback(() => {
    setLoading(true);
    api("settings", "GET", undefined, token)
      .then((res) => {
        const merged: SeoSettings = { ...DEFAULT_SEO };
        (Object.keys(DEFAULT_SEO) as (keyof SeoSettings)[]).forEach((k) => {
          if (res && typeof res[k] === "string") merged[k] = res[k] as string;
        });
        setD(merged);
        if (res?.error) show(res.error, "err");
      })
      .catch((err) => show(String(err), "err"))
      .finally(() => setLoading(false));
  }, [token, show]);

  useEffect(() => { load(); }, [load]);

  const set = (key: keyof SeoSettings, val: string) => setD((p) => ({ ...p, [key]: val }));

  const save = async () => {
    setSaving(true);
    const res = await api("settings", "POST", { data: d }, token);
    if (res.ok) show("SEO сохранено", "ok"); else show(res.error || "Ошибка", "err");
    setSaving(false);
  };

  let redirects: Redirect[] = [];
  try { redirects = JSON.parse(d.seo_redirects || "[]"); if (!Array.isArray(redirects)) redirects = []; } catch { redirects = []; }

  const setRedirects = (next: Redirect[]) => set("seo_redirects", JSON.stringify(next));
  const addRedirect = () => setRedirects([...redirects, { from: "", to: "", code: 301 }]);
  const updRedirect = (i: number, patch: Partial<Redirect>) => setRedirects(redirects.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const delRedirect = (i: number) => setRedirects(redirects.filter((_, idx) => idx !== i));

  const audit = [
    { ok: !!d.site_title, label: "Title тега страницы заполнен", hint: "Обязательно для SEO" },
    { ok: !!d.site_description && d.site_description.length >= 80, label: "Description содержит 80+ символов", hint: "Рекомендуется 120–160 символов" },
    { ok: !!d.site_keywords, label: "Ключевые слова указаны" },
    { ok: !!d.seo_og_image, label: "Картинка Open Graph загружена", hint: "Используется при шеринге в соцсетях" },
    { ok: !!d.seo_canonical_url, label: "Canonical URL указан" },
    { ok: !!d.seo_favicon, label: "Favicon настроен" },
    { ok: !!d.seo_robots, label: "robots.txt заполнен" },
    { ok: !!d.seo_sitemap, label: "sitemap.xml заполнен" },
  ];
  const score = Math.round((audit.filter((a) => a.ok).length / audit.length) * 100);

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  const TABS: { id: typeof tab; label: string; icon: string }[] = [
    { id: "meta", label: "Метатеги", icon: "Tags" },
    { id: "robots", label: "robots.txt", icon: "Bot" },
    { id: "sitemap", label: "sitemap.xml", icon: "Map" },
    { id: "redirects", label: "Редиректы", icon: "ArrowRightLeft" },
    { id: "audit", label: "Аудит", icon: "ShieldCheck" },
  ];

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              tab === t.id ? "bg-orange-500 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon name={t.icon as Parameters<typeof Icon>[0]["name"]} size={14} fallback="Circle" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "meta" && (
        <div className="space-y-4">
          <Field label="Title страницы" value={d.site_title} onChange={(v) => set("site_title", v)} />
          <Field label="Description (160 симв.)" value={d.site_description} onChange={(v) => set("site_description", v)} rows={3} />
          <Field label="Keywords" value={d.site_keywords} onChange={(v) => set("site_keywords", v)} />
          <Field label="Open Graph картинка (URL)" value={d.seo_og_image} onChange={(v) => set("seo_og_image", v)} />
          <Field label="Canonical URL" value={d.seo_canonical_url} onChange={(v) => set("seo_canonical_url", v)} />
          <Field label="Favicon URL" value={d.seo_favicon} onChange={(v) => set("seo_favicon", v)} />
          <div className="flex justify-end pt-2"><SaveBtn onClick={save} loading={saving} /></div>
        </div>
      )}

      {tab === "robots" && (
        <div className="space-y-4">
          <p className="text-white/50 text-xs">Содержимое файла robots.txt. Используется поисковиками для индексации.</p>
          <textarea
            value={d.seo_robots}
            onChange={(e) => set("seo_robots", e.target.value)}
            rows={14}
            className="w-full px-4 py-3 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 font-mono"
            style={{ background: "#3a3a3a" }}
          />
          <div className="flex justify-end pt-2"><SaveBtn onClick={save} loading={saving} /></div>
        </div>
      )}

      {tab === "sitemap" && (
        <div className="space-y-4">
          <p className="text-white/50 text-xs">XML-карта сайта. Перечислите URL страниц для поисковых систем.</p>
          <textarea
            value={d.seo_sitemap}
            onChange={(e) => set("seo_sitemap", e.target.value)}
            rows={16}
            placeholder={'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://example.com/</loc></url>\n</urlset>'}
            className="w-full px-4 py-3 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400 font-mono"
            style={{ background: "#3a3a3a" }}
          />
          <div className="flex justify-end pt-2"><SaveBtn onClick={save} loading={saving} /></div>
        </div>
      )}

      {tab === "redirects" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white/50 text-xs">Список редиректов: откуда (URL пути) → куда, и HTTP-код.</p>
            <button onClick={addRedirect} className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 flex items-center gap-1.5">
              <Icon name="Plus" size={12} fallback="Circle" /> Добавить
            </button>
          </div>
          {redirects.length === 0 && <p className="text-white/30 text-center py-8 text-sm">Редиректы не добавлены</p>}
          {redirects.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 p-3 rounded-lg border border-white/10" style={{ background: "#3a3a3a" }}>
              <input
                value={r.from}
                onChange={(e) => updRedirect(i, { from: e.target.value })}
                placeholder="/старый-url"
                className="col-span-5 px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400"
                style={{ background: "#2e2e2e" }}
              />
              <input
                value={r.to}
                onChange={(e) => updRedirect(i, { to: e.target.value })}
                placeholder="/новый-url"
                className="col-span-5 px-3 py-2 rounded-lg border border-white/10 text-white text-sm outline-none focus:border-orange-400"
                style={{ background: "#2e2e2e" }}
              />
              <select
                value={r.code || 301}
                onChange={(e) => updRedirect(i, { code: parseInt(e.target.value) })}
                className="col-span-1 px-2 py-2 rounded-lg border border-white/10 text-white text-sm outline-none"
                style={{ background: "#2e2e2e" }}
              >
                <option value={301}>301</option>
                <option value={302}>302</option>
                <option value={307}>307</option>
                <option value={308}>308</option>
              </select>
              <button onClick={() => delRedirect(i)} className="col-span-1 p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/40 transition-colors flex items-center justify-center">
                <Icon name="Trash2" size={14} fallback="Circle" />
              </button>
            </div>
          ))}
          <div className="flex justify-end pt-2"><SaveBtn onClick={save} loading={saving} /></div>
        </div>
      )}

      {tab === "audit" && (
        <div>
          <div className="rounded-2xl p-6 mb-6 border border-white/10" style={{ background: "#3a3a3a" }}>
            <p className="text-white/50 text-xs uppercase tracking-wide mb-2">SEO-оценка</p>
            <div className="flex items-end gap-3">
              <p className={`text-5xl font-black ${score >= 80 ? "text-green-400" : score >= 50 ? "text-orange-400" : "text-red-400"}`}>{score}</p>
              <p className="text-white/40 text-sm mb-2">из 100</p>
            </div>
            <div className="h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
              <div className={`h-full ${score >= 80 ? "bg-green-400" : score >= 50 ? "bg-orange-400" : "bg-red-400"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            {audit.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-white/10" style={{ background: "#3a3a3a" }}>
                <Icon name={a.ok ? "CheckCircle2" : "XCircle"} size={18} className={a.ok ? "text-green-400" : "text-red-400"} fallback="Circle" />
                <div>
                  <p className="text-white text-sm">{a.label}</p>
                  {a.hint && <p className="text-white/40 text-xs mt-0.5">{a.hint}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SeoTab;