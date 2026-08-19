import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../compoenets/Toast";
import ApplicationServices from "../../services/admin/ApplicationServices";
import CloudinaryServices, { getSafeResumeUrl } from "../../services/cloudinaryService";
import MasterDataServices, { type IMasterDataOption } from "../../services/admin/MasterDataServices";
import CommunitySettingsServices from "../../services/admin/CommunitySettingsServices";
import DomainServices, { type DomainOption } from "../../services/admin/DomainServices";
import CustomSingleSelect from "../../compoenets/CustomSingleSelect";
import PageHero from "../../compoenets/PageHero";
import AmbientGlow from "../../compoenets/AmbientGlow";
import { useBodyBackground } from "../../utils/hooks";
import { cardVariants } from "../../utils/motionVariants";

function DomainMultiSelect({
    label,
    domains,
    selectedNames,
    onChange,
}: {
    label: string;
    domains: DomainOption[];
    selectedNames: string[];
    onChange: (names: string[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleOption = (name: string) => {
        if (selectedNames.includes(name)) {
            onChange(selectedNames.filter(x => x !== name));
        } else {
            onChange([...selectedNames, name]);
        }
    };

    const toggleDropdown = () => {
        if (isOpen) {
            setSearchTerm("");
        }
        setIsOpen(!isOpen);
    };

    const filteredDomains = domains
        .filter(d => d.isActive)
        .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">{label}</label>
            <div className="relative">
                <div
                    onClick={toggleDropdown}
                    className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white cursor-pointer flex justify-between items-center select-none min-h-[42px]"
                >
                    <div className="flex flex-wrap gap-1 max-w-[90%] truncate">
                        {selectedNames.length === 0 ? (
                            <span className="text-white/40 font-semibold">Select Domains of Interest</span>
                        ) : (
                            selectedNames.map((val, idx) => (
                                <span key={idx} className="bg-gold-primary/10 border border-gold-primary/20 text-gold-primary px-2.5 py-1 rounded text-[10px] font-bold">
                                    {val}
                                </span>
                            ))
                        )}
                    </div>
                    <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setSearchTerm(""); }} />
                        <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#171717] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[380px] overflow-hidden flex flex-col p-2 gap-1.5">
                            {/* Search Input Box */}
                            <div className="flex items-center bg-black/30 border border-white/5 rounded-lg px-2.5 py-1.5 focus-within:border-gold-primary/30 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40 mr-2">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search domain..."
                                    className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-white/30 font-semibold"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSearchTerm("");
                                        }}
                                        className="text-white/40 hover:text-white bg-transparent border-none cursor-pointer p-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Scrollable Domains List */}
                            <div className="overflow-y-auto max-h-[300px] space-y-1 custom-scrollbar pr-0.5">
                                {filteredDomains.length === 0 ? (
                                    <div className="text-center py-4 text-white/30 text-[10px] uppercase font-bold tracking-wider select-none">
                                        No domains found
                                    </div>
                                ) : (
                                    filteredDomains.map(dom => {
                                        const isChecked = selectedNames.includes(dom.name);
                                        return (
                                            <div
                                                key={dom._id}
                                                onClick={() => toggleOption(dom.name)}
                                                className="flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-xs font-semibold"
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
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}



// Reusable animated section header
function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
    return (
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.span
                className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] block mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]"
                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {eyebrow}
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                {title}
            </h2>
            <motion.div
                className="mx-auto mt-4 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "180px" }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />
        </motion.div>
    );
}

// FAQ Accordion Item component
function FAQItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-white/5 py-5">
            <button
                type="button"
                onClick={onClick}
                className="w-full flex justify-between items-center text-left focus:outline-none group cursor-pointer"
            >
                <span className="text-sm font-semibold text-white group-hover:text-gold-primary transition-colors duration-300">
                    {question}
                </span>
                <span className={`text-xs text-[#9D9D9D] transition-transform duration-300 ${isOpen ? "rotate-45 text-gold-primary" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs text-[#9D9D9D] leading-relaxed pt-3 pr-6">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function JoinHiveMind() {
    useBodyBackground("/assets/backgrounds/gb.webp");

    const [toast, setToast] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [masterOptions, setMasterOptions] = useState<IMasterDataOption[]>([]);
    const [domainsList, setDomainsList] = useState<DomainOption[]>([]);
    const [acceptingApplications, setAcceptingApplications] = useState(true);
    const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        document.title = "HiveMind | Join HiveMind";
        MasterDataServices.getMasterData()
            .then(res => {
                if (res.success && res.data) {
                    setMasterOptions(res.data);
                }
            })
            .catch(() => { });

        DomainServices.getDomains()
            .then(res => {
                if (res.success && res.data) {
                    setDomainsList(res.data);
                }
            })
            .catch(() => { });

        CommunitySettingsServices.getSettings()
            .then(res => {
                if (res.success && res.settings) {
                    setAcceptingApplications(res.settings.acceptingApplications !== false);
                }
            })
            .catch(() => { });
    }, []);

    const [formValues, setFormValues] = useState({
        fullname: "",
        registerNumber: "",
        email: "",
        phoneNumber: "",
        dept: "",
        year: "1st" as "1st" | "2nd" | "3rd" | "4th",
        linkedin: "",
        github: "",
        resume: "",
        portfolio: "",
        domainOfInterest: "",
        programmingLanguages: "", // split into array on submit
        whyJoin: "",
        experience: "",
        hoursPerWeek: 10,
        howDidYouHear: "",
    });

    const [isClosedModalOpen, setIsClosedModalOpen] = useState(false);

    const handleApplyClick = () => {
        if (!acceptingApplications) {
            setIsClosedModalOpen(true);
            return;
        }
        setIsModalOpen(true);
    };

    const deleteImageFromCloudinary = async (url: string) => {
        if (!url || !url.includes("res.cloudinary.com")) return;
        try {
            await CloudinaryServices.deleteFromCloudinary(url);
        } catch (err) {
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setToast({ message: "Please upload your resume in PDF format only.", type: "error" });
                return;
            }
            if (file.size > 8 * 1024 * 1024) {
                setToast({ message: "PDF size must be less than 8MB.", type: "error" });
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            try {
                const res = await CloudinaryServices.uploadToCloudinary(file, "Resumes", (percent) => {
                    setUploadProgress(percent);
                });

                if (res && res.secure_url) {
                    const finalUrl = getSafeResumeUrl(res.secure_url);
                    const oldResume = formValues.resume;
                    setFormValues(prev => ({ ...prev, resume: finalUrl }));
                    if (oldResume) {
                        deleteImageFromCloudinary(oldResume);
                    }
                    setToast({ message: "Resume uploaded successfully.", type: "success" });
                } else {
                    setToast({ message: "Upload failed: No URL returned from server.", type: "error" });
                }
            } catch (err: any) {
                setToast({
                    message: err.response?.data?.error?.message || "Failed to upload resume to Cloudinary.",
                    type: "error"
                });
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formValues.fullname.trim().length < 3) {
            setToast({ message: "Full name must be at least 3 characters.", type: "error" });
            return;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formValues.phoneNumber)) {
            setToast({ message: "Please enter a valid 10-digit phone number.", type: "error" });
            return;
        }
        if (!formValues.linkedin.trim()) {
            setToast({ message: "LinkedIn profile is required.", type: "error" });
            return;
        }
        if (!formValues.resume) {
            setToast({ message: "Please upload your resume.", type: "error" });
            return;
        }
        if (formValues.whyJoin.trim().length < 10) {
            setToast({ message: "Please explain in detail why you want to join HiveMind.", type: "error" });
            return;
        }
        if (!formValues.domainOfInterest.trim()) {
            setToast({ message: "Please select at least one domain of interest.", type: "error" });
            return;
        }
        if (!formValues.programmingLanguages.trim()) {
            setToast({ message: "Please select at least one programming language.", type: "error" });
            return;
        }
        if (formValues.hoursPerWeek < 1) {
            setToast({ message: "Please contribute at least 1 hour per week.", type: "error" });
            return;
        }

        setSubmitting(true);

        const parsedLanguages = formValues.programmingLanguages
            .split(",")
            .map((lang) => lang.trim())
            .filter((lang) => lang.length > 0);

        const payload = {
            ...formValues,
            phoneNumber: `+91${formValues.phoneNumber}`,
            programmingLanguages: parsedLanguages,
        };

        try {
            const res = await ApplicationServices.applyMember(payload);
            if (res.success) {
                setIsSubmitted(true);
            } else {
                setToast({ message: res.message || "Failed to submit application.", type: "error" });
            }
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "An error occurred while submitting your application.",
                type: "error"
            });
        } finally {
            setSubmitting(false);
        }
    };



    const whyJoinCards = [
        {
            title: "Real Projects",
            desc: "Build production-ready AI systems with real impact. Implement and train models directly on cluster GPU nodes.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="1" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
            )
        },
        {
            title: "AI Research",
            desc: "Collaborate on cutting-edge research and emerging technologies. Co-author papers and participate in global AI conferences.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h4.906M12 3v3.75m0 3.75H9M12 10.5h3m-6.75 1.5h7.5M3 20.25h18" />
                    <circle cx="12" cy="9" r="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
            )
        },
        {
            title: "Community",
            desc: "Grow alongside passionate developers, researchers and innovators. Work in a highly collaborative peer network.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A12.018 12.018 0 0112 21c-1.07 0-2.115-.14-3.118-.407a12.078 12.078 0 01-3.07-1.465V19.13M3 16.056a4.125 4.125 0 017.533-2.493M3 16.056c-.502.91-.786 1.957-.786 3.07v.003c0 1.113.285 2.16.786 3.07M3 16.056A4.125 4.125 0 003 19.13M12 11.25a3 3 0 100-6 3 3 0 000 6zm6.5 1.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <polygon points="50,15 85,75 15,75" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            )
        },
        {
            title: "Hackathons",
            desc: "Participate in workshops, lab meetups and national hackathons. Prototype and deploy live builds rapidly.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75a1.125 1.125 0 00-1.125 1.125v3.375m9 0h-9m9 0V9.75M7.5 18.75V9.75m0 0A3.375 3.375 0 0110.875 6.375h2.25A3.375 3.375 0 0116.5 9.75m-9 0h9" />
                </svg>
            ),
            illustration: (
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-[0.03] text-white transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1 pointer-events-none" viewBox="0 0 100 100">
                    <path d="M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="1" />
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
            )
        }
    ];

    const selectionSteps = [
        {
            step: "Step 1",
            title: "Application Submission",
            desc: "Complete the application form and tell us about yourself, your interests and your experience.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            )
        },
        {
            step: "Step 2",
            title: "Application Review",
            desc: "Our team reviews your profile, skills and interests to understand how you can contribute to HiveMind.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            step: "Step 3",
            title: "Technical Discussion",
            desc: "A friendly technical discussion to understand your learning approach, problem-solving ability and passion for technology.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-inherit transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171H4.875c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315M16.5 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171h-2.205c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315M21.75 9.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm1.94 9.876c-.055-.44-.128-.88-.22-1.314-.117-.55-.66-1.171-1.25-1.171h-2.205c-.59 0-1.133.621-1.25 1.17-.092.435-.165.875-.22 1.315" />
                </svg>
            )
        }
    ];

    const faqs = [
        { question: "Who can apply to HiveMind?", answer: "Open to all students who are passionate about intelligence systems, robotics, and software engineering. We value curiosity and core dedication over predefined titles." },
        { question: "Do I need prior experience?", answer: "Prior research experience is not required. While familiarity with programming concepts (Python, C++) is highly beneficial, we look for high learning velocity and problem-solving aptitude." },
        { question: "Is there an interview?", answer: "Yes. Once your written application is reviewed, we host a friendly technical discussion. This is a conversational review of your learning methodology, passion, and past small builds." },
        { question: "How much time should I contribute?", answer: "Lab members contribute at least 10 hours per week on average. This ensures consistent progress across team sprint cycles and project deliverables." },
        {
            question: "Can students from any department apply?",
            answer: "Yes. Students from any department can apply. We welcome anyone with curiosity, passion for technology, and a strong willingness to learn and build."
        },
        {
            question: "How will I know my application status?",
            answer: "Application updates will be sent to your registered email address. Shortlisted applicants will receive further details about the technical discussion and interview process."
        }
    ];

    return (
        <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-x-clip">
            {/* Dark overlay backdrop to keep content readable matching other pages */}
            <div className="fixed inset-0 bg-[#050505]/45 z-0 pointer-events-none" />
            <AmbientGlow />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Full-Screen Submission Loader */}
            <AnimatePresence>
                {submitting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
                        style={{ backgroundColor: "rgba(5, 5, 5, 0.92)", backdropFilter: "blur(12px)" }}
                    >
                        {/* Spinning ring */}
                        <div className="relative mb-8">
                            <div
                                className="w-16 h-16 rounded-full border-[3px] border-white/5"
                                style={{ borderTopColor: "#FFC107", animation: "spin 1s linear infinite" }}
                            />
                            <div
                                className="absolute inset-0 w-16 h-16 rounded-full border-[3px] border-transparent"
                                style={{ borderBottomColor: "rgba(255, 193, 7, 0.3)", animation: "spin 1.5s linear infinite reverse" }}
                            />
                            {/* Inner glow dot */}
                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-primary"
                                style={{ animation: "pulse 1.5s ease-in-out infinite", boxShadow: "0 0 20px rgba(255, 193, 7, 0.5)" }}
                            />
                        </div>
                        {/* Text */}
                        <p
                            className="text-[11px] font-extrabold uppercase tracking-[0.35em] text-white/70"
                            style={{ animation: "pulse 2s ease-in-out infinite" }}
                        >
                            Submitting Application
                        </p>
                        <p className="text-[9px] text-white/30 mt-2 tracking-widest uppercase font-bold">
                            Please wait...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* UNIFIED HERO & PAGE CONTENT */}
            <main className="flex-1 z-10 pt-6 md:pt-10 pb-16 flex flex-col items-center justify-start">
                <section className="relative flex flex-col items-center bg-transparent text-white pt-2 pb-16 md:pt-4 md:pb-24 px-6 md:px-[10%] z-10 w-full" id="join">
                    <PageHero
                        badge="RECRUITMENT • AI SUPERCOMPUTING LAB"
                        title="JOIN HIVEMIND"
                        subtitle="BECOME PART OF AN ELITE COMMUNITY BUILDING THE FUTURE OF ARTIFICIAL INTELLIGENCE & INTELLIGENT SYSTEMS"
                        editorialBadge="RESEARCH, INNOVATION & IMPACT"
                        editorialHeading={
                            <>
                                ARCHITECT THE NEXT ERA OF <span className="text-gold-primary">INTELLIGENT SYSTEMS</span>
                            </>
                        }
                        paragraphs={[
                            "HiveMind is the premier student-driven Artificial Intelligence and Supercomputing community at Sathyabama Institute of Science and Technology, operating from the AI Supercomputing Lab in the SCAS Block.",
                            "We empower passionate students across all engineering disciplines to transition from learners to innovators — deploying Large Language Models, Generative Vision systems, Autonomous Agents, and High-Performance Compute clusters."
                        ]}
                        highlightParagraph="Zero department barriers. Real hands-on GPU clusters. Tier-1 hackathons, research papers, and production deployments."
                        sectionId="hero"
                        catalogueBadge="CAPABILITIES & CULTURE"
                        catalogueTitle="WHY JOIN HIVEMIND"
                    />

                    {/* Quick Action Apply CTA */}
                    <div className="relative z-10 flex justify-center -mt-6 mb-16 px-4">
                        <button
                            onClick={handleApplyClick}
                            className="bg-[#D6A84F] hover:bg-[#F0C766] text-[#0B0B0A] text-xs font-extrabold uppercase py-3.5 px-10 rounded-full cursor-pointer transition-all duration-200 tracking-widest shadow-[0_4px_20px_rgba(214,168,79,0.3)] hover:shadow-[0_6px_25px_rgba(214,168,79,0.5)] border-none"
                        >
                            Apply For Recruitment
                        </button>
                    </div>

                    {/* SECTION 2: WHY JOIN HIVEMIND (2x2 Grid) */}
                    <div id="why-join" className="relative pb-24 w-full bg-transparent z-10">
                        <div className="max-w-5xl mx-auto relative z-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {whyJoinCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                custom={idx}
                                initial="hidden"
                                whileInView="visible"
                                whileHover={{ y: -8 }}
                                viewport={{ once: false, amount: 0.15 }}
                                variants={cardVariants}
                                className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/30 rounded-2xl p-8 flex flex-col justify-start h-64 relative group overflow-hidden cursor-pointer transition-[border-color,box-shadow,background-color] duration-400 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.05)_0%,transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400"
                            >
                                {/* Background illustration */}
                                {card.illustration}

                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gold-primary flex items-center justify-center mb-6 group-hover:bg-gold-primary group-hover:text-[#050505] transition-colors duration-300 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] group-hover:scale-110">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3 group-hover:text-gold-primary transition-colors duration-300">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-[#9D9D9D] leading-relaxed max-w-xs">
                                        {card.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


            {/* SECTION 4: SELECTION PROCESS (HORIZONTAL TIMELINE) */}
            <section className="relative py-24 px-6 md:px-[8%] bg-transparent z-10">
                <div className="max-w-5xl mx-auto relative z-10">
                    <SectionHeader eyebrow="Milestones" title="Selection Process" />

                    {/* Horizontal Interactive Timeline Stepper */}
                    <div className="relative max-w-4xl mx-auto py-12 px-4 overflow-x-auto select-none">
                        <div className="min-w-[600px] relative">
                            {/* Static Pipeline line background */}
                            <div className="absolute left-10 right-10 top-3 h-[1px] bg-white/10 z-0" />

                            {/* Sequential glowing pipeline line */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "90%" }}
                                viewport={{ once: false }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                className="absolute left-10 top-3 h-[1.5px] bg-gold-primary shadow-[0_0_8px_#FFC107] z-0"
                            />

                            <div className="flex justify-between items-center relative z-10">
                                {[
                                    { label: "Submit", text: "Application" },
                                    { label: "Review", text: "Evaluation" },
                                    { label: "Technical", text: "Discussion" }
                                ].map((node, index) => (
                                    <div key={index} className="flex flex-col items-center w-24">
                                        <motion.div
                                            initial={{ scale: 0.8, borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#050505" }}
                                            whileInView={{
                                                scale: 1,
                                                borderColor: "#FFC107",
                                                backgroundColor: "#FFC107"
                                            }}
                                            viewport={{ once: false }}
                                            transition={{ duration: 0.3, delay: index * 0.4 }}
                                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-[#050505] z-10"
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white mt-3 block">
                                            {node.label}
                                        </span>
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#9D9D9D] mt-0.5 block">
                                            {node.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                        {selectionSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                custom={idx}
                                initial="hidden"
                                whileInView="visible"
                                whileHover={{ y: -8 }}
                                viewport={{ once: false, amount: 0.15 }}
                                variants={cardVariants}
                                className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/30 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] text-left group relative overflow-hidden cursor-pointer transition-[border-color,box-shadow,background-color] duration-400 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[radial-gradient(circle_at_top,rgba(255,193,7,0.05)_0%,transparent_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400"
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-[9px] font-black uppercase text-gold-primary tracking-wider">
                                            {step.step}
                                        </span>
                                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-gold-primary flex items-center justify-center group-hover:bg-gold-primary group-hover:text-[#050505] transition-all duration-300 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] group-hover:scale-110">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-2 group-hover:text-gold-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-[#9D9D9D] leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: FAQ */}
            <section className="relative py-24 px-6 md:px-[8%] bg-transparent z-10">
                <div className="max-w-3xl mx-auto relative z-10">
                    <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />

                    <motion.div
                        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    >
                        {faqs.map((faq, idx) => (
                            <FAQItem
                                key={idx}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFAQIndex === idx}
                                onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)}
                            />
                        ))}
                    </motion.div>

                    {/* BOTTOM CTA */}
                    <motion.div
                        className="text-center mt-24 max-w-2xl mx-auto space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h3 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-wide">
                            Ready to Build the Future?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#9D9D9D] leading-relaxed max-w-lg mx-auto">
                            Submit your profile details below to connect with us and take the first step towards joining the lab.
                        </p>
                        <button
                            onClick={handleApplyClick}
                            className="bg-[#D6A84F] hover:bg-[#F0C766] text-[#0B0B0A] text-[11px] font-extrabold uppercase py-3.5 px-8 rounded-full cursor-pointer transition-colors duration-200 tracking-widest shadow-[0_4px_20px_rgba(214,168,79,0.25)] inline-block mt-4 border-none"
                        >
                            Apply Now
                        </button>
                    </motion.div>
                </div>
            </section>
        </section>
    </main>

            {/* RECRUITMENT CLOSED POPUP MODAL */}
            {isClosedModalOpen && createPortal(
                <div
                    className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999999] p-4 sm:p-6 animate-fade-in select-none"
                    onClick={() => setIsClosedModalOpen(false)}
                >
                    <div
                        className="bg-[#171714] border border-[#2A2A25] rounded-3xl p-7 sm:p-9 max-w-md w-full text-center relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top decorative accent line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D6A84F]/60 to-transparent" />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsClosedModalOpen(false)}
                            className="absolute top-5 right-5 text-[#858278] hover:text-white transition-colors cursor-pointer bg-transparent border-none focus:outline-none"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Gold Lock Icon Badge */}
                        <div className="w-13 h-13 rounded-2xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-center text-[#D6A84F] mx-auto mb-4 shadow-[0_0_20px_rgba(214,168,79,0.2)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>

                        {/* Eyebrow & Title */}
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.3em] mb-1.5 block [text-shadow:0_0_10px_rgba(214,168,79,0.3)]">
                            Application Notice
                        </span>
                        <h3 className="text-xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent mb-3">
                            Recruitments are Closed
                        </h3>

                        {/* Concise Clean Message */}
                        <p className="text-xs sm:text-[13px] text-[#B8B5AA] leading-relaxed mb-6 font-normal">
                            Membership applications are currently closed. Please stay tuned to our community channels for announcements on the next recruitment drive.
                        </p>

                        {/* Action Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsClosedModalOpen(false)}
                                className="bg-[#D6A84F] hover:bg-[#F0C766] text-[#0B0B0A] font-extrabold text-xs uppercase tracking-widest py-3 px-8 rounded-full cursor-pointer transition-all border-none shadow-[0_4px_20px_rgba(214,168,79,0.3)] hover:shadow-[0_6px_25px_rgba(214,168,79,0.5)]"
                            >
                                Got It
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* PUBLIC MEMBERSHIP FORM PORTAL MODAL */}
            {isModalOpen && createPortal(
                <div
                    className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999999] p-4 sm:p-6 animate-fade-in"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 w-full max-w-4xl max-h-[88vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none focus:outline-none z-20"
                            title="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
                            <div className="max-w-4xl mx-auto text-center relative z-10 pt-4">
                                <SectionHeader eyebrow="Registration" title="Apply For Membership" />

                                <div className="mt-6 text-left">
                                    {!acceptingApplications ? (
                                        <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center select-none">
                                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">
                                                Recruitment Closed
                                            </h3>
                                            <p className="text-xs text-[#9D9D9D] leading-relaxed mb-8 uppercase tracking-wider font-semibold">
                                                HiveMind is not accepting recruitment applications at the moment. Please check back later or contact the admin.
                                            </p>
                                            <div className="flex gap-4 justify-center">
                                                <a
                                                    href="/"
                                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all no-underline tracking-widest text-center"
                                                >
                                                    Return Home
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all tracking-widest text-center"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ) : isSubmitted ? (
                                        <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center select-none">
                                            <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center text-gold-primary mb-6 shadow-[0_0_20px_rgba(255,193,7,0.15)] animate-pulse">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">
                                                Application Received
                                            </h3>
                                            <p className="text-xs text-[#9D9D9D] leading-relaxed mb-8 uppercase tracking-wider font-semibold">
                                                Thanks for applying.We will reach out you soon
                                            </p>
                                            <div className="flex gap-4 justify-center">
                                                <a
                                                    href="/"
                                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all no-underline tracking-widest text-center"
                                                >
                                                    Return Home
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="bg-transparent border border-white/5 hover:border-gold-primary/30 text-white text-[10px] font-extrabold uppercase py-3 px-8 rounded-full cursor-pointer transition-all tracking-widest text-center"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    ) : isUploading ? (
                                        <div className="flex flex-col items-center justify-center text-center select-none py-24">
                                            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin mb-6" />
                                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">
                                                Uploading Resume
                                            </h4>
                                            <div className="w-full max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                                <div
                                                    className="bg-gradient-to-r from-gold-primary to-gold-light h-full transition-all duration-300 ease-out"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider">
                                                {uploadProgress}% Uploaded
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                                                {/* Personal Info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Full Name *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.fullname}
                                                            onChange={(e) => setFormValues({ ...formValues, fullname: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Register Number *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.registerNumber}
                                                            onChange={(e) => setFormValues({ ...formValues, registerNumber: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Email Address *</label>
                                                        <input
                                                            type="email"
                                                            required
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.email}
                                                            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Phone Number *</label>
                                                        <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-xl focus-within:border-gold-primary transition-colors overflow-hidden">
                                                            {/* Non-editable prefix */}
                                                            <div className="flex items-center gap-1.5 px-3 py-3 border-r border-white/5 bg-white/[0.01] select-none">
                                                                <span className="text-sm">🇮🇳</span>
                                                                <span className="text-xs text-[#9D9D9D] font-bold">+91</span>
                                                            </div>
                                                            {/* Input field */}
                                                            <input
                                                                type="tel"
                                                                required
                                                                className="flex-1 bg-transparent py-3 px-3 text-white text-xs focus:outline-none font-semibold"
                                                                value={formValues.phoneNumber}
                                                                onChange={(e) => {
                                                                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                    setFormValues({ ...formValues, phoneNumber: val });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Academic Details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <CustomSingleSelect
                                                        label="Department"
                                                        required
                                                        options={masterOptions.filter(o => o.category === "department").map(o => ({ value: o.value, label: o.value }))}
                                                        value={formValues.dept}
                                                        onChange={(val) => setFormValues({ ...formValues, dept: val })}
                                                    />
                                                    <CustomSingleSelect
                                                        label="Year of Study"
                                                        required
                                                        options={masterOptions.filter(o => o.category === "year").map(o => ({ value: o.value, label: `${o.value} Year` }))}
                                                        value={formValues.year}
                                                        onChange={(val) => setFormValues({ ...formValues, year: val as any })}
                                                    />
                                                </div>

                                                {/* Profiles & Resume */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">LinkedIn URL *</label>
                                                        <input
                                                            type="url"
                                                            required
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.linkedin}
                                                            onChange={(e) => setFormValues({ ...formValues, linkedin: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">GitHub (optional)</label>
                                                        <input
                                                            type="url"
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.github}
                                                            onChange={(e) => setFormValues({ ...formValues, github: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Portfolio (optional)</label>
                                                        <input
                                                            type="url"
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.portfolio}
                                                            onChange={(e) => setFormValues({ ...formValues, portfolio: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Resume PDF *</label>
                                                        {formValues.resume ? (
                                                            <div className="flex items-center justify-between border border-gold-primary/20 bg-gold-primary/5 p-3 rounded-xl animate-fade-in shadow-[0_0_15px_rgba(255,193,7,0.05)]">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/20">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                            <polyline points="14 2 14 8 20 8" />
                                                                            <line x1="16" y1="13" x2="8" y2="13" />
                                                                            <line x1="16" y1="17" x2="8" y2="17" />
                                                                            <polyline points="10 9 9 9 8 9" />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="text-left">
                                                                        <span className="text-[10px] font-black text-white uppercase tracking-wider block">Resume Uploaded</span>
                                                                        <span className="text-[9px] text-gold-primary/80 font-bold uppercase tracking-widest block">Ready for Review</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={async () => {
                                                                        const url = formValues.resume;
                                                                        setFormValues(prev => ({ ...prev, resume: "" }));
                                                                        await deleteImageFromCloudinary(url);
                                                                    }}
                                                                    className="text-red-400 hover:text-red-300 font-extrabold uppercase text-[9px] bg-transparent border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                                    </svg>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="relative group">
                                                                <input
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    id="pdf-upload"
                                                                    onChange={handleResumeUpload}
                                                                    className="hidden"
                                                                />
                                                                <label
                                                                    htmlFor="pdf-upload"
                                                                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-gold-primary/50 bg-white/[0.01] hover:bg-gold-primary/[0.02] rounded-xl py-5 px-4 text-center cursor-pointer transition-all duration-300"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-gold-primary/10 flex items-center justify-center text-white/50 group-hover:text-gold-primary border border-white/5 group-hover:border-gold-primary/20 transition-all duration-300 mb-2">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform duration-300">
                                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                            <polyline points="17 8 12 3 7 8" />
                                                                            <line x1="12" y1="3" x2="12" y2="15" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest block">Upload Resume PDF</span>
                                                                    <span className="text-[8px] text-[#888888] group-hover:text-gold-primary/80 font-bold uppercase tracking-wider block mt-1">PDF format (Max 2MB)</span>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {/* Domain select */}
                                                    <DomainMultiSelect
                                                        label="Domains of Interest * (Select all that apply)"
                                                        domains={domainsList}
                                                        selectedNames={formValues.domainOfInterest ? formValues.domainOfInterest.split(", ").map(x => x.trim()).filter(Boolean) : []}
                                                        onChange={(vals) => setFormValues({ ...formValues, domainOfInterest: vals.join(", ") })}
                                                    />

                                                    {/* Programming languages chips select */}
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Programming Languages *</label>

                                                        {/* Selectable Chip buttons */}
                                                        <div className="flex flex-wrap gap-1.5 p-3.5 bg-white/[0.01] border border-white/5 rounded-xl">
                                                            {masterOptions.filter(o => o.category === "programming_language").map(lang => {
                                                                const currentList = formValues.programmingLanguages
                                                                    .split(",")
                                                                    .map(x => x.trim())
                                                                    .filter(Boolean);
                                                                const isSelected = currentList.includes(lang.value);
                                                                return (
                                                                    <button
                                                                        key={lang._id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            let next: string[];
                                                                            if (isSelected) {
                                                                                next = currentList.filter(l => l !== lang.value);
                                                                            } else {
                                                                                next = [...currentList, lang.value];
                                                                            }
                                                                            setFormValues({ ...formValues, programmingLanguages: next.join(", ") });
                                                                        }}
                                                                        className={`px-4.5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${isSelected
                                                                            ? "bg-gold-primary/10 border-gold-primary/25 text-gold-primary [text-shadow:0_0_8px_rgba(255,193,7,0.2)]"
                                                                            : "bg-white/[0.02] border-white/5 text-[#888888] hover:text-white hover:border-white/10"
                                                                            }`}
                                                                    >
                                                                        {lang.value}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Why do you want to join HiveMind? *</label>
                                                    <textarea
                                                        required
                                                        rows={3}
                                                        className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors resize-none font-semibold"
                                                        value={formValues.whyJoin}
                                                        onChange={(e) => setFormValues({ ...formValues, whyJoin: e.target.value })}
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">Hours you can contribute per week *</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="1"
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.hoursPerWeek}
                                                            onChange={(e) => setFormValues({ ...formValues, hoursPerWeek: parseInt(e.target.value) || 0 })}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">How do you know about us? *</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-gold-primary transition-colors font-semibold"
                                                            value={formValues.howDidYouHear}
                                                            onChange={(e) => setFormValues({ ...formValues, howDidYouHear: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full bg-gold-primary hover:bg-[#D4AF37] text-[#050505] text-xs font-extrabold uppercase py-4 rounded-xl cursor-pointer transition-all duration-300 tracking-widest shadow-[0_4px_20px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_25px_rgba(255,193,7,0.3)] mt-6"
                                                >
                                                    Submit Application
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* FULLSCREEN SUBMITTING LOADER OVERLAY */}
            {submitting && createPortal(
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[100000] p-6 animate-fade-in text-center select-none">
                    <div className="relative mb-6 flex items-center justify-center">
                        {/* Spinning Gold Outer Ring */}
                        <div className="w-20 h-20 rounded-full border-2 border-gold-primary/20 border-t-gold-primary animate-spin shadow-[0_0_30px_rgba(255,193,7,0.25)]" />
                        {/* Pulsing HiveMind Brand Logo */}
                        <img
                            src="/assets/logos/HiveMind_logo_bg_removed.webp"
                            alt="HiveMind Logo"
                            className="w-8 h-8 absolute animate-pulse"
                        />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white mb-2">
                        Submitting Application
                    </h3>
                    <p className="text-xs text-[#9D9D9D] font-bold uppercase tracking-wider max-w-sm">
                        Processing candidate details and sending confirmation emails...
                    </p>
                </div>,
                document.body
            )}
        </div>
    );
}
