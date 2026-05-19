import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { fetchPublic } from "@/components/gosash/shared/publicApi";
import { DOC_META, getDocDefault, type DocSlug } from "@/components/gosash/shared/documentDefaults";
import CookieBanner from "@/components/gosash/CookieBanner";

type DbDoc = { id: number; slug: string; title: string; content: string };

export default function DocumentPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, "").replace(/\/$/, "");
  const [title, setTitle] = useState<string>(getDocDefault(slug).title);
  const [content, setContent] = useState<string>(getDocDefault(slug).content);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPublic<{ items: DbDoc[] }>("public-documents").then(res => {
      if (cancelled) return;
      const found = res?.items?.find(d => d.slug === slug);
      if (found) {
        if (found.title) setTitle(found.title);
        if (found.content && found.content.trim()) setContent(found.content);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    document.title = `${title} — ГОСАШ Автошкола`;
  }, [title]);

  return (
    <div className="min-h-screen" style={{ background: "#f4f4f4" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm hover:text-orange-600 mb-6">
          <Icon name="ArrowLeft" size={16} fallback="ChevronLeft" />
          На главную
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 uppercase">{title}</h1>
          {loading ? (
            <div className="text-gray-400 py-10 text-center text-sm">Загрузка…</div>
          ) : (
            <article
              className="prose prose-sm md:prose-base max-w-none text-gray-800
                         prose-headings:font-black prose-headings:text-gray-900
                         prose-h2:text-xl prose-h3:text-base prose-h3:mt-6
                         prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5
                         prose-a:text-orange-500 hover:prose-a:text-orange-600"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-2">
          {DOC_META.map(d => (
            <Link
              key={d.slug}
              to={`/${d.slug}`}
              className={`text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg border text-center transition-colors ${slug === d.slug ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-400 hover:text-orange-500"}`}
            >
              {d.short}
            </Link>
          ))}
        </div>
      </div>
      <CookieBanner />
    </div>
  );
}

export const DOC_SLUGS: DocSlug[] = DOC_META.map(d => d.slug);