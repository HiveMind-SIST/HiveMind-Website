import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectServices, { type Project } from "../../services/admin/ProjectServices";
import { useBodyBackground } from "../../utils/hooks";
import { cardVariants } from "../../utils/motionVariants";
import { CloseIcon, GitHubIcon, LinkedInIcon } from "../../compoenets/icons";
import PageHero from "../../compoenets/PageHero";
import AmbientGlow from "../../compoenets/AmbientGlow";
import Spinner from "../../compoenets/Spinner";
import Portal from "../../compoenets/Portal";

const ProjectCard = ({ project, onClick }: { project: Project; onClick: (p: Project) => void }) => {
    return (
        <div 
            onClick={() => onClick(project)}
            className="group relative bg-[#0c0c0e]/30 hover:bg-[#0c0c0e]/60 cursor-pointer backdrop-blur-md border border-white/5 hover:border-gold-primary/30 rounded-3xl overflow-hidden flex flex-col h-[435px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(255,193,7,0.06)]"
        >
            {/* Widescreen 16:9 Aspect Ratio Container */}
            <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center border-b border-white/5">
                {project.thumbnail ? (
                    <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/[0.01] text-white/20 select-none">
                        <span className="text-xs font-bold uppercase tracking-wider">No Cover Image</span>
                    </div>
                )}
                {/* Status Hover Accent */}
                <div className={`absolute top-4 left-4 backdrop-blur-md border text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md z-10 ${
                    project.status === "Completed" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    project.status === "Ongoing" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                    "bg-amber-500/10 border-amber-500/20 text-amber-400"
                }`}>
                    {project.status}
                </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4 overflow-hidden">
                <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white group-hover:text-gold-primary transition-colors line-clamp-1">
                        {project.title}
                    </h3>
                    {project.status === "Completed" && project.duration && (
                        <span className="text-[9px] text-[#666666] font-bold uppercase tracking-wider block">
                            Duration: {project.duration}
                        </span>
                    )}
                    <p className="text-xs text-[#BBBBBB] leading-relaxed line-clamp-3 overflow-hidden text-ellipsis text-justify [hyphens:auto] [text-justify:inter-word]">
                        {project.description}
                    </p>
                </div>

                <div className="border-t border-white/5 pt-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="text-[8px] font-bold text-gold-primary uppercase tracking-widest flex-shrink-0">
                            Collaborators:
                        </span>
                        <div className="flex items-center -space-x-1.5">
                            {Array.isArray(project.collaborators) && project.collaborators.length > 0 ? (
                                project.collaborators.map((collab: any) => {
                                    if (!collab) return null;
                                    return collab.pic ? (
                                        <img 
                                            key={collab._id} 
                                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0c0c0e] object-cover flex-shrink-0" 
                                            src={collab.pic} 
                                            alt={collab.fullname} 
                                            title={collab.fullname} 
                                        />
                                    ) : (
                                        <div 
                                            key={collab._id} 
                                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0c0c0e] bg-gold-primary/20 flex items-center justify-center text-[7px] font-black text-gold-primary flex-shrink-0" 
                                            title={collab.fullname}
                                        >
                                            {collab.fullname?.substring(0, 2).toUpperCase() || "?"}
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="text-[8px] text-white/30 italic">None</span>
                            )}
                        </div>
                    </div>

                    <span className="text-[9px] font-black uppercase text-gold-primary tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1.5 flex-shrink-0">
                        View Details →
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useBodyBackground("/assets/backgrounds/gb.webp");

    useEffect(() => {
        document.title = "HiveMind | Projects";
        ProjectServices.getProjects()
            .then(res => {
                if (res.success && res.projects) {
                    setProjects(res.projects);
                }
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = "hidden";
            document.title = `HiveMind | Project - ${selectedProject.title}`;
        } else {
            document.body.style.overflow = "";
            document.title = "HiveMind | Projects";
        }
        return () => {
            document.body.style.overflow = "";
            document.title = "HiveMind | Projects";
        };
    }, [selectedProject]);

    return (
        <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-x-clip">
            {/* Dark overlay backdrop */}
            <div className="fixed inset-0 bg-[#050505]/45 z-0 pointer-events-none" />

            <AmbientGlow />

            <main className="flex-1 z-10 pt-6 md:pt-10 pb-16 flex flex-col items-center justify-start">
                <section className="relative flex flex-col items-center bg-transparent text-white pt-2 pb-16 md:pt-4 md:pb-24 px-6 md:px-[10%] z-10 w-full" id="projects">
                    <PageHero
                        badge="INNOVATION AT HIVEMIND"
                        title="OUR PROJECTS"
                        subtitle="A portfolio of artificial intelligence research, high-performance systems, and real-world engineering"
                        editorialBadge="OUR INNOVATION"
                        editorialHeading={<>Engineered for Impact.<br />Powered by AI.</>}
                        paragraphs={[
                            "At HiveMind, projects are where theory transforms into application. Our research and engineering initiatives focus on developing cutting-edge artificial intelligence models, scalable software architectures, and high-performance computing pipelines designed to address real-world challenges.",
                            "From Large Language Models and computer vision systems to distributed computing and autonomous solutions, our members collaborate across disciplines to build, benchmark, and deploy ambitious technology with open-source impact."
                        ]}
                        highlightParagraph="Every project represents a commitment to technical excellence and continuous learning. Together, we push the boundaries of intelligent systems, turning innovative concepts into robust, production-grade applications."
                        catalogueBadge="FEATURED INITIATIVES"
                        catalogueTitle="THE HIVEMIND PROJECTS"
                    />

                    {/* Animated Cards Display Grid */}
                    {loading ? (
                        <Spinner label="Assembling Projects..." />
                    ) : projects.length === 0 ? (
                        <div className="py-20 text-center w-full">
                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No projects found</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full">
                            {projects.map(project => (
                                <motion.div
                                    key={project._id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: false, amount: 0.15 }}
                                >
                                    <ProjectCard project={project} onClick={setSelectedProject} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Project Details Modal Popup */}
            {selectedProject && (
                <Portal>
                    <div 
                        className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[999999] p-4 sm:p-6 animate-fade-in"
                        onClick={() => setSelectedProject(null)}
                    >
                        <div 
                            className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[88vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative text-left"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-none focus:outline-none z-20"
                                title="Close"
                            >
                                <CloseIcon size={20} />
                            </button>

                            {/* Modal Scrollable Body */}
                            <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                                    {/* Left Column: Image and Meta */}
                                    <div className="space-y-4">
                                        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/5">
                                            {selectedProject.thumbnail ? (
                                                <img src={selectedProject.thumbnail} alt={selectedProject.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/[0.01] text-white/20 select-none">
                                                    <span className="text-xs font-bold uppercase tracking-wider">No Cover Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                selectedProject.status === "Completed" ? "bg-green-500/10 border border-green-500/20 text-green-400" :
                                                selectedProject.status === "Ongoing" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                                                "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                                            }`}>
                                                {selectedProject.status}
                                            </span>
                                            {selectedProject.status === "Completed" && selectedProject.duration && (
                                                <span className="text-[10px] text-[#888888] font-bold uppercase tracking-wider">
                                                    Duration: {selectedProject.duration}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Title and Description */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white border-b border-white/5 pb-3 pr-8">
                                            {selectedProject.title}
                                        </h3>
                                        <div className="text-xs text-[#BBBBBB] leading-relaxed space-y-3 font-sans whitespace-pre-wrap text-justify [hyphens:auto] [text-justify:inter-word]">
                                            {selectedProject.description}
                                        </div>
                                    </div>
                                </div>

                                {/* Collaborators Section */}
                                <div className="border-t border-white/5 pt-5 space-y-4">
                                    <h4 className="text-[10px] font-black text-gold-primary uppercase tracking-widest">
                                        Project Collaborators
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Array.isArray(selectedProject.collaborators) && selectedProject.collaborators.length > 0 ? (
                                            selectedProject.collaborators.map((collab: any) => {
                                                if (!collab) return null;
                                                return (
                                                    <div key={collab._id} className="flex items-center justify-between bg-white/[0.01] border border-white/5 rounded-2xl p-3 hover:bg-white/[0.03] transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div 
                                                                className="w-10 h-10 p-[1px] bg-gradient-to-br from-gold-primary/30 to-gold-primary/80"
                                                                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                            >
                                                                <div 
                                                                    className="w-full h-full bg-[#0c0c0e] overflow-hidden flex items-center justify-center"
                                                                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                                                                >
                                                                    {collab.pic ? (
                                                                        <img src={collab.pic} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-[9px] font-bold uppercase text-white/40">
                                                                            {collab.fullname?.substring(0, 2).toUpperCase()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-extrabold text-white uppercase tracking-wide">
                                                                    {collab.fullname}
                                                                </span>
                                                                <span className="text-[9px] text-[#888888] font-bold uppercase tracking-wider mt-0.5">
                                                                    {collab.department} • {collab.batch}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 pr-1">
                                                            {collab.github && (
                                                                <a 
                                                                    href={collab.github} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#888888] hover:text-white transition-colors p-1"
                                                                    title="GitHub"
                                                                >
                                                                    <GitHubIcon size={14} className="" />
                                                                </a>
                                                            )}
                                                            {collab.Linkedin && (
                                                                <a 
                                                                    href={collab.Linkedin} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#888888] hover:text-gold-primary transition-colors p-1"
                                                                    title="LinkedIn"
                                                                >
                                                                    <LinkedInIcon size={14} className="" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <span className="text-[10px] text-white/30 italic">No collaborators list</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
}
