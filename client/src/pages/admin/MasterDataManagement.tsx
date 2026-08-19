import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import DomainServices, { type DomainOption } from "../../services/admin/DomainServices";
import TechnologyServices, { type TechnologyOption } from "../../services/admin/TechnologyServices";
import AdminSidebar from "../../compoenets/AdminSidebar";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";
import Portal from "../../compoenets/Portal";

// --- SEARCHABLE TECH SELECT FOR DOMAIN FORM ---
function SearchableTechSelect({
    label,
    allTechs,
    selectedIds,
    onChange,
    onCreateTech,
}: {
    label: string;
    allTechs: TechnologyOption[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    onCreateTech: (name: string) => Promise<string | null>;
}) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredTechs = allTechs.filter(tech =>
        tech.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(x => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const isExactMatch = allTechs.some(tech => tech.name.toLowerCase() === search.trim().toLowerCase());

    const handleCreate = async () => {
        const name = search.trim();
        if (!name) return;
        
        // Check if already in list first
        const existing = allTechs.find(t => t.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            if (!selectedIds.includes(existing._id)) {
                onChange([...selectedIds, existing._id]);
            }
            setSearch("");
            return;
        }

        const newId = await onCreateTech(name);
        if (newId) {
            onChange([...selectedIds, newId]);
        }
        setSearch("");
    };

    return (
        <div className="flex flex-col gap-1.5 relative text-left w-full">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">{label}</label>
            
            <div 
                className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 min-h-[42px] flex flex-wrap gap-2 items-center cursor-text"
                onClick={() => setIsOpen(true)}
            >
                {selectedIds.map(id => {
                    const techObj = allTechs.find(t => t._id === id);
                    if (!techObj) return null;
                    return (
                        <span key={id} className="bg-gold-primary/10 border border-gold-primary/20 text-gold-primary px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 select-none">
                            {techObj.name}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(selectedIds.filter(x => x !== id));
                                }}
                                className="text-gold-primary/60 hover:text-gold-primary cursor-pointer bg-transparent border-none p-0 flex-shrink-0 font-bold"
                            >
                                &times;
                            </button>
                        </span>
                    );
                })}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    className="flex-1 min-w-[120px] bg-transparent border-none text-white text-xs focus:outline-none font-semibold p-0.5"
                />
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[320px] overflow-y-auto p-2 space-y-1">
                        {filteredTechs.map(tech => {
                            const isChecked = selectedIds.includes(tech._id);
                            return (
                                <div
                                    key={tech._id}
                                    onClick={() => toggleOption(tech._id)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        readOnly
                                        className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                    />
                                    <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                        {tech.name}
                                    </span>
                                </div>
                            );
                        })}

                        {search.trim() !== "" && !isExactMatch && (
                            <div
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-2.5 py-2 text-gold-primary hover:bg-gold-primary/5 rounded-md cursor-pointer transition-colors text-xs font-bold border border-dashed border-gold-primary/20"
                            >
                                <span>+ Add "{search.trim()}"</span>
                            </div>
                        )}

                        {filteredTechs.length === 0 && search.trim() === "" && (
                            <div className="p-2 text-center text-xs text-white/40 italic">
                                No matching technologies found.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// --- SEARCHABLE DOMAIN SELECT FOR TECH FORM ---
function SearchableDomainSelect({
    label,
    allDomains,
    selectedIds,
    onChange,
}: {
    label: string;
    allDomains: DomainOption[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredDomains = allDomains.filter(dom =>
        dom.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(x => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 relative text-left w-full">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">{label}</label>
            
            <div 
                className="bg-white/[0.02] border border-white/10 rounded-xl p-2.5 min-h-[42px] flex flex-wrap gap-2 items-center cursor-text"
                onClick={() => setIsOpen(true)}
            >
                {selectedIds.map(id => {
                    const domObj = allDomains.find(d => d._id === id);
                    if (!domObj) return null;
                    return (
                        <span key={id} className="bg-gold-primary/10 border border-gold-primary/20 text-gold-primary px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 select-none">
                            {domObj.name}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(selectedIds.filter(x => x !== id));
                                }}
                                className="text-gold-primary/60 hover:text-gold-primary cursor-pointer bg-transparent border-none p-0 flex-shrink-0 font-bold"
                            >
                                &times;
                            </button>
                        </span>
                    );
                })}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    className="flex-1 min-w-[120px] bg-transparent border-none text-white text-xs focus:outline-none font-semibold p-0.5"
                />
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[320px] overflow-y-auto p-2 space-y-1">
                        {filteredDomains.map(dom => {
                            const isChecked = selectedIds.includes(dom._id);
                            return (
                                <div
                                    key={dom._id}
                                    onClick={() => toggleOption(dom._id)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        readOnly
                                        className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                    />
                                    <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                        {dom.name}
                                    </span>
                                </div>
                            );
                        })}

                        {filteredDomains.length === 0 && (
                            <div className="p-2 text-center text-xs text-white/40 italic">
                                No domains found.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function MasterDataManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Toast feedback state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Sub Tabs config
    const [activeSubTab, setActiveSubTab] = useState<"general" | "domains" | "technologies">("general");

    // ==========================================
    // SUB-TAB 1: GENERAL OPTIONS STATE & LOGIC
    // ==========================================
    const [options, setOptions] = useState<IMasterDataOption[]>([]);
    const [newInputs, setNewInputs] = useState({
        department: "",
        section: "",
        batch: "",
        year: "",
        programming_language: "",
        duration: ""
    });
    const [addingCategory, setAddingCategory] = useState<string | null>(null);

    const fetchOptions = async () => {
        try {
            const res = await MasterDataServices.getMasterData();
            if (res.success && res.data) {
                setOptions(res.data);
            }
        } catch (err) {
            setToast({ message: "Failed to load master data.", type: "error" });
        }
    };

    const handleAddOption = async (category: "department" | "section" | "batch" | "year" | "programming_language" | "duration") => {
        const val = newInputs[category].trim();
        if (!val) {
            setToast({ message: "Value cannot be empty.", type: "error" });
            return;
        }

        setAddingCategory(category);
        try {
            const res = await MasterDataServices.addMasterData(category, val);
            if (res.success && res.option) {
                setToast({ message: `"${val}" added successfully.`, type: "success" });
                setNewInputs(prev => ({ ...prev, [category]: "" }));
                fetchOptions();
            } else {
                setToast({ message: res.message || "Failed to add option.", type: "error" });
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to add option.", type: "error" });
        } finally {
            setAddingCategory(null);
        }
    };

    const handleDeleteOption = async (id: string, label: string) => {
        try {
            const res = await MasterDataServices.deleteMasterData(id);
            if (res.success) {
                setToast({ message: `Option "${label}" deleted successfully.`, type: "success" });
                fetchOptions();
            } else {
                setToast({ message: res.message || "Failed to delete option.", type: "error" });
            }
        } catch (err) {
            setToast({ message: "Failed to delete option.", type: "error" });
        }
    };

    // Drag & Drop reorder state for general options
    const [draggedOption, setDraggedOption] = useState<{ category: string; index: number } | null>(null);
    const [dragOverOption, setDragOverOption] = useState<{ category: string; index: number } | null>(null);

    const handleDragStart = (category: string, index: number, e: React.DragEvent) => {
        setDraggedOption({ category, index });
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", `${category}:${index}`);
    };

    const handleDragOver = (category: string, index: number, e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!draggedOption || draggedOption.category !== category) return;
        if (dragOverOption?.index !== index) {
            setDragOverOption({ category, index });
        }
    };

    const handleDropOption = async (targetCategory: string, targetIndex: number, e: React.DragEvent) => {
        e.preventDefault();
        setDragOverOption(null);

        if (!draggedOption || draggedOption.category !== targetCategory) {
            setDraggedOption(null);
            return;
        }

        const sourceIndex = draggedOption.index;
        setDraggedOption(null);

        if (sourceIndex === targetIndex) return;

        const catOptions = options.filter(opt => opt.category === targetCategory);
        const updatedCatOptions = [...catOptions];
        const [movedItem] = updatedCatOptions.splice(sourceIndex, 1);
        updatedCatOptions.splice(targetIndex, 0, movedItem);

        const orderedIds = updatedCatOptions.map(opt => opt._id);

        // Optimistically update local options state
        setOptions(prev => {
            const otherOptions = prev.filter(opt => opt.category !== targetCategory);
            return [...otherOptions, ...updatedCatOptions];
        });

        try {
            // Silently persist new order without triggering toast messages
            await MasterDataServices.reorderMasterData(targetCategory, orderedIds);
        } catch (err) {
            fetchOptions();
        }
    };

    const getOptionsByCategory = (cat: string) => {
        return options.filter(opt => opt.category === cat);
    };

    const categories = [
        { key: "department" as const, title: "Departments" },
        { key: "section" as const, title: "Sections" },
        { key: "batch" as const, title: "Generations" },
        { key: "year" as const, title: "Years of Study" },
        { key: "programming_language" as const, title: "Programming Languages" },
        { key: "duration" as const, title: "Project Durations" }
    ];

    // ==========================================
    // SUB-TAB 2: DOMAINS STATE & LOGIC
    // ==========================================
    const [domainsList, setDomainsList] = useState<DomainOption[]>([]);
    const [loadingDomains, setLoadingDomains] = useState(false);
    
    // Domain Modal states
    const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
    const [domainModalMode, setDomainModalMode] = useState<"add" | "edit">("add");
    const [editingDomainId, setEditingDomainId] = useState("");
    const [domainFormValues, setDomainFormValues] = useState({
        name: "",
        description: "",
        technologies: [] as string[],
        isActive: true,
        sortOrder: 0
    });

    const fetchDomains = async () => {
        setLoadingDomains(true);
        try {
            const res = await DomainServices.getDomains();
            if (res.success && res.data) {
                setDomainsList(res.data);
            }
        } catch (err) {
            setToast({ message: "Failed to load domains.", type: "error" });
        } finally {
            setLoadingDomains(false);
        }
    };

    const openAddDomainModal = () => {
        setDomainModalMode("add");
        setEditingDomainId("");
        setDomainFormValues({
            name: "",
            description: "",
            technologies: [],
            isActive: true,
            sortOrder: 0
        });
        setIsDomainModalOpen(true);
    };

    const openEditDomainModal = (dom: DomainOption) => {
        setDomainModalMode("edit");
        setEditingDomainId(dom._id);
        setDomainFormValues({
            name: dom.name,
            description: dom.description || "",
            technologies: dom.technologies.map(t => t._id),
            isActive: dom.isActive,
            sortOrder: dom.sortOrder
        });
        setIsDomainModalOpen(true);
    };

    const handleDomainFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainFormValues.name.trim()) {
            setToast({ message: "Domain name is required.", type: "error" });
            return;
        }

        try {
            if (domainModalMode === "add") {
                const res = await DomainServices.createDomain(domainFormValues);
                if (res.success) {
                    setToast({ message: "Domain created successfully.", type: "success" });
                    setIsDomainModalOpen(false);
                    fetchDomains();
                    fetchTechnologies(); // Sync changes
                }
            } else {
                const res = await DomainServices.updateDomain(editingDomainId, domainFormValues);
                if (res.success) {
                    setToast({ message: "Domain updated successfully.", type: "success" });
                    setIsDomainModalOpen(false);
                    fetchDomains();
                    fetchTechnologies(); // Sync changes
                }
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to save domain.", type: "error" });
        }
    };

    const handleCreateTechFromDomainForm = async (techName: string): Promise<string | null> => {
        try {
            const res = await TechnologyServices.createTechnology({
                name: techName,
                description: `Created from Domain form`,
                domains: [],
                isActive: true,
                sortOrder: 0
            });
            if (res.success && res.data) {
                setToast({ message: `Technology "${techName}" created successfully.`, type: "success" });
                await fetchTechnologies(); // Reload technology catalog
                return res.data._id;
            }
            return null;
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to create technology.", type: "error" });
            return null;
        }
    };

    const handleDeleteDomain = async (id: string, name: string, force: boolean = false) => {
        try {
            const res = await DomainServices.deleteDomain(id, force);
            if (res.success) {
                setToast({ message: `Domain "${name}" deleted successfully.`, type: "success" });
                fetchDomains();
                fetchTechnologies(); // Sync
            } else if (res.isReferenced) {
                const confirmForce = window.confirm(
                    `${res.message}\n\nDo you want to permanently delete it anyway? This will unlink it from all associated technologies.`
                );
                if (confirmForce) {
                    handleDeleteDomain(id, name, true);
                }
            } else {
                setToast({ message: res.message || "Failed to delete domain.", type: "error" });
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to delete domain.", type: "error" });
        }
    };

    const handleToggleDomainStatus = async (dom: DomainOption) => {
        try {
            const res = await DomainServices.updateDomain(dom._id, { isActive: !dom.isActive });
            if (res.success) {
                setToast({ message: `Domain status updated successfully.`, type: "success" });
                fetchDomains();
            }
        } catch (err: any) {
            setToast({ message: "Failed to update domain status.", type: "error" });
        }
    };

    // ==========================================
    // SUB-TAB 3: TECHNOLOGIES STATE & LOGIC
    // ==========================================
    const [technologiesList, setTechnologiesList] = useState<TechnologyOption[]>([]);
    const [loadingTechnologies, setLoadingTechnologies] = useState(false);

    // Technology Modal states
    const [isTechModalOpen, setIsTechModalOpen] = useState(false);
    const [techModalMode, setTechModalMode] = useState<"add" | "edit">("add");
    const [editingTechId, setEditingTechId] = useState("");
    const [techFormValues, setTechFormValues] = useState({
        name: "",
        description: "",
        domains: [] as string[],
        isActive: true,
        sortOrder: 0
    });

    const fetchTechnologies = async () => {
        setLoadingTechnologies(true);
        try {
            const res = await TechnologyServices.getTechnologies();
            if (res.success && res.data) {
                setTechnologiesList(res.data);
            }
        } catch (err) {
            setToast({ message: "Failed to load technologies.", type: "error" });
        } finally {
            setLoadingTechnologies(false);
        }
    };

    const openAddTechModal = () => {
        setTechModalMode("add");
        setEditingTechId("");
        setTechFormValues({
            name: "",
            description: "",
            domains: [],
            isActive: true,
            sortOrder: 0
        });
        setIsTechModalOpen(true);
    };

    const openEditTechModal = (tech: TechnologyOption) => {
        setTechModalMode("edit");
        setEditingTechId(tech._id);
        setTechFormValues({
            name: tech.name,
            description: tech.description || "",
            domains: tech.domains.map(d => d._id),
            isActive: tech.isActive,
            sortOrder: tech.sortOrder
        });
        setIsTechModalOpen(true);
    };

    const handleTechFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!techFormValues.name.trim()) {
            setToast({ message: "Technology name is required.", type: "error" });
            return;
        }

        try {
            if (techModalMode === "add") {
                const res = await TechnologyServices.createTechnology(techFormValues);
                if (res.success) {
                    setToast({ message: "Technology created successfully.", type: "success" });
                    setIsTechModalOpen(false);
                    fetchTechnologies();
                    fetchDomains(); // Sync
                }
            } else {
                const res = await TechnologyServices.updateTechnology(editingTechId, techFormValues);
                if (res.success) {
                    setToast({ message: "Technology updated successfully.", type: "success" });
                    setIsTechModalOpen(false);
                    fetchTechnologies();
                    fetchDomains(); // Sync
                }
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to save technology.", type: "error" });
        }
    };

    const handleDeleteTechnology = async (id: string, name: string, force: boolean = false) => {
        try {
            const res = await TechnologyServices.deleteTechnology(id, force);
            if (res.success) {
                setToast({ message: `Technology "${name}" deleted successfully.`, type: "success" });
                fetchTechnologies();
                fetchDomains(); // Sync
            } else if (res.isReferenced) {
                const confirmForce = window.confirm(
                    `${res.message}\n\nDo you want to permanently delete it anyway? This will unlink it from all associated domains.`
                );
                if (confirmForce) {
                    handleDeleteTechnology(id, name, true);
                }
            } else {
                setToast({ message: res.message || "Failed to delete technology.", type: "error" });
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Failed to delete technology.", type: "error" });
        }
    };

    const handleToggleTechStatus = async (tech: TechnologyOption) => {
        try {
            const res = await TechnologyServices.updateTechnology(tech._id, { isActive: !tech.isActive });
            if (res.success) {
                setToast({ message: `Technology status updated successfully.`, type: "success" });
                fetchTechnologies();
            }
        } catch (err: any) {
            setToast({ message: "Failed to update technology status.", type: "error" });
        }
    };

    // ==========================================
    // MASTER INITIALIZATION
    // ==========================================
    useEffect(() => {
        document.title = "HiveMind Admin | Master Data";
        authService
            .getAdminStatus()
            .then(async (data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    await Promise.all([fetchOptions(), fetchDomains(), fetchTechnologies()]);
                    setLoading(false);
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    return (
        <div className="h-screen w-full bg-[#050505] flex text-white relative admin-workspace overflow-hidden">
            {addingCategory && (
                <Portal>
                    <AdminLoader />
                </Portal>
            )}
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="master_data"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full z-10 overflow-y-auto">
                {/* Mobile Header */}
                <header className="lg:hidden flex justify-between items-center bg-white/[0.02] border-b border-white/5 p-4 shadow-md backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="text-white hover:text-gold-primary transition-colors focus:outline-none cursor-pointer bg-transparent border-none"
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

                <main className="flex-1 p-6 sm:p-10 md:p-12 max-w-5xl w-full mx-auto space-y-8 animate-fade-in-up flex flex-col">
                    {loading ? (
                        <AdminLoader isComponent={true} />
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-black uppercase tracking-wider text-white">
                                        Master Data Configuration
                                    </h1>
                                    <p className="text-xs text-[#888888] mt-1">
                                        Configure selection options, technical domains, and technologies used across the application.
                                    </p>
                                </div>
                            </div>

                            {/* NAVIGATION SUB-TABS */}
                            <div className="flex border-b border-white/5 pb-1 gap-2.5">
                                <button
                                    onClick={() => setActiveSubTab("general")}
                                    className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                                        activeSubTab === "general"
                                            ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.15)] font-black"
                                            : "bg-transparent border border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Selection Options
                                </button>
                                <button
                                    onClick={() => setActiveSubTab("domains")}
                                    className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                                        activeSubTab === "domains"
                                            ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.15)] font-black"
                                            : "bg-transparent border border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Domains
                                </button>
                                <button
                                    onClick={() => setActiveSubTab("technologies")}
                                    className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                                        activeSubTab === "technologies"
                                            ? "bg-gold-primary/10 border border-gold-primary/20 text-gold-primary [text-shadow:0_0_10px_rgba(255,193,7,0.15)] font-black"
                                            : "bg-transparent border border-transparent text-[#888888] hover:text-white"
                                    }`}
                                >
                                    Technologies
                                </button>
                            </div>

                            {/* SUB-TAB CONTENTS */}
                            {activeSubTab === "general" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                    {categories.map(({ key, title }) => {
                                        const currentOptions = getOptionsByCategory(key);
                                        const isAdding = addingCategory === key;
                                        return (
                                            <div key={key} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
                                                        {title} ({currentOptions.length})
                                                    </h2>

                                                    <div className="flex flex-wrap gap-2.5 min-h-[60px] content-start">
                                                        {currentOptions.length === 0 ? (
                                                            <span className="text-[10px] text-[#555555] uppercase tracking-wider font-bold italic py-2">
                                                                No options set.
                                                            </span>
                                                        ) : (
                                                            currentOptions.map((opt, idx) => {
                                                                const isDragging = draggedOption?.category === key && draggedOption?.index === idx;
                                                                const isDragOver = dragOverOption?.category === key && dragOverOption?.index === idx;

                                                                return (
                                                                    <span
                                                                        key={opt._id}
                                                                        draggable={true}
                                                                        onDragStart={(e) => handleDragStart(key, idx, e)}
                                                                        onDragOver={(e) => handleDragOver(key, idx, e)}
                                                                        onDrop={(e) => handleDropOption(key, idx, e)}
                                                                        onDragEnd={() => {
                                                                            setDraggedOption(null);
                                                                            setDragOverOption(null);
                                                                        }}
                                                                        className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full select-none transition-all cursor-grab active:cursor-grabbing ${
                                                                            isDragging
                                                                                ? "opacity-30 scale-95 border border-dashed border-gold-primary/60 bg-gold-primary/5"
                                                                                : isDragOver
                                                                                ? "border border-gold-primary bg-gold-primary/20 scale-105 shadow-[0_0_12px_rgba(255,193,7,0.4)] text-gold-primary"
                                                                                : "bg-gold-primary/5 hover:bg-gold-primary/10 border border-gold-primary/10 text-[#DDDDDD]"
                                                                        }`}
                                                                        title="Drag to reorder"
                                                                    >
                                                                        {/* Grip Icon */}
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="12"
                                                                            height="12"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="text-white/30 group-hover:text-gold-primary/60 flex-shrink-0"
                                                                        >
                                                                            <circle cx="9" cy="5" r="1" />
                                                                            <circle cx="9" cy="12" r="1" />
                                                                            <circle cx="9" cy="19" r="1" />
                                                                            <circle cx="15" cy="5" r="1" />
                                                                            <circle cx="15" cy="12" r="1" />
                                                                            <circle cx="15" cy="19" r="1" />
                                                                        </svg>

                                                                        <span>{opt.value}</span>

                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteOption(opt._id, opt.value);
                                                                            }}
                                                                            className="text-white/30 hover:text-red-400 p-0.5 cursor-pointer bg-transparent border-none focus:outline-none flex-shrink-0 ml-0.5"
                                                                            title="Delete"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                                            </svg>
                                                                        </button>
                                                                    </span>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-4 border-t border-white/5 mt-4">
                                                    <input
                                                        type="text"
                                                        value={newInputs[key]}
                                                        onChange={(e) => setNewInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                                        className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleAddOption(key);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleAddOption(key)}
                                                        disabled={isAdding}
                                                        className="bg-gold-primary hover:bg-gold-light disabled:bg-white/5 text-black disabled:text-white/40 border-none px-5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
                                                    >
                                                        {isAdding ? "Adding..." : "+ Add"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeSubTab === "domains" && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Domain Records ({domainsList.length})
                                        </h2>
                                        <button
                                            onClick={openAddDomainModal}
                                            className="bg-gold-primary hover:bg-gold-light text-black border-none py-2 px-5 rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
                                        >
                                            + Add Domain
                                        </button>
                                    </div>

                                    {loadingDomains ? (
                                        <AdminLoader isComponent={true} label="Loading domains..." />
                                    ) : domainsList.length === 0 ? (
                                        <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl text-[#555555] text-xs font-bold uppercase tracking-wider italic">
                                            No domains found.
                                        </div>
                                    ) : (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                        <tr className="border-b border-white/5 bg-white/[0.01] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                                                            <th className="p-4 sm:p-5">Domain Name</th>
                                                            <th className="p-4 sm:p-5">Slug</th>
                                                            <th className="p-4 sm:p-5">Related Techs</th>
                                                            <th className="p-4 sm:p-5">Order</th>
                                                            <th className="p-4 sm:p-5">Status</th>
                                                            <th className="p-4 sm:p-5 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 font-semibold">
                                                        {domainsList.map(dom => {
                                                            const mainTechs = dom.technologies.slice(0, 3);
                                                            const extraCount = dom.technologies.length - mainTechs.length;

                                                            return (
                                                                <tr key={dom._id} className="hover:bg-white/[0.01] transition-colors">
                                                                    <td className="p-4 sm:p-5 text-white font-bold">{dom.name}</td>
                                                                    <td className="p-4 sm:p-5 text-white/50 font-mono">{dom.slug}</td>
                                                                    <td className="p-4 sm:p-5">
                                                                        <div className="flex flex-wrap gap-1 items-center">
                                                                            {dom.technologies.length === 0 ? (
                                                                                <span className="text-[10px] text-white/20 italic">None</span>
                                                                            ) : (
                                                                                <>
                                                                                    {mainTechs.map(t => (
                                                                                        <span key={t._id} className="bg-white/5 border border-white/10 text-white/60 text-[9px] px-2 py-0.5 rounded">
                                                                                            {t.name}
                                                                                        </span>
                                                                                    ))}
                                                                                    {extraCount > 0 && (
                                                                                        <span 
                                                                                            className="text-[9px] text-gold-primary/80 font-bold"
                                                                                            title={dom.technologies.slice(3).map(t => t.name).join(", ")}
                                                                                        >
                                                                                            +{extraCount} more
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 sm:p-5 text-white/60">{dom.sortOrder}</td>
                                                                    <td className="p-4 sm:p-5">
                                                                        <button
                                                                            onClick={() => handleToggleDomainStatus(dom)}
                                                                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                                                                                dom.isActive
                                                                                    ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                                                                    : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                                                            }`}
                                                                        >
                                                                            {dom.isActive ? "Active" : "Inactive"}
                                                                        </button>
                                                                    </td>
                                                                    <td className="p-4 sm:p-5 text-right flex gap-3 justify-end items-center">
                                                                        <button
                                                                            onClick={() => openEditDomainModal(dom)}
                                                                            className="text-white/60 hover:text-gold-primary text-[10px] uppercase font-bold cursor-pointer bg-transparent border-none"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteDomain(dom._id, dom.name)}
                                                                            className="text-white/40 hover:text-red-400 text-[10px] uppercase font-bold cursor-pointer bg-transparent border-none"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeSubTab === "technologies" && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                                            Technology Records ({technologiesList.length})
                                        </h2>
                                        <button
                                            onClick={openAddTechModal}
                                            className="bg-gold-primary hover:bg-gold-light text-black border-none py-2 px-5 rounded-full text-[10px] font-extrabold uppercase tracking-widest cursor-pointer transition-colors"
                                        >
                                            + Add Technology
                                        </button>
                                    </div>

                                    {loadingTechnologies ? (
                                        <AdminLoader isComponent={true} label="Loading technologies..." />
                                    ) : technologiesList.length === 0 ? (
                                        <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-3xl text-[#555555] text-xs font-bold uppercase tracking-wider italic">
                                            No technologies found.
                                        </div>
                                    ) : (
                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                        <tr className="border-b border-white/5 bg-white/[0.01] text-[#888888] font-bold uppercase tracking-wider text-[10px]">
                                                            <th className="p-4 sm:p-5">Tech Name</th>
                                                            <th className="p-4 sm:p-5">Slug</th>
                                                            <th className="p-4 sm:p-5">Mapped Domains</th>
                                                            <th className="p-4 sm:p-5">Order</th>
                                                            <th className="p-4 sm:p-5">Status</th>
                                                            <th className="p-4 sm:p-5 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/5 font-semibold">
                                                        {technologiesList.map(tech => {
                                                            const mainDoms = tech.domains.slice(0, 3);
                                                            const extraCount = tech.domains.length - mainDoms.length;

                                                            return (
                                                                <tr key={tech._id} className="hover:bg-white/[0.01] transition-colors">
                                                                    <td className="p-4 sm:p-5 text-white font-bold">{tech.name}</td>
                                                                    <td className="p-4 sm:p-5 text-white/50 font-mono">{tech.slug}</td>
                                                                    <td className="p-4 sm:p-5">
                                                                        <div className="flex flex-wrap gap-1 items-center">
                                                                            {tech.domains.length === 0 ? (
                                                                                <span className="text-[10px] text-white/20 italic">None</span>
                                                                            ) : (
                                                                                <>
                                                                                    {mainDoms.map(d => (
                                                                                        <span key={d._id} className="bg-white/5 border border-white/10 text-white/60 text-[9px] px-2 py-0.5 rounded">
                                                                                            {d.name}
                                                                                        </span>
                                                                                    ))}
                                                                                    {extraCount > 0 && (
                                                                                        <span 
                                                                                            className="text-[9px] text-gold-primary/80 font-bold"
                                                                                            title={tech.domains.slice(3).map(d => d.name).join(", ")}
                                                                                        >
                                                                                            +{extraCount} more
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 sm:p-5 text-white/60">{tech.sortOrder}</td>
                                                                    <td className="p-4 sm:p-5">
                                                                        <button
                                                                            onClick={() => handleToggleTechStatus(tech)}
                                                                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                                                                                tech.isActive
                                                                                    ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                                                                    : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                                                            }`}
                                                                        >
                                                                            {tech.isActive ? "Active" : "Inactive"}
                                                                        </button>
                                                                    </td>
                                                                    <td className="p-4 sm:p-5 text-right flex gap-3 justify-end items-center">
                                                                        <button
                                                                            onClick={() => openEditTechModal(tech)}
                                                                            className="text-white/60 hover:text-gold-primary text-[10px] uppercase font-bold cursor-pointer bg-transparent border-none"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteTechnology(tech._id, tech.name)}
                                                                            className="text-white/40 hover:text-red-400 text-[10px] uppercase font-bold cursor-pointer bg-transparent border-none"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* DOMAIN FORM FORM MODAL */}
            {isDomainModalOpen && (
            <Portal>
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[999] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in text-left">
                        <h3 className="text-base font-black uppercase tracking-wider text-white mb-6">
                            {domainModalMode === "add" ? "Add Domain" : "Edit Domain"}
                        </h3>

                        <form onSubmit={handleDomainFormSubmit} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Domain Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold"
                                    value={domainFormValues.name}
                                    onChange={(e) => setDomainFormValues({ ...domainFormValues, name: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={3}
                                    className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold resize-none"
                                    value={domainFormValues.description}
                                    onChange={(e) => setDomainFormValues({ ...domainFormValues, description: e.target.value })}
                                />
                            </div>

                            <SearchableTechSelect
                                label="Related Tech Stacks"
                                allTechs={technologiesList}
                                selectedIds={domainFormValues.technologies}
                                onChange={(ids) => setDomainFormValues({ ...domainFormValues, technologies: ids })}
                                onCreateTech={handleCreateTechFromDomainForm}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Sort Order</label>
                                    <input
                                        type="number"
                                        className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold"
                                        value={domainFormValues.sortOrder}
                                        onChange={(e) => setDomainFormValues({ ...domainFormValues, sortOrder: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <CustomSingleSelect
                                    label="Status"
                                    bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-4 text-xs font-semibold h-[42px]"
                                    dropdownBgClass="bg-[#0c0c0e]"
                                    options={[
                                        { value: "true", label: "Active" },
                                        { value: "false", label: "Inactive" }
                                    ]}
                                    value={domainFormValues.isActive ? "true" : "false"}
                                    onChange={(val) => setDomainFormValues({ ...domainFormValues, isActive: val === "true" })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsDomainModalOpen(false)}
                                    className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                                >
                                    Save Domain
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Portal>
            )}

            {/* TECHNOLOGY FORM MODAL */}
            {isTechModalOpen && (
            <Portal>
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[999] p-4 overflow-y-auto">
                    <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative my-8 animate-fade-in text-left">
                        <h3 className="text-base font-black uppercase tracking-wider text-white mb-6">
                            {techModalMode === "add" ? "Add Technology" : "Edit Technology"}
                        </h3>

                        <form onSubmit={handleTechFormSubmit} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Technology Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold"
                                    value={techFormValues.name}
                                    onChange={(e) => setTechFormValues({ ...techFormValues, name: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={3}
                                    className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold resize-none"
                                    value={techFormValues.description}
                                    onChange={(e) => setTechFormValues({ ...techFormValues, description: e.target.value })}
                                />
                            </div>

                            <SearchableDomainSelect
                                label="Mapped Domains"
                                allDomains={domainsList}
                                selectedIds={techFormValues.domains}
                                onChange={(ids) => setTechFormValues({ ...techFormValues, domains: ids })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Sort Order</label>
                                    <input
                                        type="number"
                                        className="bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-4 text-white text-xs focus:outline-none focus:border-gold-primary font-semibold"
                                        value={techFormValues.sortOrder}
                                        onChange={(e) => setTechFormValues({ ...techFormValues, sortOrder: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <CustomSingleSelect
                                    label="Status"
                                    bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-4 text-xs font-semibold h-[42px]"
                                    dropdownBgClass="bg-[#0c0c0e]"
                                    options={[
                                        { value: "true", label: "Active" },
                                        { value: "false", label: "Inactive" }
                                    ]}
                                    value={techFormValues.isActive ? "true" : "false"}
                                    onChange={(val) => setTechFormValues({ ...techFormValues, isActive: val === "true" })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsTechModalOpen(false)}
                                    className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                                >
                                    Save Technology
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Portal>
            )}

            {/* TOAST SYSTEM FEEDBACK */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
