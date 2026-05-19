// ─── Types ────────────────────────────────────────────────────────────────────
export type Tariff = {
  id?: number; name: string; hours: number; hours_label: string;
  theory: string; instructor: string; price: number; old_price?: number | null; gsm: number;
  badge: string; color: string; featured: boolean; installment: string;
  duration: string; features: string[]; restrictions: string[]; bonuses: string[];
  sort_order: number; active: boolean;
};

export type Branch = {
  id?: number; name: string; addr: string; rating: number;
  map_url: string; type: string; embed_url: string;
  active: boolean; sort_order: number;
};

export type Instructor = {
  id?: number; name: string; experience: string; specialization: string;
  photo_url: string; is_top: boolean; is_lady: boolean; active: boolean; sort_order: number;
};

export type Review = {
  id?: number; author: string; text: string; rating: number;
  photo_url: string; source: string; active: boolean; sort_order: number;
};

// ─── Re-exports ───────────────────────────────────────────────────────────────
export { TariffsTab } from "./AdminTariffsTab";
export { BranchesTab } from "./AdminBranchesTab";
export { InstructorsTab } from "./AdminInstructorsTab";
export { ReviewsTab } from "./AdminReviewsTab";
export { PromosTab } from "./AdminPromosTab";