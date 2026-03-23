import { useState } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast } from "./AdminUi";

// ─── Tab: Settings ────────────────────────────────────────────────────────────
export function SettingsTab({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useState(() => {
    api("/settings", "GET", undefined, token).then(res => {
      setData(res);
      setLoading(false);
    });
  });

  const set = (key: string, value: string) => setData(d => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    const res = await api("/settings", "POST", { data }, token);
    show(res.ok ? "Настройки сохранены" : res.error, res.ok ? "ok" : "err");
    setSaving(false);
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-8">
      {toast && <Toast {...toast} />}
      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Globe" size={14} className="text-orange-400" fallback="Circle" /> SEO
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title (title страницы)" value={data.site_title||""} onChange={v => set("site_title",v)} />
          <Field label="Keywords" value={data.site_keywords||""} onChange={v => set("site_keywords",v)} />
          <Field label="Description" value={data.site_description||""} onChange={v => set("site_description",v)} rows={2} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Layout" size={14} className="text-orange-400" fallback="Circle" /> Первый экран
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Заголовок H1" value={data.hero_h1||""} onChange={v => set("hero_h1",v)} />
          <Field label="Подзаголовок" value={data.hero_subtitle||""} onChange={v => set("hero_subtitle",v)} rows={2} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Phone" size={14} className="text-orange-400" fallback="Circle" /> Контакты
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Телефон (числа)" value={data.phone||""} onChange={v => set("phone",v)} />
          <Field label="Телефон (отображение)" value={data.phone_display||""} onChange={v => set("phone_display",v)} />
          <Field label="Email" value={data.email||""} onChange={v => set("email",v)} />
          <Field label="Режим работы" value={data.work_hours||""} onChange={v => set("work_hours",v)} />
          <Field label="ВКонтакте (ссылка)" value={data.vk_url||""} onChange={v => set("vk_url",v)} />
          <Field label="Telegram (ссылка)" value={data.tg_url||""} onChange={v => set("tg_url",v)} />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveBtn onClick={save} loading={saving} />
      </div>
    </div>
  );
}

// ─── Tab: Blocks ──────────────────────────────────────────────────────────────
const BLOCKS = [
  { key: "block_hero", label: "Первый экран (Hero)" },
  { key: "block_tariffs", label: "Тарифы" },
  { key: "block_fleet", label: "Автопарк" },
  { key: "block_finance", label: "Финансовый блок" },
  { key: "block_faq", label: "FAQ" },
  { key: "block_about", label: "Филиалы" },
  { key: "block_stats", label: "Статистика" },
  { key: "block_instructors", label: "Инструкторы" },
  { key: "block_reviews", label: "Отзывы" },
  { key: "block_footer", label: "Футер" },
];

export function BlocksTab({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useState(() => {
    api("/settings", "GET", undefined, token).then(res => {
      setData(res);
      setLoading(false);
    });
  });

  const toggle = (key: string) => setData(d => ({ ...d, [key]: d[key] === "true" ? "false" : "true" }));

  const save = async () => {
    setSaving(true);
    const blockData = Object.fromEntries(BLOCKS.map(b => [b.key, data[b.key] || "true"]));
    const res = await api("/settings", "POST", { data: blockData }, token);
    show(res.ok ? "Сохранено" : res.error, res.ok ? "ok" : "err");
    setSaving(false);
  };

  if (loading) return <div className="text-white/50 py-8 text-center">Загрузка...</div>;

  return (
    <div>
      {toast && <Toast {...toast} />}
      <p className="text-white/50 text-sm mb-6">Включите или отключите отображение блоков на лендинге</p>
      <div className="space-y-3">
        {BLOCKS.map(b => (
          <div key={b.key} className="flex items-center justify-between p-4 rounded-xl border border-white/10" style={{ background: "#3a3a3a" }}>
            <span className="text-white text-sm font-semibold">{b.label}</span>
            <button onClick={() => toggle(b.key)}
              className={`relative w-12 h-6 rounded-full transition-colors ${data[b.key] !== "false" ? "bg-orange-500" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${data[b.key] !== "false" ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <SaveBtn onClick={save} loading={saving} />
      </div>
    </div>
  );
}
