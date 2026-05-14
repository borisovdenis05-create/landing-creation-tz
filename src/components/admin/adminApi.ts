import { useState, useCallback, useRef, useEffect } from "react";

export const ADMIN_API = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8";

export function api(action: string, method = "GET", body?: unknown, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Admin-Token"] = token;
  const cleanAction = action.replace(/^\/+/, "");
  return fetch(`${ADMIN_API}?action=${cleanAction}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
}

export function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = useCallback((msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

export function useImageUpload(token: string, onChange: (url: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      const res = await api("upload", "POST", { image: b64, filename: file.name }, token);
      if (res.url) onChange(res.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return { inputRef, uploading, handleFile };
}

/** Универсальный хук загрузки коллекции из админ-API. */
export function useAdminList<T>(action: string, token: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    setLoading(true);
    api(action, "GET", undefined, token).then(res => {
      setItems(res.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [action, token, refreshKey]);

  return { items, loading, reload };
}
