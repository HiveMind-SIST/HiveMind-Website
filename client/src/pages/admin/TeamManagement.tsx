import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService, { type AdminUser } from "../../services/admin/authService";
import AdminLoader from "../../compoenets/AdminLoader";
import TeammanagemntServices, { type TeamMember } from "../../services/admin/TeammanagemntServices";
import CloudinaryServices from "../../services/cloudinaryService";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import AdminSidebar from "../../compoenets/AdminSidebar";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";
import Portal from "../../compoenets/Portal";

export default function TeamManagement() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Team Management State ---
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedGeneration, setSelectedGeneration] = useState("");
    const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});

    // Drag and Drop reordering state
    const [draggedMemberIndex, setDraggedMemberIndex] = useState<number | null>(null);
    const [dragOverMemberIndex, setDragOverMemberIndex] = useState<number | null>(null);

    const isFilteringActive = Boolean(searchQuery || selectedDept || selectedYear || selectedGeneration);

    const handleDragStart = (index: number, e: React.DragEvent) => {
        if (isFilteringActive) return; // Disable when filtering
        setDraggedMemberIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragOver = (index: number, e: React.DragEvent) => {
        e.preventDefault();
        if (isFilteringActive) return;
        e.dataTransfer.dropEffect = "move";
        if (dragOverMemberIndex !== index) {
            setDragOverMemberIndex(index);
        }
    };

    const handleDrop = async (targetIndex: number, e: React.DragEvent) => {
        e.preventDefault();
        setDragOverMemberIndex(null);

        if (draggedMemberIndex === null || isFilteringActive) {
            setDraggedMemberIndex(null);
            return;
        }

        const sourceIndex = draggedMemberIndex;
        setDraggedMemberIndex(null);

        if (sourceIndex === targetIndex) return;

        const updatedMembers = [...teamMembers];
        const [movedItem] = updatedMembers.splice(sourceIndex, 1);
        updatedMembers.splice(targetIndex, 0, movedItem);

        const orderedIds = updatedMembers.map(m => m._id);

        // Optimistically update the local teamMembers order
        setTeamMembers(updatedMembers);

        try {
            await TeammanagemntServices.reorderTeamMembers(orderedIds);
        } catch (err) {
            fetchTeamMembers();
        }
    };

    const toggleMemberExpand = (id: string) => {
        setExpandedMembers(prev => {
            const isCurrentlyExpanded = !!prev[id];
            return {
                [id]: !isCurrentlyExpanded
            };
        });
    };

    // --- Master Data Options state ---
    const [masterOptions, setMasterOptions] = useState<IMasterDataOption[]>([]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [editingMemberId, setEditingMemberId] = useState("");
    const [modalError, setModalError] = useState("");

    // Image Cropper State
    const [isCropping, setIsCropping] = useState(false);
    const [cropSrc, setCropSrc] = useState("");
    const [originalSrc, setOriginalSrc] = useState("");
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [zoom, setZoom] = useState(1.2);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Cloudinary Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Deletion Modal State
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await CloudinaryServices.deleteFromCloudinary(url);
        } catch (err) {
        }
    };

    const [formValues, setFormValues] = useState({
        fullname: "",
        registerNumber: "",
        email: "",
        pic: "",
        department: "",
        section: "",
        year: "1st" as "1st" | "2nd" | "3rd" | "4th" | "Faculty" | "N/A",
        Linkedin: "",
        github: "",
        batch: "",
        role: "Member" as "Faculty Mentor" | "Member",
    });

    const constrainOffsets = (ox: number, oy: number, currentZoom: number, imgWidth: number, imgHeight: number) => {
        if (!imgWidth || !imgHeight) return { x: ox, y: oy };

        const scaleCover = Math.max(320 / imgWidth, 368 / imgHeight);
        const wBase = imgWidth * scaleCover;
        const hBase = imgHeight * scaleCover;

        const wZoom = wBase * currentZoom;
        const hZoom = hBase * currentZoom;

        const maxOffsetX = Math.max(0, (wZoom - 320) / 2);
        const maxOffsetY = Math.max(0, (hZoom - 368) / 2);

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

    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
        if (imageDimensions) {
            const constrained = constrainOffsets(offsetX, offsetY, newZoom, imageDimensions.width, imageDimensions.height);
            setOffsetX(constrained.x);
            setOffsetY(constrained.y);
        }
    };

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

    const fetchMasterData = async () => {
        try {
            const res = await MasterDataServices.getMasterData();
            if (res.success && res.data) {
                setMasterOptions(res.data);
            }
        } catch (err) {
        }
    };

    const fetchTeamMembers = async () => {
        if (teamMembers.length === 0) {
            setLoadingTeam(true);
        }
        try {
            const res = await TeammanagemntServices.getTeamMembers();
            if (res.success && res.members) {
                setTeamMembers(res.members);
            }
        } catch (err) {
        } finally {
            setLoadingTeam(false);
        }
    };

    useEffect(() => {
        document.title = "HiveMind Admin | Team Management";
        authService
            .getAdminStatus()
            .then(async (data) => {
                if (data.success && data.admin) {
                    setAdmin(data.admin);
                    await Promise.all([fetchTeamMembers(), fetchMasterData()]);
                    setLoading(false);
                } else {
                    navigate("/admin/login");
                }
            })
            .catch(() => {
                navigate("/admin/login");
            });
    }, [navigate]);

    useEffect(() => {
        if (isModalOpen || memberToDelete || isSaving) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen, memberToDelete, isSaving]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setModalError("Image file is too large. Please select a file smaller than 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setCropSrc(reader.result as string);
                    setOriginalSrc(reader.result as string);
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

    const openAddModal = () => {
        setModalMode("add");
        setEditingMemberId("");
        setModalError("");
        setIsCropping(false);
        setCropSrc("");
        setOriginalSrc("");
        setFormValues({
            fullname: "",
            registerNumber: "",
            email: "",
            pic: "",
            department: "",
            section: "",
            year: "1st",
            Linkedin: "",
            github: "",
            batch: "",
            role: "Member",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        setModalMode("edit");
        setEditingMemberId(member._id);
        setModalError("");
        setIsCropping(false);
        setCropSrc("");
        setOriginalSrc("");
        setFormValues({
            fullname: member.fullname,
            registerNumber: member.registerNumber || "",
            email: member.email,
            pic: member.pic || "",
            department: member.department,
            section: member.section || "",
            year: member.year,
            Linkedin: member.Linkedin || "",
            github: member.github || "",
            batch: member.batch,
            role: member.role || "Member",
        });
        setIsModalOpen(true);
    };

    const renderCropperWorkspace = () => {
        const handleApplyCrop = () => {
            const img = new Image();
            if (cropSrc.startsWith("http")) {
                img.crossOrigin = "anonymous";
            }
            img.src = cropSrc;
            img.onload = async () => {
                try {
                    const scaleFactor = 3; // 3x scaling for high-DPI/Retina screens
                    const canvas = document.createElement("canvas");
                    canvas.width = 320 * scaleFactor;
                    canvas.height = 368 * scaleFactor;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) throw new Error("Could not get 2D context");

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

                    const res = await CloudinaryServices.uploadToCloudinary(base64, "Team images", (percent) => {
                        setUploadProgress(percent);
                    });

                    if (res && res.secure_url) {
                        const oldPic = formValues.pic;
                        setFormValues(prev => ({ ...prev, pic: res.secure_url }));
                        if (oldPic) {
                            deleteImageFromCloudinary(oldPic);
                        }
                    } else {
                        setModalError("Upload failed: No secure URL returned from Cloudinary.");
                    }
                } catch (err: any) {
                    setModalError(
                        err.response?.data?.error?.message ||
                        err.message ||
                        "Failed to process or upload image."
                    );
                    setIsCropping(true);
                    setIsUploading(false);
                } finally {
                    setIsUploading(false);
                    setUploadProgress(0);
                }
            };
        };

        const imgWidth = imageDimensions?.width || 320;
        const imgHeight = imageDimensions?.height || 368;

        const scaleCover = Math.max(320 / imgWidth, 368 / imgHeight);
        const wBase = imgWidth * scaleCover;
        const hBase = imgHeight * scaleCover;

        return (
            <div className="flex flex-col items-center">
                <h3 className="text-base font-black uppercase tracking-wider text-white mb-2 w-full text-left">
                    Crop Profile Photo
                </h3>
                <p className="text-[10px] text-[#888888] mb-6 w-full text-left uppercase tracking-wider font-semibold">
                    Drag the image to position it. Use the slider below to zoom.
                </p>

                {modalError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 w-full text-left">
                        {modalError}
                    </div>
                )}

                {/* Hexagonal Cropping Frame with Drag Controls */}
                <div
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={handleCropMouseUp}
                    onTouchStart={handleCropTouchStart}
                    onTouchMove={handleCropTouchMove}
                    onTouchEnd={handleCropMouseUp}
                    className="relative bg-black border border-white/10 overflow-hidden flex items-center justify-center shadow-lg cursor-move select-none"
                    style={{
                        width: "320px",
                        height: "368px",
                    }}
                >
                    <img
                        src={cropSrc}
                        alt="Crop Preview"
                        className="pointer-events-none select-none"
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
                    
                    {/* SVG Hexagon Mask & Gradient Border Overlay */}
                    <svg
                        className="absolute inset-0 pointer-events-none select-none z-10"
                        width="320"
                        height="368"
                        viewBox="0 0 320 368"
                    >
                        <defs>
                            <mask id="hexagon-mask">
                                <rect width="320" height="368" fill="white" />
                                <polygon
                                    points="160,0 320,92 320,276 160,368 0,276 0,92"
                                    fill="black"
                                />
                            </mask>
                            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
                                <stop offset="100%" stopColor="rgba(212, 175, 55, 0.9)" />
                            </linearGradient>
                        </defs>
                        <rect
                            width="320"
                            height="368"
                            fill="rgba(17, 24, 39, 0.6)"
                            mask="url(#hexagon-mask)"
                        />
                        <polygon
                            points="160,0 320,92 320,276 160,368 0,276 0,92"
                            fill="none"
                            stroke="url(#gold-gradient)"
                            strokeWidth="3"
                        />
                    </svg>
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
        setModalError("");

        if (formValues.fullname.trim().length < 3) {
            setModalError("Full name must be at least 3 characters.");
            return;
        }

        if (!formValues.email.trim()) {
            setModalError("Email address is required.");
            return;
        }

        if (formValues.role === "Member") {
            if (!formValues.registerNumber.trim()) {
                setModalError("Register number is required for student team members.");
                return;
            }

            // Enforce constraint: LinkedIn or GitHub profile link must be filled out for student members
            if (!formValues.Linkedin.trim() && !formValues.github.trim()) {
                setModalError("At least one social profile link (LinkedIn or GitHub) must be provided for student team members.");
                return;
            }
        }

        setIsSaving(true);
        try {
            if (modalMode === "add") {
                const res = await TeammanagemntServices.createTeamMember(formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchTeamMembers();
                } else {
                    setModalError(res.message || "Failed to create team member.");
                }
            } else {
                const res = await TeammanagemntServices.updateTeamMember(editingMemberId, formValues);
                if (res.success) {
                    setIsModalOpen(false);
                    fetchTeamMembers();
                } else {
                    setModalError(res.message || "Failed to update team member.");
                }
            }
        } catch (err: any) {
            setModalError(err.response?.data?.message || "An error occurred while saving the member.");
        } finally {
            setIsSaving(false);
        }
    };

    const executeDeleteMember = async (id: string) => {
        setIsSaving(true);
        try {
            const res = await TeammanagemntServices.deleteTeamMember(id);
            if (res.success) {
                fetchTeamMembers();
            } else {
                alert(res.message || "Failed to delete team member.");
            }
        } catch (err) {
            alert("An error occurred while deleting.");
        } finally {
            setIsSaving(false);
        }
    };



    const departments = masterOptions.filter(o => o.category === "department").map(o => o.value);
    const generations = masterOptions.filter(o => o.category === "batch").map(o => o.value);

    const filteredMembers = teamMembers.filter(m => {
        const matchesSearch =
            m.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = !selectedDept || m.department === selectedDept;
        const matchesYear = !selectedYear || m.year === selectedYear;
        const matchesGeneration = !selectedGeneration || m.batch === selectedGeneration;

        return matchesSearch && matchesDept && matchesYear && matchesGeneration;
    });

    return (
        <div className="h-screen w-full bg-[#050505] flex text-white relative admin-workspace overflow-hidden">
            {isSaving && (
                <Portal>
                    <AdminLoader />
                </Portal>
            )}
            {/* Ambient Background Glows */}
            <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />
            <div className="absolute bottom-[5%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_70%)] pointer-events-none z-0" />

            {/* SHARED SIDEBAR COMPONENT */}
            <AdminSidebar
                activeTab="team"
                isMobileSidebarOpen={isMobileSidebarOpen}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                admin={admin}
            />

            {/* MAIN WORKSPACE */}
            <div className={`flex-1 flex flex-col min-w-0 h-full z-10 overflow-y-auto ${isModalOpen || memberToDelete || isSaving ? "pointer-events-none select-none" : ""}`}>
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
                                            Team Management
                                        </h2>
                                        <p className="text-xs text-[#888888] mt-1">
                                            Manage SCAS AI Supercomputing Lab researchers, leads, and mentors.
                                        </p>
                                    </div>
                                    <button
                                        onClick={openAddModal}
                                        className="bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-2.5 px-5 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer shadow-[0_4px_15px_rgba(255,193,7,0.2)] transition-all duration-300 hover:scale-102 hover:shadow-[0_6px_20px_rgba(255,193,7,0.3)] active:scale-100"
                                    >
                                        Add Member
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <label className="text-[9px] font-bold text-[#888888] uppercase tracking-wider">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            className="bg-white/[0.02] border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Department"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Departments" },
                                                ...departments.map(dept => ({ value: dept, label: dept }))
                                            ]}
                                            value={selectedDept}
                                            onChange={setSelectedDept}
                                            placeholder="All Departments"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Year"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Years" },
                                                { value: "1st", label: "1st Year" },
                                                { value: "2nd", label: "2nd Year" },
                                                { value: "3rd", label: "3rd Year" },
                                                { value: "4th", label: "4th Year" }
                                            ]}
                                            value={selectedYear}
                                            onChange={setSelectedYear}
                                            placeholder="All Years"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 col-span-1">
                                        <CustomSingleSelect
                                            label="Generation"
                                            bgClass="bg-[#0c0c0e] border border-white/10 py-2 px-3 text-xs h-[38px]"
                                            dropdownBgClass="bg-[#0c0c0e]"
                                            options={[
                                                { value: "", label: "All Generations" },
                                                ...generations.map(gen => ({ value: gen, label: gen }))
                                            ]}
                                            value={selectedGeneration}
                                            onChange={setSelectedGeneration}
                                            placeholder="All Generations"
                                        />
                                    </div>
                                </div>

                                {!isFilteringActive && (
                                    <p className="text-[10px] text-[#777777] mb-3 uppercase tracking-wider font-semibold">
                                        Drag cards to reorder team members. Changes are saved automatically.
                                    </p>
                                )}

                                {loadingTeam ? (
                                    <AdminLoader isComponent={true} label="Loading members..." />
                                ) : filteredMembers.length === 0 ? (
                                    <div className="py-20 text-center">
                                        <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No team members found</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {filteredMembers.map((member, idx) => {
                                            const isExpanded = !!expandedMembers[member._id];
                                            const isDragging = draggedMemberIndex === idx;
                                            const isDragOver = dragOverMemberIndex === idx;

                                            return (
                                                <div
                                                    key={member._id}
                                                    draggable={!isFilteringActive}
                                                    onDragStart={(e) => handleDragStart(idx, e)}
                                                    onDragOver={(e) => handleDragOver(idx, e)}
                                                    onDrop={(e) => handleDrop(idx, e)}
                                                    onDragEnd={() => {
                                                        setDraggedMemberIndex(null);
                                                        setDragOverMemberIndex(null);
                                                    }}
                                                    className={`transition-all duration-300 rounded-2xl p-4 sm:p-5 border ${
                                                        !isFilteringActive ? "cursor-grab active:cursor-grabbing" : ""
                                                    } ${
                                                        isDragging
                                                            ? "opacity-30 scale-[0.98] border-dashed border-gold-primary/60 bg-gold-primary/5"
                                                            : isDragOver
                                                                ? "bg-gold-primary/10 border-2 border-gold-primary shadow-[0_0_15px_rgba(255,193,7,0.2)]"
                                                                : isExpanded
                                                                    ? "border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-white/[0.02]"
                                                                    : "border-white/5 bg-white/[0.01] hover:bg-white/[0.015] hover:border-white/10"
                                                    }`}
                                                >
                                                    {/* Card Header (clickable to expand/collapse) */}
                                                    <div
                                                        onClick={() => toggleMemberExpand(member._id)}
                                                        className="flex items-center justify-between cursor-pointer select-none gap-4"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {!isFilteringActive && (
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
                                                                    <title>Drag to reorder team member</title>
                                                                    <circle cx="9" cy="5" r="1.5" />
                                                                    <circle cx="9" cy="12" r="1.5" />
                                                                    <circle cx="9" cy="19" r="1.5" />
                                                                    <circle cx="15" cy="5" r="1.5" />
                                                                    <circle cx="15" cy="12" r="1.5" />
                                                                    <circle cx="15" cy="19" r="1.5" />
                                                                </svg>
                                                            )}
                                                            {/* Hexagonal Profile Picture with Status Dot */}
                                                            <div className="relative flex-shrink-0">
                                                                <div
                                                                    className="relative w-11 h-12 p-[1px] bg-gradient-to-br from-gold-primary/20 to-gold-primary/60 flex-shrink-0"
                                                                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                                >
                                                                    <div
                                                                        className="relative w-full h-full bg-[#0c0c0e] overflow-hidden flex items-center justify-center"
                                                                        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                                    >
                                                                        {member.pic ? (
                                                                            <img src={member.pic} alt="Profile" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-[10px] text-white/40 uppercase font-black tracking-wider">
                                                                                {member.fullname.substring(0, 2)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {/* Status Dot */}
                                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4caf50] border-2 border-[#050505] rounded-full" />
                                                            </div>

                                                            {/* Name and Badges */}
                                                            <div className="flex flex-col gap-1 min-w-0">
                                                                <span className="text-sm sm:text-base font-bold text-white tracking-wide truncate">
                                                                    {member.fullname}
                                                                </span>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {member.role === "Faculty Mentor" ? (
                                                                        <span className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(255,193,7,0.15)]">
                                                                            Faculty Mentor
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            {/* Department Badge */}
                                                                            <span className="bg-[#007bff]/20 text-[#3897ff] border border-[#007bff]/30 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                                                                {member.department}
                                                                            </span>
                                                                            <span className="text-[#888888] text-[11px] font-medium tracking-wide">
                                                                                {member.batch}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expand/Collapse Chevron */}
                                                        <div className="text-white/60 hover:text-white transition-colors flex-shrink-0">
                                                            {isExpanded ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="18 15 12 9 6 15" />
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="6 9 12 15 18 9" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Body Panel */}
                                                    <AnimatePresence initial={false}>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                                    <div className="flex flex-col gap-1.5">
                                                                        <span className="text-[11px] text-[#666666] font-semibold tracking-wide uppercase">
                                                                            {member.role === "Faculty Mentor" ? (
                                                                                <>Faculty Mentor • {member.email}</>
                                                                            ) : (
                                                                                <>{member.year} Year • Sec {member.section} • Reg: {member.registerNumber || "N/A"} • {member.email}</>
                                                                            )}
                                                                        </span>
                                                                        {member.role !== "Faculty Mentor" && (
                                                                            <div className="flex items-center gap-2">
                                                                                {(!member.Linkedin && !member.github) ? (
                                                                                    <span className="text-[11px] text-[#777777] italic tracking-wide">
                                                                                        No social links linked.
                                                                                    </span>
                                                                                ) : (
                                                                                    <>
                                                                                        {member.Linkedin && (
                                                                                            <a
                                                                                                href={member.Linkedin}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="text-xs text-[#888888] hover:text-[#0A66C2] transition-colors font-semibold inline-flex items-center gap-1.5 group"
                                                                                            >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0A66C2] group-hover:scale-110 transition-transform">
                                                                                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                                                                                    <rect x="2" y="9" width="4" height="12" />
                                                                                                    <circle cx="4" cy="4" r="2" />
                                                                                                </svg>
                                                                                                <span>LinkedIn</span>
                                                                                            </a>
                                                                                        )}
                                                                                        {member.Linkedin && member.github && (
                                                                                            <span className="text-white/10">•</span>
                                                                                        )}
                                                                                        {member.github && (
                                                                                            <a
                                                                                                href={member.github}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="text-xs text-[#888888] hover:text-white transition-colors font-semibold inline-flex items-center gap-1.5 group"
                                                                                            >
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:scale-110 transition-transform">
                                                                                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                                                                                </svg>
                                                                                                <span>GitHub</span>
                                                                                            </a>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Action buttons */}
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                openEditModal(member);
                                                                            }}
                                                                            className="border border-[#00bcd4]/30 hover:border-[#00bcd4]/60 text-[#00bcd4] bg-[#00bcd4]/5 hover:bg-[#00bcd4]/10 transition-colors px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                            </svg>
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setMemberToDelete(member._id);
                                                                            }}
                                                                            className="border border-red-500/30 hover:border-red-500/60 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-colors px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                                <polyline points="3 6 5 6 21 6" />
                                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                            </svg>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </main>
            </div>

            {/* Modals: Crop Upload / Form Modal */}
            {isModalOpen && (
                <Portal>
                    <div className={`fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4 ${isCropping ? "overflow-hidden" : "overflow-y-auto overscroll-contain"}`}>
                        <div className={`bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative animate-fade-in ${(isUploading || isCropping) ? "max-w-xl my-0" : "max-w-3xl my-8"
                            }`}>
                            {isUploading ? (
                                <div className="flex flex-col items-center justify-center py-12 px-6 text-center select-none animate-fade-in">
                                    <div className="mb-6">
                                        <div className="loader"></div>
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                        Uploading Photo
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
                                        {modalMode === "add" ? "Add Team Member" : "Edit Team Member"}
                                    </h3>

                                    {modalError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4">
                                            {modalError}
                                        </div>
                                    )}
                                    <form onSubmit={handleModalSubmit} className="space-y-5 text-left">
                                         <div className="w-full mb-4">
                                             <CustomSingleSelect
                                                 label="Role / Designation *"
                                                 required
                                                 bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                 dropdownBgClass="bg-[#0c0c0e]"
                                                 options={[
                                                     { value: "Member", label: "Student Team Member" },
                                                     { value: "Faculty Mentor", label: "Faculty Mentor / Staff" },
                                                 ]}
                                                 value={formValues.role}
                                                 onChange={(val) => {
                                                     const isFaculty = val === "Faculty Mentor";
                                                     setFormValues(prev => ({
                                                         ...prev,
                                                         role: val as any,
                                                         registerNumber: isFaculty ? "N/A" : (prev.registerNumber === "N/A" ? "" : prev.registerNumber),
                                                         section: isFaculty ? "N/A" : (prev.section === "N/A" ? "" : prev.section),
                                                         year: isFaculty ? "Faculty" : (prev.year === "Faculty" ? "1st" : prev.year),
                                                         department: isFaculty ? "Faculty" : (prev.department === "Faculty" ? "" : prev.department),
                                                         batch: isFaculty ? "Faculty" : (prev.batch === "Faculty" ? "" : prev.batch),
                                                     }));
                                                 }}
                                                 placeholder="Select Role"
                                             />
                                         </div>

                                         {formValues.role === "Faculty Mentor" ? (
                                             /* Simplified Form for Faculty Mentors: Only Pic, Name, Email */
                                             <div className="space-y-4">
                                                 <div className="flex flex-col items-center justify-center gap-3 w-full mb-2">
                                                     <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block text-center">Profile Picture</label>

                                                     <div
                                                         className="relative w-24 h-28 p-[1.5px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 flex-shrink-0"
                                                         style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                     >
                                                         <div
                                                             className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center"
                                                             style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                         >
                                                             {formValues.pic ? (
                                                                 <img src={formValues.pic} alt="Preview" className="w-full h-full object-cover" />
                                                             ) : (
                                                                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                                     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                                     <circle cx="12" cy="7" r="4" />
                                                                 </svg>
                                                             )}
                                                         </div>
                                                     </div>

                                                     <div className="flex items-center gap-3 justify-center w-full">
                                                         <input
                                                             type="file"
                                                             accept="image/*"
                                                             className="hidden"
                                                             id="pic-upload"
                                                             onChange={handleFileChange}
                                                         />
                                                         <label
                                                             htmlFor="pic-upload"
                                                             className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                                         >
                                                             Upload Photo
                                                         </label>
                                                         {formValues.pic && (
                                                             <>
                                                                 <button
                                                                     type="button"
                                                                     onClick={() => {
                                                                         setCropSrc(originalSrc || formValues.pic);
                                                                         setZoom(1.2);
                                                                         setOffsetX(0);
                                                                         setOffsetY(0);
                                                                         setIsCropping(true);
                                                                     }}
                                                                     className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-gold-primary text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                                                 >
                                                                     Edit Crop
                                                                 </button>
                                                                 <button
                                                                     type="button"
                                                                     onClick={async () => {
                                                                         const urlToDelete = formValues.pic;
                                                                         setFormValues({ ...formValues, pic: "" });
                                                                         await deleteImageFromCloudinary(urlToDelete);
                                                                     }}
                                                                     className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                                 >
                                                                     Remove Photo
                                                                 </button>
                                                             </>
                                                         )}
                                                     </div>
                                                 </div>

                                                 <div className="flex flex-col gap-1.5">
                                                     <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Full Name *</label>
                                                     <input
                                                         type="text"
                                                         required
                                                         placeholder="Enter faculty mentor's full name"
                                                         className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                         value={formValues.fullname}
                                                         onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                                     />
                                                 </div>

                                                 <div className="flex flex-col gap-1.5">
                                                     <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Email Address *</label>
                                                     <input
                                                         type="email"
                                                         required
                                                         placeholder="mentor@institution.edu"
                                                         className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                         value={formValues.email}
                                                         onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                                     />
                                                 </div>
                                             </div>
                                         ) : (
                                             /* Full Form for Student Team Members */
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                 {/* Left Column: Profile Picture & Social Profiles */}
                                                 <div className="space-y-4">
                                                     <div className="flex flex-col items-center justify-center gap-3 w-full mb-2">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider block text-center">Profile Picture</label>

                                                         <div
                                                             className="relative w-24 h-28 p-[1.5px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 flex-shrink-0"
                                                             style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                         >
                                                             <div
                                                                 className="relative w-full h-full bg-white/[0.02] overflow-hidden flex items-center justify-center"
                                                                 style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                             >
                                                                 {formValues.pic ? (
                                                                     <img src={formValues.pic} alt="Preview" className="w-full h-full object-cover" />
                                                                 ) : (
                                                                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20">
                                                                         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                                         <circle cx="12" cy="7" r="4" />
                                                                     </svg>
                                                                 )}
                                                             </div>
                                                         </div>

                                                         <div className="flex items-center gap-3 justify-center w-full">
                                                             <input
                                                                 type="file"
                                                                 accept="image/*"
                                                                 className="hidden"
                                                                 id="pic-upload"
                                                                 onChange={handleFileChange}
                                                             />
                                                             <label
                                                                 htmlFor="pic-upload"
                                                                 className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-white text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                                             >
                                                                 Upload Photo
                                                             </label>
                                                             {formValues.pic && (
                                                                 <>
                                                                     <button
                                                                         type="button"
                                                                         onClick={() => {
                                                                             setCropSrc(originalSrc || formValues.pic);
                                                                             setZoom(1.2);
                                                                             setOffsetX(0);
                                                                             setOffsetY(0);
                                                                             setIsCropping(true);
                                                                         }}
                                                                         className="bg-white/5 border border-white/10 hover:border-gold-primary/30 text-gold-primary text-[10px] font-bold uppercase py-2 px-5 rounded-lg cursor-pointer transition-colors block text-center"
                                                                     >
                                                                         Edit Crop
                                                                     </button>
                                                                     <button
                                                                         type="button"
                                                                         onClick={async () => {
                                                                             const urlToDelete = formValues.pic;
                                                                             setFormValues({ ...formValues, pic: "" });
                                                                             await deleteImageFromCloudinary(urlToDelete);
                                                                         }}
                                                                         className="text-red-400 text-[10px] font-bold uppercase hover:underline focus:outline-none bg-transparent border-none cursor-pointer"
                                                                     >
                                                                         Remove Photo
                                                                     </button>
                                                                 </>
                                                             )}
                                                         </div>
                                                     </div>

                                                     <div className="flex flex-col gap-1.5">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">LinkedIn Profile URL</label>
                                                         <input
                                                             type="url"
                                                             placeholder="https://linkedin.com/in/..."
                                                             className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                             value={formValues.Linkedin}
                                                             onChange={(e) => setFormValues({ ...formValues, Linkedin: e.target.value })}
                                                         />
                                                     </div>

                                                     <div className="flex flex-col gap-1.5">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">GitHub Profile URL</label>
                                                         <input
                                                             type="url"
                                                             placeholder="https://github.com/..."
                                                             className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                             value={formValues.github}
                                                             onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
                                                         />
                                                     </div>
                                                 </div>

                                                 {/* Right Column: Personal & Academic Details */}
                                                 <div className="space-y-4">
                                                     <div className="flex flex-col gap-1.5">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Full Name *</label>
                                                         <input
                                                             type="text"
                                                             required
                                                             className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                             value={formValues.fullname}
                                                             onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                                         />
                                                     </div>

                                                     <div className="flex flex-col gap-1.5">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Register Number *</label>
                                                         <input
                                                             type="text"
                                                             required
                                                             placeholder="Enter register number..."
                                                             className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                             value={formValues.registerNumber}
                                                             onChange={(e) => setFormValues({ ...formValues, registerNumber: e.target.value })}
                                                         />
                                                     </div>

                                                     <div className="flex flex-col gap-1.5">
                                                         <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">Email Address *</label>
                                                         <input
                                                             type="email"
                                                             required
                                                             className="bg-white/[0.02] border border-white/10 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-gold-primary"
                                                             value={formValues.email}
                                                             onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                                         />
                                                     </div>

                                                     <div className="grid grid-cols-2 gap-4">
                                                         <CustomSingleSelect
                                                             label="Department *"
                                                             required
                                                             bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                             dropdownBgClass="bg-[#0c0c0e]"
                                                             options={masterOptions.filter(o => o.category === "department").map(o => ({ value: o.value, label: o.value }))}
                                                             value={formValues.department}
                                                             onChange={(val) => setFormValues({ ...formValues, department: val })}
                                                             placeholder="Select Department"
                                                         />
                                                         <CustomSingleSelect
                                                             label="Section *"
                                                             required
                                                             bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                             dropdownBgClass="bg-[#0c0c0e]"
                                                             options={masterOptions.filter(o => o.category === "section").map(o => ({ value: o.value, label: o.value }))}
                                                             value={formValues.section}
                                                             onChange={(val) => setFormValues({ ...formValues, section: val })}
                                                             placeholder="Select Section"
                                                         />
                                                     </div>

                                                     <div className="grid grid-cols-2 gap-4">
                                                         <CustomSingleSelect
                                                             label="Year *"
                                                             required
                                                             bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                             dropdownBgClass="bg-[#0c0c0e]"
                                                             options={masterOptions.filter(o => o.category === "year").map(o => ({ value: o.value, label: `${o.value} Year` }))}
                                                             value={formValues.year}
                                                             onChange={(val) => setFormValues({ ...formValues, year: val as any })}
                                                             placeholder="Select Year"
                                                         />
                                                         <CustomSingleSelect
                                                             label="Generation *"
                                                             required
                                                             bgClass="bg-[#0c0c0e] border border-white/10 py-2.5 px-3 text-xs h-[42px]"
                                                             dropdownBgClass="bg-[#0c0c0e]"
                                                             options={masterOptions.filter(o => o.category === "batch").map(o => ({ value: o.value, label: o.value }))}
                                                             value={formValues.batch}
                                                             onChange={(val) => setFormValues({ ...formValues, batch: val })}
                                                             placeholder="Select Generation"
                                                         />
                                                     </div>
                                                 </div>
                                             </div>
                                         )}

                                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
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
                                                {modalMode === "add" ? "Save Member" : "Update Member"}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </Portal>
            )}

            {/* Custom Delete Confirmation Modal */}
            {memberToDelete && (
                <Portal>
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
                                Are you sure you want to delete this team member? This action is permanent and cannot be undone.
                            </p>

                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => setMemberToDelete(null)}
                                    className="bg-transparent border border-white/10 hover:border-white/20 text-white text-[10px] font-extrabold uppercase py-2.5 px-5 rounded-full cursor-pointer transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const id = memberToDelete;
                                        setMemberToDelete(null);
                                        await executeDeleteMember(id);
                                    }}
                                    className="bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase py-2.5 px-6 rounded-full cursor-pointer transition-all shadow-[0_4px_15px_rgba(239,68,68,0.05)]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
