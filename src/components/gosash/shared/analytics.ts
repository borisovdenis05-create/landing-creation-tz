declare global {
  interface Window {
    ym?: (counterId: number, method: string, target: string, params?: object) => void;
  }
}

const YM_ID = 101026698;
const LEAD_GOALS = new Set(["lead_form_submit", "callback_request", "promo_form_submit"]);

export function ymGoal(target: string, params?: object) {
  window.ym?.(YM_ID, "reachGoal", target, params);
  if (LEAD_GOALS.has(target)) {
    window.ym?.(YM_ID, "reachGoal", "lead", params);
  }
}

const SEND_LEAD_URL = "https://functions.poehali.dev/d8995d2d-80a5-44fe-b27d-99cdaca844e6";
const ADMIN_API_URL = "https://functions.poehali.dev/941d16d5-04a2-4995-833a-9b8becab97a8";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

export async function sendLead(name: string, phone: string, comment = "") {
  const utm = getUtmParams();
  // 1) Уведомление менеджера (существующая функция)
  const sendNotify = fetch(SEND_LEAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, comment, ...utm }),
  }).catch(() => null);
  // 2) Сохранение в БД для админки
  const saveDb = fetch(`${ADMIN_API_URL}?action=lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      phone,
      tariff: comment.startsWith("Интересует тариф") ? comment : "",
      note: comment.startsWith("Интересует тариф") ? "" : comment,
      source: utm.utm_source || "site",
    }),
  }).catch(() => null);
  await Promise.all([sendNotify, saveDb]);
}