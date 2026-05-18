import { useEffect } from "react";
import { fetchPublic } from "@/components/gosash/shared/publicApi";

type SeoData = Record<string, string>;

function setMeta(selector: string, attr: "content" | "href", value: string, createTag?: () => HTMLElement) {
  if (!value) return;
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el && createTag) {
    el = createTag();
    document.head.appendChild(el);
  }
  if (el) el.setAttribute(attr, value);
}

function applyRedirects(raw: string) {
  if (!raw) return;
  try {
    const list = JSON.parse(raw) as { from: string; to: string; code?: number }[];
    if (!Array.isArray(list)) return;
    const path = window.location.pathname;
    const hit = list.find((r) => r && r.from && r.from === path);
    if (hit && hit.to && hit.to !== path) {
      window.location.replace(hit.to);
    }
  } catch {
    /* noop */
  }
}

export default function SeoHead() {
  useEffect(() => {
    fetchPublic<SeoData>("public-settings").then((data) => {
      if (!data || typeof data !== "object") return;

      if (data.site_title) document.title = data.site_title;

      setMeta('meta[name="description"]', "content", data.site_description || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        return m;
      });

      setMeta('meta[name="keywords"]', "content", data.site_keywords || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "keywords");
        return m;
      });

      const ogImage = data.seo_og_image || "";
      setMeta('meta[property="og:title"]', "content", data.site_title || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      });
      setMeta('meta[property="og:description"]', "content", data.site_description || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:description");
        return m;
      });
      if (ogImage) {
        setMeta('meta[property="og:image"]', "content", ogImage, () => {
          const m = document.createElement("meta");
          m.setAttribute("property", "og:image");
          return m;
        });
        setMeta('meta[name="twitter:image"]', "content", ogImage, () => {
          const m = document.createElement("meta");
          m.setAttribute("name", "twitter:image");
          return m;
        });
      }

      setMeta('meta[name="twitter:title"]', "content", data.site_title || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:title");
        return m;
      });
      setMeta('meta[name="twitter:description"]', "content", data.site_description || "", () => {
        const m = document.createElement("meta");
        m.setAttribute("name", "twitter:description");
        return m;
      });

      if (data.seo_canonical_url) {
        setMeta('link[rel="canonical"]', "href", data.seo_canonical_url, () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        });
        setMeta('meta[property="og:url"]', "content", data.seo_canonical_url, () => {
          const m = document.createElement("meta");
          m.setAttribute("property", "og:url");
          return m;
        });
      }

      if (data.seo_favicon) {
        const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
        if (link) link.href = data.seo_favicon;
        else {
          const l = document.createElement("link");
          l.rel = "icon";
          l.href = data.seo_favicon;
          document.head.appendChild(l);
        }
      }

      if (data.seo_redirects) applyRedirects(data.seo_redirects);
    });
  }, []);

  return null;
}
