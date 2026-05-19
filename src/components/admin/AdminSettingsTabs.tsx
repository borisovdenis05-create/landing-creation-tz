import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { api, useToast } from "./adminApi";
import { Field, SaveBtn, Toast, ImageUpload } from "./AdminUi";

// ─── Tab: Settings ────────────────────────────────────────────────────────────
export function SettingsTab({ token }: { token: string }) {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    api("settings", "GET", undefined, token).then(res => {
      setData(res || {});
      setLoading(false);
    });
  }, [token]);

  const set = (key: string, value: string) => setData(d => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    const res = await api("settings", "POST", { data }, token);
    show(res.ok ? "Настройки сохранены" : (res.error || "Ошибка"), res.ok ? "ok" : "err");
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
          <Icon name="Image" size={14} className="text-orange-400" fallback="Circle" /> Логотип и фон Hero
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ImageUpload label="Логотип" value={data.logo_url||""} onChange={v => set("logo_url", v)} token={token} />
          <ImageUpload label="Фон первого экрана" value={data.hero_bg_url||""} onChange={v => set("hero_bg_url", v)} token={token} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Layout" size={14} className="text-orange-400" fallback="Circle" /> Первый экран
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="H1 — 1-я строка" value={data.hero_h1_part1||""} onChange={v => set("hero_h1_part1",v)} />
          <Field label="H1 — выделение (оранжевое)" value={data.hero_h1_accent||""} onChange={v => set("hero_h1_accent",v)} />
          <Field label="H1 — 3-я строка" value={data.hero_h1_part2||""} onChange={v => set("hero_h1_part2",v)} />
          <Field label="Описание под H1" value={data.hero_desc||""} onChange={v => set("hero_desc",v)} rows={2} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Heading" size={14} className="text-orange-400" fallback="Circle" /> Заголовки секций
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Заголовок «Тарифы»" value={data.tariffs_title||""} onChange={v => set("tariffs_title",v)} />
          <Field label="Заголовок «Акции»" value={data.promos_title||""} onChange={v => set("promos_title",v)} />
          <Field label="Заголовок «Финансы»" value={data.finance_title||""} onChange={v => set("finance_title",v)} />
          <Field label="Подзаголовок «Финансы»" value={data.finance_subtitle||""} onChange={v => set("finance_subtitle",v)} />
          <Field label="Заголовок «Статистика»" value={data.stats_title||""} onChange={v => set("stats_title",v)} />
          <Field label="Заголовок «FAQ»" value={data.faq_title||""} onChange={v => set("faq_title",v)} />
          <Field label="Заголовок «Отзывы»" value={data.reviews_title||""} onChange={v => set("reviews_title",v)} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Phone" size={14} className="text-orange-400" fallback="Circle" /> Контакты
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Фраза над телефоном" value={data.phone_caption||""} onChange={v => set("phone_caption",v)} />
          <Field label="Телефон (числа)" value={data.phone||""} onChange={v => set("phone",v)} />
          <Field label="Телефон (отображение)" value={data.phone_display||""} onChange={v => set("phone_display",v)} />
          <Field label="Email" value={data.email||""} onChange={v => set("email",v)} />
          <Field label="Режим работы" value={data.work_hours||""} onChange={v => set("work_hours",v)} />
          <Field label="ВКонтакте (ссылка)" value={data.vk_url||""} onChange={v => set("vk_url",v)} />
          <Field label="Telegram (ссылка)" value={data.tg_url||""} onChange={v => set("tg_url",v)} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="ExternalLink" size={14} className="text-orange-400" fallback="Circle" /> Кнопка «Сведения об образовательной организации»
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Текст кнопки" value={data.info_label||""} onChange={v => set("info_label",v)} />
          <Field label="Ссылка (URL)" value={data.info_url||""} onChange={v => set("info_url",v)} />
        </div>
        <p className="text-white/40 text-xs mt-2">Если поле «Ссылка» пустое, кнопка не отображается.</p>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="MousePointerClick" size={14} className="text-orange-400" fallback="Circle" /> Кнопки модальных форм
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Кнопка отправки заявки (LeadForm)" value={data.btn_lead_submit||""} onChange={v => set("btn_lead_submit",v)} />
          <Field label="Кнопка «Обратный звонок» (модалка)" value={data.btn_callback_submit||""} onChange={v => set("btn_callback_submit",v)} />
          <Field label="Кнопка карточки акции" value={data.btn_promo_apply||""} onChange={v => set("btn_promo_apply",v)} />
          <Field label="Кнопка отправки в модалке акции" value={data.btn_promo_submit||""} onChange={v => set("btn_promo_submit",v)} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="Shield" size={14} className="text-orange-400" fallback="Circle" /> Политика конфиденциальности
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Заголовок (текст ссылки в футере)" value={data.policy_privacy_title||""} onChange={v => set("policy_privacy_title",v)} />
          <Field label="Текст (HTML разрешён). Оставьте пустым для дефолтного текста." value={data.policy_privacy_text||""} onChange={v => set("policy_privacy_text",v)} rows={10} />
        </div>
      </div>

      <div>
        <h3 className="text-white font-black text-sm uppercase mb-4 flex items-center gap-2">
          <Icon name="FileCheck" size={14} className="text-orange-400" fallback="Circle" /> Согласие на обработку ПД
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Заголовок (текст ссылки в футере)" value={data.policy_consent_title||""} onChange={v => set("policy_consent_title",v)} />
          <Field label="Текст (HTML разрешён). Оставьте пустым для дефолтного текста." value={data.policy_consent_text||""} onChange={v => set("policy_consent_text",v)} rows={10} />
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

  useEffect(() => {
    api("settings", "GET", undefined, token).then(res => {
      setData(res || {});
      setLoading(false);
    });
  }, [token]);

  const toggle = (key: string) => setData(d => ({ ...d, [key]: d[key] === "false" ? "true" : "false" }));

  const save = async () => {
    setSaving(true);
    const blockData = Object.fromEntries(BLOCKS.map(b => [b.key, data[b.key] || "true"]));
    const res = await api("settings", "POST", { data: blockData }, token);
    show(res.ok ? "Сохранено" : (res.error || "Ошибка"), res.ok ? "ok" : "err");
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