import { useEffect, useState } from "react";

export const PUBLIC_API = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8";

export async function fetchPublic<T>(action: string): Promise<T | null> {
  try {
    const res = await fetch(`${PUBLIC_API}?action=${action}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data as T;
  } catch {
    return null;
  }
}

/** Грузит коллекцию из публичного эндпоинта. При ошибке/пустом ответе — null. */
export function usePublicList<T>(action: string): { items: T[] | null; loading: boolean } {
  const [items, setItems] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchPublic<{ items: T[] }>(action).then(res => {
      if (cancelled) return;
      if (res && Array.isArray(res.items) && res.items.length > 0) {
        setItems(res.items);
      } else {
        setItems(null);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [action]);
  return { items, loading };
}

/** Грузит публичные настройки сайта (key→value). */
export function usePublicSettings(): { settings: Record<string, string>; loading: boolean } {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetchPublic<Record<string, string>>("public-settings").then(res => {
      if (cancelled) return;
      if (res && typeof res === "object") setSettings(res);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);
  return { settings, loading };
}
