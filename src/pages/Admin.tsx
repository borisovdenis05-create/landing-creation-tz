import { useState } from "react";
import Icon from "@/components/ui/icon";
import { LoginForm } from "@/components/admin/AdminUi";
import { SettingsTab, BlocksTab } from "@/components/admin/AdminSettingsTabs";
import { TariffsTab, BranchesTab, InstructorsTab, ReviewsTab } from "@/components/admin/AdminCrudTabs";

const TABS = [
  { id: "settings", label: "Настройки", icon: "Settings" },
  { id: "blocks", label: "Блоки", icon: "Layout" },
  { id: "tariffs", label: "Тарифы", icon: "Tag" },
  { id: "branches", label: "Филиалы", icon: "MapPin" },
  { id: "instructors", label: "Инструкторы", icon: "Users" },
  { id: "reviews", label: "Отзывы", icon: "Star" },
];

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gosash_admin_token"));
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <LoginForm onLogin={setToken} />;

  const logout = () => {
    localStorage.removeItem("gosash_admin_token");
    setToken(null);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#1a1a1a" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/10 transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "#2e2e2e" }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon name="Shield" size={18} className="text-white" fallback="Circle" />
            </div>
            <div>
              <p className="text-white font-black text-sm">ГОСАШ</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-orange-500 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
              <Icon name={tab.icon as Parameters<typeof Icon>[0]["name"]} size={16} fallback="Circle" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <a href="/" target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Icon name="ExternalLink" size={16} fallback="Circle" />
            Открыть сайт
          </a>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Icon name="LogOut" size={16} fallback="Circle" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 border-b border-white/10" style={{ background: "#2e2e2e" }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
            <Icon name="Menu" size={20} fallback="Circle" />
          </button>
          <h2 className="text-white font-black text-base flex-1">
            {TABS.find(t => t.id === activeTab)?.label}
          </h2>
        </header>
        <main className="flex-1 p-6">
          {activeTab === "settings" && <SettingsTab token={token} />}
          {activeTab === "blocks" && <BlocksTab token={token} />}
          {activeTab === "tariffs" && <TariffsTab token={token} />}
          {activeTab === "branches" && <BranchesTab token={token} />}
          {activeTab === "instructors" && <InstructorsTab token={token} />}
          {activeTab === "reviews" && <ReviewsTab token={token} />}
        </main>
      </div>
    </div>
  );
}
