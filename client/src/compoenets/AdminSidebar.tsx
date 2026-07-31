import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../services/admin/authService";

export type AdminTab = "dashboard" | "team" | "projects" | "applications" | "community_settings" | "master_data";

interface AdminSidebarProps {
    activeTab: AdminTab;
    isMobileSidebarOpen: boolean;
    setIsMobileSidebarOpen: (open: boolean) => void;
    admin: AdminUser | null;
}

export default function AdminSidebar({
    activeTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    admin,
}: AdminSidebarProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate("/admin/login");
        } catch (error) {
            navigate("/admin/login");
        }
    };

    const navigationItems = [
        {
            id: "dashboard" as AdminTab,
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
            ),
        },
        {
            id: "team" as AdminTab,
            label: "Team management",
            path: "/admin/team",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        },
        {
            id: "projects" as AdminTab,
            label: "Projects",
            path: "/admin/projects",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
        },
        {
            id: "applications" as AdminTab,
            label: "Applications",
            path: "/admin/applications",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="16" y1="11" x2="22" y2="11" />
                </svg>
            ),
        },
        {
            id: "community_settings" as AdminTab,
            label: "Community Settings",
            path: "/admin/community-settings",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            ),
        },
        {
            id: "master_data" as AdminTab,
            label: "Master Data",
            path: "/admin/master-data",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
        },
    ];

    const renderSidebarContent = (isMobile: boolean) => (
        <div className="space-y-8 flex-1 flex flex-col justify-between h-full">
            <div className="space-y-8">
                {/* Logo and Brand Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/admin/dashboard")}>
                        <img
                            src="/assets/logos/HiveMind_logo_bg_removed.webp"
                            alt="HiveMind Logo"
                            decoding="async"
                            className="h-8 w-auto filter drop-shadow-[0_0_8px_rgba(255,193,7,0.35)] group-hover:scale-105 transition-transform"
                        />
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-gold-primary/15 via-amber-500/10 to-gold-primary/15 border border-gold-primary/30 shadow-[0_0_15px_rgba(255,193,7,0.2)] group-hover:border-gold-primary/60 transition-all">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold-primary"></span>
                            </span>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-white via-gold-primary to-amber-300 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                                Admin Panel
                            </h2>
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsMobileSidebarOpen(false)} className="text-[#888888] hover:text-white cursor-pointer focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1.5">
                    {navigationItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.25)]"
                                        : "bg-transparent border border-transparent text-[#888888] hover:text-white hover:bg-white/[0.01]"
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Profile & Logout */}
            <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                    <div className="truncate">
                        <span className="text-xs font-bold block text-white truncate">{admin?.name}</span>
                        <span className="text-[9px] text-[#666666] uppercase block font-semibold">{admin?.role}</span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:border-red-500/40 text-xs text-[#AAAAAA] hover:text-red-400 py-3 rounded-xl cursor-pointer transition-all duration-300 font-bold tracking-widest uppercase"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Aside Sidebar */}
            <aside className="hidden lg:flex w-64 h-full bg-[#050505] border-r border-white/5 p-6 flex-col justify-between shrink-0 overflow-y-auto z-20">
                {renderSidebarContent(false)}
            </aside>

            {/* Mobile Sidebar Slideout Drawer Overlay */}
            {isMobileSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMobileSidebarOpen(false)}>
                    <aside className="w-64 h-full bg-[#050505] border-r border-white/5 p-6 flex flex-col justify-between z-50 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {renderSidebarContent(true)}
                    </aside>
                </div>
            )}
        </>
    );
}
