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
  await fetch(SEND_LEAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, comment, ...getUtmParams() }),
  });
}
