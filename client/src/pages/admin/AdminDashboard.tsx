import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import ApplicationServices, { type Application } from "../../services/admin/ApplicationServices";
import AdminSidebar from "../../compoenets/AdminSidebar";
import TelemetryServices, { type IDashboardStats } from "../../services/admin/TelemetryServices";


type AdminTab = "dashboard" | "team" | "projects" | "applications" | "community_settings" | "master_data";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as AdminTab) || "dashboard";

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // --- Telemetry Dashboard State ---
    const [stats, setStats] = useState<IDashboardStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await TelemetryServices.getDashboardStats();
            if (res.success && res.stats) {
                setStats(res.stats);
            }
        } catch (err) {
        } finally {
            setLoadingStats(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        setTimeout(() => setIsRefreshing(false), 400);
    };

    // --- Candidate Applications State ---
    const [applications, setApplications] = useState<Application[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [appToDelete, setAppToDelete] = useState<string | null>(null);
    const [applicationsSubTab, setApplicationsSubTab] = useState<"pending" | "accepted" | "rejected">("pending");

    const fetchApplications = async () => {
        setLoadingApps(true);
        try {
            const res = await ApplicationServices.getApplications();
            if (res.success && res.applications) {
                setApplications(res.applications);
            }
        } catch (err) {
        } finally {
            setLoadingApps(false);
        }
    };

    useEffect(() => {
        if (activeTab === "applications") {
            fetchApplications();
        }
    }, [activeTab]);

    const handleUpdateStatus = async (id: string, status: Application["status"]) => {
        try {
            const res = await ApplicationServices.updateApplicationStatus(id, status);
            if (res.success) {
                fetchApplications();
            } else {
                alert(res.message || "Failed to update status.");
            }
        } catch (err) {
        }
    };

    const executeDeleteApp = async (id: string) => {
        try {
            const res = await ApplicationServices.deleteApplication(id);
            if (res.success) {
                fetchApplications();
            } else {
                alert(res.message || "Failed to delete application.");
            }
        } catch (err) {
        }
    };

    useEffect(() => {
        if (activeTab === "team") {
            navigate("/admin/team");
        } else if (activeTab === "projects") {
            navigate("/admin/projects");
        } else if (activeTab === "applications") {
            navigate("/admin/applications");
        } else if (activeTab === "community_settings") {
            navigate("/admin/community-settings");
        } else if (activeTab === "master_data") {
            navigate("/admin/master-data");
        }
    }, [activeTab, navigate]);

    useEffect(() => {
        document.title = "HiveMind Admin | Dashboard";
        authService
            .getAdminStatus()
            .then(async (data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    await fetchStats();
                    setLoading(false);
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);


    // ==========================================
    // SUB-VIEWS RENDERING LOGIC
    // ==========================================

    // 1. Dashboard View
    const renderDashboardView = () => {
        if (loadingStats) {
            return <AdminLoader isComponent={true} />;
        }

        return (
            <div className="space-y-8 animate-fade-in-up text-left">
                {/* Welcome Message Header with Refresh Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="flex flex-col gap-1.5 text-left">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                            Welcome, {admin?.name || "Admin"}
                        </h2>
                        <p className="text-xs text-[#888888]">
                            Here is what's happening with the HiveMind today.
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-2 bg-white/[0.03] hover:bg-gold-primary/10 border border-white/10 hover:border-gold-primary/30 text-white hover:text-gold-primary text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 shadow-md group disabled:opacity-50 self-start sm:self-auto"
                        title="Refresh Analytics & Dashboard Data"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`${isRefreshing ? "animate-spin text-gold-primary" : "group-hover:rotate-180"} transition-transform duration-500`}
                        >
                            <path d="M21.5 2v6h-6" />
                            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                        <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
                    </button>
                </div>

                {/* Dynamic Telemetry Stats Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Total Members */}
                    <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 hover:border-gold-primary/20 rounded-3xl p-6 transition-all duration-300 group shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Total Members</span>
                            <div className="p-2 rounded-xl bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white group-hover:text-gold-primary transition-colors">{stats?.totalMembers ?? 0}</h3>
                        <span className="text-[9px] text-[#666666] uppercase font-bold tracking-wider mt-1 block">Total Members</span>
                    </div>

                    {/* Total Projects */}
                    <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 hover:border-gold-primary/20 rounded-3xl p-6 transition-all duration-300 group shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Total Projects</span>
                            <div className="p-2 rounded-xl bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white group-hover:text-gold-primary transition-colors">{stats?.totalProjects ?? 0}</h3>
                        <span className="text-[9px] text-[#666666] uppercase font-bold tracking-wider mt-1 block">AI Pipelines Registered</span>
                    </div>

                    {/* Pending Applications */}
                    <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.005] border border-white/5 hover:border-gold-primary/20 rounded-3xl p-6 transition-all duration-300 group shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Pending Applications</span>
                            <div className="p-2 rounded-xl bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" y1="8" x2="19" y2="14" />
                                    <line x1="16" y1="11" x2="22" y2="11" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-white group-hover:text-gold-primary transition-colors">{stats?.pendingApplications ?? 0}</h3>
                        <span className="text-[9px] text-[#666666] uppercase font-bold tracking-wider mt-1 block">Requires Review</span>
                    </div>
                </div>

                {/* Main Dashboard Panel Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Recent Activities */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Activities */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg">
                            <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-white border-b border-white/5 pb-3">
                                Recent Activities
                            </h3>
                            <div className="space-y-4">
                                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                                    stats.recentActivities.map((act) => (
                                        <div key={act.id} className="flex items-start justify-between text-xs py-3 border-b border-white/5 last:border-0 last:pb-0">
                                            <div className="flex gap-3">
                                                <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                                                    act.type === "member" ? "bg-emerald-500" :
                                                    act.type === "project" ? "bg-blue-500" :
                                                    "bg-gold-primary animate-pulse"
                                                }`} />
                                                <div>
                                                    <span className="text-white font-bold block">{act.title}</span>
                                                    <span className="text-[#AAAAAA] mt-0.5 block">{act.description}</span>
                                                </div>
                                            </div>
                                            <span className="text-[#666666] shrink-0 font-semibold text-[10px] ml-4">
                                                {new Date(act.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-[#666666] uppercase tracking-wider font-bold">No recent activities found</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="space-y-8">
                        {/* Quick Actions Panel */}
                        <section className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg">
                            <h3 className="text-base font-bold uppercase tracking-wider mb-6 text-white border-b border-white/5 pb-3">
                                Quick Actions
                            </h3>
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={() => navigate("/admin/team")}
                                    className="w-full flex items-center justify-between bg-white/[0.02] hover:bg-gold-primary/10 border border-white/5 hover:border-gold-primary/20 text-white rounded-2xl p-4 transition-all duration-300 font-bold uppercase tracking-wider text-xs text-left cursor-pointer group"
                                >
                                    <span>Add Team Member</span>
                                    <span className="text-[#888888] group-hover:text-gold-primary transition-colors">&rarr;</span>
                                </button>
                                <button 
                                    onClick={() => navigate("/admin/projects")}
                                    className="w-full flex items-center justify-between bg-white/[0.02] hover:bg-gold-primary/10 border border-white/5 hover:border-gold-primary/20 text-white rounded-2xl p-4 transition-all duration-300 font-bold uppercase tracking-wider text-xs text-left cursor-pointer group"
                                >
                                    <span>Register New Project</span>
                                    <span className="text-[#888888] group-hover:text-gold-primary transition-colors">&rarr;</span>
                                </button>
                                <button 
                                    onClick={() => navigate("/admin/community-settings")}
                                    className="w-full flex items-center justify-between bg-white/[0.02] hover:bg-gold-primary/10 border border-white/5 hover:border-gold-primary/20 text-white rounded-2xl p-4 transition-all duration-300 font-bold uppercase tracking-wider text-xs text-left cursor-pointer group"
                                >
                                    <span>Community Configuration</span>
                                    <span className="text-[#888888] group-hover:text-gold-primary transition-colors">&rarr;</span>
                                </button>
                                <button 
                                    onClick={() => navigate("/admin/master-data")}
                                    className="w-full flex items-center justify-between bg-white/[0.02] hover:bg-gold-primary/10 border border-white/5 hover:border-gold-primary/20 text-white rounded-2xl p-4 transition-all duration-300 font-bold uppercase tracking-wider text-xs text-left cursor-pointer group"
                                >
                                    <span>Configure Dropdown Options</span>
                                    <span className="text-[#888888] group-hover:text-gold-primary transition-colors">&rarr;</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    };

    // 2. Team Management Redirect Placeholder
    const renderTeamView = () => (
        <div className="text-center py-20 text-[#666666] uppercase text-xs font-bold animate-pulse">
            Redirecting to Team management...
        </div>
    );

    // 3. Projects View
    const renderProjectsView = () => (
        <div className="space-y-8 animate-fade-in">
            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                            Active Projects
                        </h2>
                        <p className="text-xs text-[#888888] mt-1">
                            Review artificial intelligence research and development pipelines.
                        </p>
                    </div>
                    <button className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102">
                        Create Project
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-gold-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                LLM Fine-Tuning Pipeline
                            </h3>
                            <span className="bg-gold-primary/10 text-gold-primary border border-gold-primary/20 text-[9px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                Training
                            </span>
                        </div>
                        <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                            Adapting open-source foundation models (LLaMA 3) to institutional domain specific knowledge bases.
                        </p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-[#666666]">
                            <span>GPU Cluster Node 04</span>
                            <span className="font-bold text-white">4x RTX 4090s</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 hover:border-gold-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">
                                Autonomous RAG Agents
                            </h3>
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                Deployed
                            </span>
                        </div>
                        <p className="text-xs text-[#AAAAAA] leading-relaxed mb-4">
                            Constructing multi-agent workflows executing file analysis and research review systems.
                        </p>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[10px] text-[#666666]">
                            <span>API Gateway Active</span>
                            <span className="font-bold text-white">Vector DB Core</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );



    // 5. Applications View (Applications under review)
    const renderApplicationsView = () => {
        const pendingApps = applications.filter(app => app.status !== "Approved" && app.status !== "Rejected");
        const acceptedApps = applications.filter(app => app.status === "Approved");
        const rejectedApps = applications.filter(app => app.status === "Rejected");
        
        const activeList = 
            applicationsSubTab === "pending" ? pendingApps : 
            applicationsSubTab === "accepted" ? acceptedApps : 
            rejectedApps;

        return (
            <div className="space-y-8 animate-fade-in">
                <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-8 shadow-lg">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                        <div>
                            <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                                Applications Management
                            </h2>
                            <p className="text-xs text-[#888888] mt-1">
                                Review student registration applications submitted via the landing page join portal.
                            </p>
                        </div>
                        <button 
                            onClick={fetchApplications}
                            className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        >
                            Refresh Applications
                        </button>
                    </div>

                    {/* Sub-tab Switcher Menu */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 border-b border-white/5">
                        <button
                            onClick={() => setApplicationsSubTab("pending")}
                            className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                applicationsSubTab === "pending"
                                    ? "border-gold-primary text-gold-primary"
                                    : "border-transparent text-[#888888] hover:text-white"
                            }`}
                        >
                            Pending Review ({pendingApps.length})
                        </button>
                        <button
                            onClick={() => setApplicationsSubTab("accepted")}
                            className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                applicationsSubTab === "accepted"
                                    ? "border-gold-primary text-gold-primary"
                                    : "border-transparent text-[#888888] hover:text-white"
                            }`}
                        >
                            Accepted ({acceptedApps.length})
                        </button>
                        <button
                            onClick={() => setApplicationsSubTab("rejected")}
                            className={`pb-3 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 bg-transparent border-none ${
                                applicationsSubTab === "rejected"
                                    ? "border-gold-primary text-gold-primary"
                                    : "border-transparent text-[#888888] hover:text-white"
                            }`}
                        >
                            Rejected Pool ({rejectedApps.length})
                        </button>
                    </div>

                    {loadingApps ? (
                        <AdminLoader isComponent={true} label="Querying application database..." />
                    ) : activeList.length === 0 ? (
                        <div className="py-20 text-center">
                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">
                                No {applicationsSubTab} applications found
                            </span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[#888888] uppercase font-bold tracking-wider">
                                        <th className="pb-3 pl-4">Applicant</th>
                                        <th className="pb-3">Year</th>
                                        <th className="pb-3">Domain</th>
                                        <th className="pb-3 text-center">Status</th>
                                        <th className="pb-3 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                    {activeList.map(app => (
                                        <tr key={app._id} className="hover:bg-white/[0.01] transition-colors">
                                            <td 
                                                onClick={() => setSelectedApp(app)}
                                                className="py-3.5 pl-4 font-bold text-white flex flex-col cursor-pointer hover:text-gold-primary transition-colors"
                                            >
                                                <span>{app.fullname}</span>
                                                <span className="text-[10px] text-[#666666] font-normal font-sans">{app.email}</span>
                                            </td>
                                            <td className="py-3.5">{app.year} Year</td>
                                            <td className="py-3.5 max-w-[120px] truncate">{app.domainOfInterest}</td>
                                            <td className="py-3.5 text-center">
                                                <span className={`border px-2.5 py-0.5 rounded-full font-semibold uppercase text-[9px] tracking-wider ${
                                                    app.status === "Approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    app.status === "Rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                    app.status === "Interviewed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                    "bg-gold-primary/10 text-gold-primary border-gold-primary/20"
                                                }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 pr-4 text-right">
                                                {applicationsSubTab === "pending" ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Approved")}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full mr-2 cursor-pointer transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Rejected")}
                                                            className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : applicationsSubTab === "accepted" ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Rejected")}
                                                            className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors mr-2"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Pending")}
                                                            className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white/60 hover:text-gold-primary text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                        >
                                                            Restore to Pending
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Approved")}
                                                            className="bg-emerald-500 hover:bg-emerald-600 text-black text-[9px] font-extrabold uppercase py-1.5 px-4 rounded-full mr-2 cursor-pointer transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(app._id, "Pending")}
                                                            className="bg-transparent border border-white/10 hover:border-gold-primary/30 text-white/60 hover:text-gold-primary text-[9px] font-bold uppercase py-1.5 px-4 rounded-full cursor-pointer transition-colors"
                                                        >
                                                            Restore to Pending
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        );
    };







    return (
        <div className="h-screen w-full bg-[#050505] flex text-white relative admin-workspace overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="dashboard"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* ==========================================
               MAIN CONTAINER CONTENT AREA
               ========================================== */}
            <div className="flex-1 flex flex-col min-w-0 h-full z-10 overflow-y-auto">
                {/* Mobile Top Header */}
                <header className="lg:hidden flex justify-between items-center bg-white/[0.02] border-b border-white/5 p-4 shadow-md backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="text-white hover:text-gold-primary transition-colors focus:outline-none cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-gold-sweep">
                            Admin Panel
                        </h1>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center font-bold text-xs text-gold-primary">
                        {admin?.name?.substring(0, 2).toUpperCase() || "AD"}
                    </div>
                </header>

                {/* Dashboard Tab Content Render */}
                <main className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col">
                    {loading ? (
                        <AdminLoader isComponent={true} />
                    ) : (
                        <>
                            {activeTab === "dashboard" && renderDashboardView()}
                            {activeTab === "team" && renderTeamView()}
                            {activeTab === "projects" && renderProjectsView()}
                            {activeTab === "applications" && renderApplicationsView()}
                        </>
                    )}
                </main>
            </div>
            {/* Custom View Applicant Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[10000] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in text-left">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <div>
                                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                                    Applicant Details
                                </h3>
                                <span className="text-[9px] text-[#888888] uppercase tracking-widest font-black block mt-0.5">
                                    Submitted {new Date(selectedApp.createdAt || "").toLocaleString()}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="text-[#888888] hover:text-white transition-colors cursor-pointer focus:outline-none bg-transparent border-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-h-[450px] overflow-y-auto pr-2">
                            {/* Personal */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Full Name</span>
                                    <span className="text-white font-semibold">{selectedApp.fullname}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Register Number</span>
                                    <span className="text-white font-semibold">{selectedApp.registerNumber}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Email Address</span>
                                    <a href={`mailto:${selectedApp.email}`} className="text-gold-primary hover:underline font-semibold">{selectedApp.email}</a>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Phone Number</span>
                                    <span className="text-white font-semibold">{selectedApp.phoneNumber}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Department & Year</span>
                                    <span className="text-white font-semibold">{selectedApp.dept} — {selectedApp.year} Year</span>
                                </div>
                            </div>

                            {/* Links & Technical */}
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Domain of Interest</span>
                                    <span className="text-gold-primary font-black uppercase tracking-widest text-[10px]">{selectedApp.domainOfInterest}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Programming Languages</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedApp.programmingLanguages.map((lang, i) => (
                                            <span key={i} className="bg-white/5 border border-white/10 text-white/80 text-[8px] font-bold px-2 py-0.5 rounded font-mono">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Hours available per week</span>
                                    <span className="text-white font-semibold">{selectedApp.hoursPerWeek} hours</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Referral Source</span>
                                    <span className="text-white font-semibold">{selectedApp.howDidYouHear}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Social & Resume Profiles</span>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <a href={selectedApp.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#0A66C2] text-[10px] font-bold uppercase tracking-wider no-underline inline-flex items-center gap-1 group">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0A66C2] group-hover:scale-110 transition-transform">
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                <rect x="2" y="9" width="4" height="12" />
                                                <circle cx="4" cy="4" r="2" />
                                            </svg>
                                            <span>LinkedIn</span>
                                        </a>
                                        {selectedApp.github && (
                                            <>
                                                <span className="text-white/10">|</span>
                                                <a href={selectedApp.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-wider no-underline inline-flex items-center gap-1 group">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform">
                                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                                    </svg>
                                                    <span>GitHub</span>
                                                </a>
                                            </>
                                        )}
                                        {selectedApp.portfolio && (
                                            <>
                                                <span className="text-white/10">|</span>
                                                <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#00D2FF] text-[10px] font-bold uppercase tracking-wider no-underline inline-flex items-center gap-1 group">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00D2FF] group-hover:scale-110 transition-transform">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="2" y1="12" x2="22" y2="12" />
                                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
                                                    </svg>
                                                    <span>Portfolio</span>
                                                </a>
                                            </>
                                        )}
                                        <span className="text-white/10">|</span>
                                        <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold uppercase tracking-wider no-underline">Resume PDF</a>
                                    </div>
                                </div>
                            </div>

                            {/* Essay Question */}
                            <div className="col-span-1 sm:col-span-2 border-t border-white/5 pt-4 space-y-1.5">
                                <span className="text-[9px] font-bold text-[#666666] uppercase tracking-wider block">Why do you want to join HiveMind?</span>
                                <p className="text-[#BBBBBB] leading-relaxed italic whitespace-pre-wrap">{selectedApp.whyJoin}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {appToDelete && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                    <div className="bg-[#0c0c0e] border border-red-500/20 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-[0_20px_50px_rgba(239,68,68,0.1)] text-center relative animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        
                        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                            Confirm Deletion
                        </h3>
                        <p className="text-xs text-[#888888] leading-relaxed mb-6 uppercase tracking-wider font-semibold">
                            Are you sure you want to delete this applicant? This action is permanent and cannot be undone.
                        </p>
                        
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setAppToDelete(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const id = appToDelete;
                                    setAppToDelete(null);
                                    await executeDeleteApp(id);
                                }}
                                className="bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(239,68,68,0.05)]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

