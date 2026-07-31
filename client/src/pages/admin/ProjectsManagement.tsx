import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import Toast from "../../compoenets/Toast";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";
import TeammanagemntServices, { type TeamMember } from "../../services/admin/TeammanagemntServices";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import CloudinaryServices from "../../services/cloudinaryService";
import AdminSidebar from "../../compoenets/AdminSidebar";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";

// Searchable Collaborators Selector Component
interface CollaboratorSelectProps {
    label: string;
    allMembers: TeamMember[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    placeholder: string;
}

function CollaboratorSelect({
    label,
    allMembers,
    selectedIds,
    onChange,
    placeholder
}: CollaboratorSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredMembers = allMembers.filter(m =>
        m.fullname.toLowerCase().includes(search.toLowerCase())
    );

    const toggleOption = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(x => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 relative text-left">
            <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white cursor-pointer flex justify-between items-center select-none min-h-[38px]"
            >
                <span className="text-white/40">{placeholder}</span>
                <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#0c0c0e] border border-white/10 rounded-lg shadow-2xl z-50 max-h-[180px] overflow-y-auto p-2.5 space-y-2">
                        {/* Search Input */}
                        <div className="px-1 py-0.5">
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-primary/50"
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-1">
                            {filteredMembers.length === 0 ? (
                                <div className="text-[10px] text-white/20 italic px-2 py-1">No members match search</div>
                            ) : (
                                filteredMembers.map(m => {
                                    const isChecked = selectedIds.includes(m._id);
                                    return (
                                        <div
                                            key={m._id}
                                            onClick={() => toggleOption(m._id)}
                                            className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-white/5 rounded-md cursor-pointer transition-colors text-xs"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                                className="accent-gold-primary h-3.5 w-3.5 rounded bg-black/40 border-white/10"
                                            />
                                            <span className={isChecked ? "text-gold-primary font-bold" : "text-white/80"}>
                                                {m.fullname}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ProjectsManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Toast Alert State ---
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);

    // --- Projects State ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    // --- Team Members List State ---
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    // --- Durations List State ---
    const [durationsList, setDurationsList] = useState<IMasterDataOption[]>([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingProjectId, setEditingProjectId] = useState("");

    // Image Cropper State (16:9 Widescreen Aspect Ratio)
    const [isCropping, setIsCropping] = useState(false);
    const [cropSrc, setCropSrc] = useState("");
    const [zoom, setZoom] = useState(1.2);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

    // Drag-and-drop Reordering State
    const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
    const [dragOverProjectIndex, setDragOverProjectIndex] = useState<number | null>(null);

    // Cloudinary Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Deletion Modal State
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [formValues, setFormValues] = useState({
        title: "",
        description: "",
        thumbnail: "",
        status: "Planning" as "Planning" | "Ongoing" | "Completed",
        duration: "",
        collaborators: [] as string[],
    });

    const constrainOffsets = (ox: number, oy: number, currentZoom: number, imgWidth: number, imgHeight: number) => {
        if (!imgWidth || !imgHeight) return { x: ox, y: oy };

        const scaleCover = Math.max(280 / imgWidth, 157.5 / imgHeight);
        const wBase = imgWidth * scaleCover;
        const hBase = imgHeight * scaleCover;

        const wZoom = wBase * currentZoom;
        const hZoom = hBase * currentZoom;

        const maxOffsetX = Math.max(0, (wZoom - 280) / 2);
        const maxOffsetY = Math.max(0, (hZoom - 157.5) / 2);

        const constrainedX = Math.min(maxOffsetX, Math.max(-maxOffsetX, ox));
        const constrainedY = Math.min(maxOffsetY, Math.max(-maxOffsetY, oy));

        return { x: constrainedX, y: constrainedY };
    };

    useEffect(() => {
        if (cropSrc) {
            const img = new Image();
            if (cropSrc.startsWith("http")) {
                img.crossOrigin = "anonymous";
            }
            img.src = cropSrc;
            img.onload = () => {
                setImageDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
        } else {
            setImageDimensions(null);
        }
    }, [cropSrc]);

    const handleCropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleCropMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        const nextX = offsetX + dx;
        const nextY = offsetY + dy;

        if (imageDimensions) {
            const constrained = constrainOffsets(nextX, nextY, zoom, imageDimensions.width, imageDimensions.height);
            setOffsetX(constrained.x);
            setOffsetY(constrained.y);
        } else {
            setOffsetX(nextX);
            setOffsetY(nextY);
        }
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleCropMouseUp = () => {
        setIsDragging(false);
    };

    const handleCropTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleCropTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        if (e.cancelable) {
            e.preventDefault();
        }
        const touch = e.touches[0];
        const dx = touch.clientX - dragStart.x;
        const dy = touch.clientY - dragStart.y;
        const nextX = offsetX + dx;
        const nextY = offsetY + dy;

        if (imageDimensions) {
            const constrained = constrainOffsets(nextX, nextY, zoom, imageDimensions.width, imageDimensions.height);
            setOffsetX(constrained.x);
            setOffsetY(constrained.y);
        } else {
            setOffsetX(nextX);
            setOffsetY(nextY);
        }
        setDragStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
        if (imageDimensions) {
            const constrained = constrainOffsets(offsetX, offsetY, newZoom, imageDimensions.width, imageDimensions.height);
            setOffsetX(constrained.x);
            setOffsetY(constrained.y);
        }
    };

    // Drag and Drop reordering handlers
    const handleDragStart = (index: number, e: React.DragEvent) => {
        if (searchQuery || selectedStatus) return; // Disable when filtering
        setDraggedProjectIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (index: number, e: React.DragEvent) => {
        e.preventDefault();
        if (searchQuery || selectedStatus) return;
        e.dataTransfer.dropEffect = "move";
        if (dragOverProjectIndex !== index) {
            setDragOverProjectIndex(index);
        }
    };

    const handleDrop = async (targetIndex: number, e: React.DragEvent) => {
        e.preventDefault();
        setDragOverProjectIndex(null);

        if (draggedProjectIndex === null || searchQuery || selectedStatus) {
            setDraggedProjectIndex(null);
            return;
        }

        const sourceIndex = draggedProjectIndex;
        setDraggedProjectIndex(null);

        if (sourceIndex === targetIndex) return;

        const updatedProjects = [...projects];
        const [movedItem] = updatedProjects.splice(sourceIndex, 1);
        updatedProjects.splice(targetIndex, 0, movedItem);

        const orderedIds = updatedProjects.map(p => p._id);

        // Optimistically update the local projects order
        setProjects(updatedProjects);

        try {
            await ProjectServices.reorderProjects(orderedIds);
        } catch (err) {
            fetchProjects();
        }
    };

    const fetchTeamMembers = async () => {
        try {
            const res = await TeammanagemntServices.getTeamMembers();
            if (res.success && res.members) {
                setTeamMembers(res.members);
            }
        } catch (err) {
            setToast({ message: "Failed to fetch team members list.", type: "error" });
        }
    };

    const fetchDurations = async () => {
        try {
            const res = await MasterDataServices.getMasterData();
            if (res.success && res.data) {
                const durations = res.data.filter(opt => opt.category === "duration");
                setDurationsList(durations);
            }
        } catch (err) {
            setToast({ message: "Failed to fetch project durations from master data.", type: "error" });
        }
    };

    const fetchProjects = async () => {
        if (projects.length === 0) {
            setLoadingProjects(true);
        }
        try {
            const res = await ProjectServices.getProjects();
            if (res.success && res.projects) {
                setProjects(res.projects);
            }
        } catch (err) {
            setToast({ message: "Failed to fetch projects list.", type: "error" });
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        document.title = "HiveMind Admin | Projects Management";
        authService
            .getAdminStatus()
            .then(async (data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    await Promise.all([fetchProjects(), fetchTeamMembers(), fetchDurations()]);
                    setLoading(false);
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setToast({ message: "Image file too large (Max 5MB).", type: "error" });
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setCropSrc(reader.result as string);
                    setZoom(1.2);
                    setOffsetX(0);
                    setOffsetY(0);
                    setIsCropping(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setCropSrc("");
    };

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await CloudinaryServices.deleteFromCloudinary(url);
        } catch (err) {
        }
    };

    const openAddModal = () => {
        setModalMode("add");
        setEditingProjectId("");
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            title: "",
            description: "",
            thumbnail: "",
            status: "Planning",
            duration: "",
            collaborators: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setModalMode("edit");
        setEditingProjectId(project._id);
        setIsCropping(false);
        setCropSrc("");
        setFormValues({
            title: project.title,
            description: project.description,
            thumbnail: project.thumbnail || "",
            status: project.status || "Planning",
            duration: project.duration || "",
            collaborators: Array.isArray(project.collaborators)
                ? project.collaborators.map((c: any) => typeof c === "string" ? c : c._id)
                : [],
        });
        setIsModalOpen(true);
    };

    const renderCropperWorkspace = () => {
        const handleApplyCrop = () => {
            const img = new Image();
            img.src = cropSrc;
            img.onload = async () => {
                const canvas = document.createElement("canvas");
                // 16:9 Widescreen target resolution
                canvas.width = 1280;
                canvas.height = 720;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.fillStyle = "#0c0c0e";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const wOrig = img.naturalWidth;
                const hOrig = img.naturalHeight;

                const scaleCover = Math.max(canvas.width / wOrig, canvas.height / hOrig);
                const wBase = wOrig * scaleCover;
                const hBase = hOrig * scaleCover;

                const wZoom = wBase * zoom;
                const hZoom = hBase * zoom;

                const x0 = (canvas.width - wZoom) / 2;
                const y0 = (canvas.height - hZoom) / 2;

                const scaleFactor = canvas.width / 280;
                const canvasOffsetX = offsetX * scaleFactor;
                const canvasOffsetY = offsetY * scaleFactor;

                ctx.drawImage(img, x0 + canvasOffsetX, y0 + canvasOffsetY, wZoom, hZoom);

                const base64 = canvas.toDataURL("image/jpeg", 0.78);

                // Close cropper workspace & trigger Cloudinary upload
                setIsCropping(false);
                setCropSrc("");
                setIsDragging(false);
                setIsUploading(true);
                setUploadProgress(0);

                try {
                    const res = await CloudinaryServices.uploadToCloudinary(base64, "Projects", (percent) => {
                        setUploadProgress(percent);
                    });

                    if (res && res.secure_url) {
                        const oldThumbnail = formValues.thumbnail;
                        setFormValues(prev => ({ ...prev, thumbnail: res.secure_url }));
                        if (oldThumbnail) {
                            deleteImageFromCloudinary(oldThumbnail);
                        }
                        setToast({ message: "Thumbnail uploaded successfully.", type: "success" });
                    } else {
                        setToast({ message: "Upload failed: No secure URL returned.", type: "error" });
                    }
                } catch (err: any) {
                    setToast({
                        message: err.response?.data?.error?.message || "Cloudinary upload failed.",
                        type: "error"
                    });
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            };
        };

        const imgWidth = imageDimensions?.width || 280;
        const imgHeight = imageDimensions?.height || 157.5;

        const scaleCover = Math.max(280 / imgWidth, 157.5 / imgHeight);
        const wBase = imgWidth * scaleCover;
        const hBase = imgHeight * scaleCover;

        return (
            <div className="flex flex-col items-center w-full">
                <h3 className="text-base font-black uppercase tracking-wider text-white mb-2 w-full text-left">
                    Crop Project Thumbnail
                </h3>
                <p className="text-[10px] text-[#888888] mb-6 w-full text-left uppercase tracking-wider font-semibold">
                    Drag the image to position it inside the 16:9 widescreen frame.
                </p>

                {/* 16:9 Rectangular Cropping Frame */}
                <div
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    onTouchStart={handleCropTouchStart}
                    onTouchMove={handleCropTouchMove}
                    onTouchEnd={handleCropMouseUp}
                    className="relative bg-black border border-white/10 overflow-hidden flex items-center justify-center shadow-lg cursor-move select-none rounded-xl"
                    style={{
                        width: "280px",
                        height: "157.5px"
                    }}
                >
                    <img
                        src={cropSrc}
                        alt="Crop Preview"
                        className="max-w-none origin-center pointer-events-none select-none"
                        style={{
                            width: `${wBase}px`,
                            height: `${hBase}px`,
                            minWidth: `${wBase}px`,
                            minHeight: `${hBase}px`,
                            maxWidth: "none",
                            maxHeight: "none",
                            transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                            transformOrigin: "center",
                            transition: "none",
                        }}
                    />
                    <div className="absolute inset-0 border border-gold-primary/20 pointer-events-none" />
                </div>

                {/* Sliders */}
                <div className="w-full mt-8">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">
                            <span>Zoom</span>
                            <span className="text-gold-primary">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.05"
                            className="w-full accent-gold-primary h-1 bg-white/10 rounded-lg cursor-pointer"
                            value={zoom}
                            onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 w-full mt-6 border-t border-white/5">
                    <button
                        type="button"
                        onClick={handleCancelCrop}
                        className="bg-transparent border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleApplyCrop}
                        className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-xs font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                    >
                        Save Crop
                    </button>
                </div>
            </div>
        );
    };

    const handleModalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate basic fields
        if (formValues.title.trim().length < 3) {
            setToast({ message: "Project title must be at least 3 characters.", type: "error" });
            return;
        }
        if (formValues.description.trim().length < 10) {
            setToast({ message: "Project description must be at least 10 characters.", type: "error" });
            return;
        }
        if (!formValues.thumbnail) {
            setToast({ message: "A project thumbnail is required.", type: "error" });
            return;
        }
        if (!formValues.status) {
            setToast({ message: "Project status is required.", type: "error" });
            return;
        }
        if (formValues.status === "Completed" && !formValues.duration) {
            setToast({ message: "Project duration is required for completed projects.", type: "error" });
            return;
        }
        if (formValues.collaborators.length === 0) {
            setToast({ message: "At least one collaborator must be selected.", type: "error" });
            return;
        }

        try {
            if (modalMode === "add") {
                const res = await ProjectServices.createProject(formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    setToast({ message: "Project created successfully.", type: "success" });
                    fetchProjects();
                } else {
                    setToast({ message: res.message || "Failed to create project.", type: "error" });
                }
            } else {
                const res = await ProjectServices.updateProject(editingProjectId, formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    setToast({ message: "Project updated successfully.", type: "success" });
                    fetchProjects();
                } else {
                    setToast({ message: res.message || "Failed to update project.", type: "error" });
                }
            }
        } catch (err: any) {
            setToast({
                message: err.response?.data?.message || "An error occurred while saving.",
                type: "error"
            });
        }
    };

    const executeDeleteProject = async (id: string) => {
        try {
            const res = await ProjectServices.deleteProject(id);
            if (res.success) {
                setToast({ message: "Project deleted successfully.", type: "success" });
                fetchProjects();
            } else {
                setToast({ message: res.message || "Failed to delete project.", type: "error" });
            }
        } catch (err: any) {
            setToast({
                message: err.response?.data?.message || "An error occurred while deleting.",
                type: "error"
            });
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = !selectedStatus || p.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-screen w-full bg-[#050505] flex text-white relative admin-workspace overflow-hidden">
            {/* Custom Toast Alert Component */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="projects"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN WORKSPACE */}
            <div className="flex-1 flex flex-col min-w-0 h-full z-10 overflow-y-auto">
                {/* Mobile Top Header */}
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

                <main className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col">
                    {loading ? (
                        <AdminLoader isComponent={true} />
                    ) : (
                        <div className="space-y-8 animate-fade-in-up">
                            <section className="bg-gradient-to-br from-white/[0.02] to-gold-primary/[0.005] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">
                                            Projects Management
                                        </h2>
                                        <p className="text-xs text-[#888888] mt-1">
                                            Manage and showcase community projects. {!searchQuery && !selectedStatus ? "Drag and drop table rows to reorder projects." : "Clear search and filters to enable drag-and-drop reordering."}
                                        </p>
                                    </div>
                                    <button
                                        onClick={openAddModal}
                                        className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102 hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)] active:scale-100"
                                    >
                                        Add Project
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search projects by title or description..."
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-2">
                                        <CustomSingleSelect
                                            label="Status Filter"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Statuses" },
                                                { value: "Planning", label: "Planning" },
                                                { value: "Ongoing", label: "Ongoing" },
                                                { value: "Completed", label: "Completed" }
                                            ]}
                                            value={selectedStatus}
                                            onChange={setSelectedStatus}
                                            placeholder="All Statuses"
                                        />
                                    </div>
                                </div>

                                {loadingProjects ? (
                                    <AdminLoader isComponent={true} label="Loading projects..." />
                                ) : filteredProjects.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No projects found</span>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-[#888888] uppercase font-bold tracking-wider">
                                                    <th className="pb-3 pl-4">Project</th>
                                                    <th className="pb-3">Status</th>
                                                    <th className="pb-3">Duration</th>
                                                    <th className="pb-3">Collaborators</th>
                                                    <th className="pb-3 pr-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-[#DDDDDD]">
                                                {filteredProjects.map((project, idx) => {
                                                    const isDragging = draggedProjectIndex === idx;
                                                    const isDragOver = dragOverProjectIndex === idx;

                                                    return (
                                                        <tr
                                                            key={project._id}
                                                            draggable={!searchQuery && !selectedStatus}
                                                            onDragStart={(e) => handleDragStart(idx, e)}
                                                            onDragOver={(e) => handleDragOver(idx, e)}
                                                            onDrop={(e) => handleDrop(idx, e)}
                                                            onDragEnd={() => {
                                                                setDraggedProjectIndex(null);
                                                                setDragOverProjectIndex(null);
                                                            }}
                                                            className={`transition-all border-b border-white/5 ${!searchQuery && !selectedStatus
                                                                    ? "cursor-grab active:cursor-grabbing"
                                                                    : ""
                                                                } ${isDragging
                                                                    ? "opacity-30 scale-[0.98] border-dashed border-gold-primary/60 bg-gold-primary/5"
                                                                    : isDragOver
                                                                        ? "bg-gold-primary/10 border-t-2 border-t-gold-primary"
                                                                        : "hover:bg-white/[0.01]"
                                                                }`}
                                                        >
                                                            <td className="py-3.5 pl-4 flex items-center gap-3.5 max-w-sm">
                                                                {!searchQuery && !selectedStatus && (
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
                                                                        className="text-white/30 hover:text-gold-primary flex-shrink-0 cursor-grab"
                                                                    >
                                                                        <title>Drag row to reorder</title>
                                                                        <circle cx="9" cy="5" r="1.5" />
                                                                        <circle cx="9" cy="12" r="1.5" />
                                                                        <circle cx="9" cy="19" r="1.5" />
                                                                        <circle cx="15" cy="5" r="1.5" />
                                                                        <circle cx="15" cy="12" r="1.5" />
                                                                        <circle cx="15" cy="19" r="1.5" />
                                                                    </svg>
                                                                )}
                                                                {project.thumbnail ? (
                                                                    <img src={project.thumbnail} alt="thumbnail" className="w-16 h-10 object-cover border border-white/5 rounded-lg flex-shrink-0" />
                                                                ) : (
                                                                    <div className="w-16 h-10 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-[10px] text-white/40 uppercase font-black tracking-wider flex-shrink-0">
                                                                        HM
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-white text-[13px]">{project.title}</span>
                                                                    <p className="text-[11px] text-[#666666] line-clamp-2 mt-1 leading-normal font-sans">{project.description}</p>
                                                                </div>
                                                            </td>
                                                            <td className="py-3.5">
                                                                <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === "Completed" ? "bg-green-500/10 border border-green-500/20 text-green-400" :
                                                                        project.status === "Ongoing" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                                                            "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                                                    }`}>
                                                                    {project.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-3.5">
                                                                <span className="text-[10px] text-white font-semibold">
                                                                    {project.status === "Completed" && project.duration ? project.duration : "-"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3.5">
                                                                <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                                                    {Array.isArray(project.collaborators) && project.collaborators.length > 0 ? (
                                                                        project.collaborators.map((collab: any) => {
                                                                            if (!collab) return null;
                                                                            return (
                                                                                <div key={collab._id} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5" title={collab.fullname}>
                                                                                    {collab.pic ? (
                                                                                        <img src={collab.pic} alt="" className="w-3.5 h-3.5 rounded-full object-cover" />
                                                                                    ) : (
                                                                                        <div className="w-3.5 h-3.5 rounded-full bg-gold-primary/20 flex items-center justify-center text-[7px] font-black text-gold-primary">
                                                                                            {collab.fullname?.substring(0, 2).toUpperCase() || "?"}
                                                                                        </div>
                                                                                    )}
                                                                                    <span className="text-[9px] font-medium text-[#AAAAAA]">{collab.fullname}</span>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <span className="text-[9px] text-[#666666] italic">No collaborators</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3.5 pr-4 text-right">
                                                                <button
                                                                    onClick={() => openEditModal(project)}
                                                                    className="bg-white/5 hover:bg-white/10 text-white text-[9px] font-extrabold uppercase py-1 px-3.5 rounded-full mr-2 cursor-pointer transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => setProjectToDelete(project._id)}
                                                                    className="bg-transparent border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-400 text-[9px] font-bold uppercase py-1 px-3.5 rounded-full cursor-pointer transition-colors"
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
                                )}
                            </section>
                        </div>
                    )}
                </main>
            </div>

            {/* Modals: Crop Upload / Form Modal */}
            {isModalOpen && (
                <div className={`fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 ${isCropping ? "overflow-hidden" : "overflow-y-auto overscroll-contain"}`}>
                    <div className={`bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative animate-fade-in ${(isUploading || isCropping) ? "max-w-xl my-0" : "max-w-4xl my-8"
                        }`}>
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-fade-in">
                                <div className="mb-6">
                                    <div className="loader"></div>
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                    Uploading Thumbnail
                                </h4>
                                <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                    <div
                                        className="bg-gradient-to-r from-gold-primary to-gold-light h-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <span className="text-[11px] font-bold text-gold-primary uppercase tracking-wider">
                                    {uploadProgress}% Complete
                                </span>
                            </div>
                        ) : isCropping && cropSrc ? (
                            renderCropperWorkspace()
                        ) : (
                            <>
                                <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6">
                                    {modalMode === "add" ? "Add Project" : "Edit Project"}
                                </h3>

                                <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left Column - Media & Description */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center justify-center gap-3 w-full mb-4">
                                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block text-center">Project Thumbnail Cover (16:9)</label>

                                                <div
                                                    className="relative w-48 h-28 p-[1.5px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 rounded-xl"
                                                >
                                                    <div
                                                        className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center rounded-[10px]"
                                                    >
                                                        {formValues.thumbnail ? (
                                                            <img src={formValues.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                                <polyline points="21 15 16 10 5 21" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 justify-center w-full">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="thumbnail-upload"
                                                        onChange={handleFileChange}
                                                    />
                                                    <label
                                                        htmlFor="thumbnail-upload"
                                                        className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                                    >
                                                        Upload Thumbnail
                                                    </label>
                                                    {formValues.thumbnail && (
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                const urlToDelete = formValues.thumbnail;
                                                                setFormValues({ ...formValues, thumbnail: "" });
                                                                await deleteImageFromCloudinary(urlToDelete);
                                                            }}
                                                            className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                        >
                                                            Remove Thumbnail
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Project Description *</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    placeholder="Write a clear showcase description of the project..."
                                                    className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary resize-none leading-relaxed"
                                                    value={formValues.description}
                                                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column - Info Fields */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Project Title *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                    value={formValues.title}
                                                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <CustomSingleSelect
                                                    label="Project Status"
                                                    required
                                                    bgClass="bg-white/[0.02] border border-white/10 py-2.5 px-3 text-xs h-[38px] rounded-lg"
                                                    dropdownBgClass="bg-[#0c0c0e]"
                                                    options={[
                                                        { value: "Planning", label: "Planning" },
                                                        { value: "Ongoing", label: "Ongoing" },
                                                        { value: "Completed", label: "Completed" }
                                                    ]}
                                                    value={formValues.status}
                                                    onChange={(val) => setFormValues(prev => ({
                                                        ...prev,
                                                        status: val as any,
                                                        duration: val !== "Completed" ? "" : prev.duration
                                                    }))}
                                                    placeholder="Select Status"
                                                />
                                            </div>

                                            {formValues.status === "Completed" && (
                                                <div className="flex flex-col gap-1.5">
                                                    <CustomSingleSelect
                                                        label="Project Duration in Months"
                                                        required
                                                        bgClass="bg-white/[0.02] border border-white/10 py-2.5 px-3 text-xs h-[38px] rounded-lg"
                                                        dropdownBgClass="bg-[#0c0c0e]"
                                                        options={durationsList.map(opt => ({ value: opt.value, label: opt.value }))}
                                                        value={formValues.duration}
                                                        onChange={(val) => setFormValues(prev => ({ ...prev, duration: val }))}
                                                        placeholder="Select Duration"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-1.5">
                                                <CollaboratorSelect
                                                    label="Collaborators *"
                                                    allMembers={teamMembers}
                                                    selectedIds={formValues.collaborators}
                                                    onChange={(ids) => setFormValues({ ...formValues, collaborators: ids })}
                                                    placeholder="Search and select collaborators..."
                                                />

                                                {/* Selected Collaborator Chips */}
                                                <div className="flex flex-wrap gap-2 mt-2 max-h-[120px] overflow-y-auto p-1 bg-white/[0.01] border border-white/5 rounded-xl empty:hidden">
                                                    {teamMembers
                                                        .filter(m => formValues.collaborators.includes(m._id))
                                                        .map(m => (
                                                            <div key={m._id} className="flex items-center gap-2 bg-gold-primary/10 border border-gold-primary/20 text-gold-primary pl-1.5 pr-2 py-0.5 rounded-full text-[10px] font-bold">
                                                                {m.pic ? (
                                                                    <img src={m.pic} alt={m.fullname} className="w-4 h-4 rounded-full object-cover" />
                                                                ) : (
                                                                    <div className="w-4 h-4 rounded-full bg-gold-primary/20 flex items-center justify-center text-[8px] font-black">
                                                                        {m.fullname.substring(0, 2).toUpperCase()}
                                                                    </div>
                                                                )}
                                                                <span>{m.fullname}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormValues({
                                                                            ...formValues,
                                                                            collaborators: formValues.collaborators.filter(id => id !== m._id)
                                                                        });
                                                                    }}
                                                                    className="text-gold-primary/60 hover:text-gold-primary ml-1 focus:outline-none bg-transparent border-none cursor-pointer text-xs leading-none"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="bg-transparent border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black text-xs font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)]"
                                        >
                                            {modalMode === "add" ? "Save Project" : "Update Project"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {projectToDelete && (
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
                            Are you sure you want to delete this project? This action is permanent and cannot be undone.
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setProjectToDelete(null)}
                                className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const id = projectToDelete;
                                    setProjectToDelete(null);
                                    await executeDeleteProject(id);
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
