import { useEffect } from "react";
import HeroSection from "../../compoenets/HeroSection";
import Footer from "../../compoenets/Footer";
import AboutSlideshow from "../../compoenets/AboutSlideshow";
import { motion } from "framer-motion";
import { useCommunitySettings } from "../../utils/hooks";
import { cardVariants } from "../../utils/motionVariants";

// ==========================================
// ABOUT SECTION COMPONENT
// ==========================================
interface AboutSectionProps {
    settings?: {
        communityName: string;
        aboutCommunity: string;
    } | null;
}

function AboutSection({ settings }: AboutSectionProps) {
    const title = settings?.communityName
        ? `About ${settings.communityName}`
        : "About";
    const description = settings?.aboutCommunity || "";

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-[#F5F3ED] py-16 md:py-24 px-6 md:px-[10%] z-10" id="about">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
            >
                <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                    Overview
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-8 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                    {title}
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="w-full max-w-4xl mx-auto mb-10"
            >
                <p className="text-base md:text-lg leading-[1.8] text-[#CCCCCC] text-justify [hyphens:auto] [text-justify:inter-word]" lang="en">
                    {description}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                className="w-full max-w-4xl mx-auto"
            >
                <AboutSlideshow />
            </motion.div>
        </section>
    );
}

// ==========================================
// MISSION SECTION COMPONENT
// ==========================================
function MissionSection() {
    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-[#F5F3ED] py-16 md:py-24 px-6 md:px-[10%] z-10" id="mission">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
            >
                <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                    Our Purpose
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                    Mission of HiveMind
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full max-w-7xl">
                {/* Pillar 1: Innovate */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 lg:p-12 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center justify-between min-h-[360px] lg:min-h-[390px] hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-7 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        </div>
                        <h3 className="relative z-10 text-xl font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                            Innovate
                        </h3>
                    </div>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word] font-normal mt-auto" lang="en">
                        Curiosity-driven exploration of frontier intelligence. We dive deep into cutting-edge machine learning literature, dissect novel neural architectures, and push beyond conventional boundaries.
                    </p>
                </motion.div>

                {/* Pillar 2: Engineer */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 lg:p-12 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center justify-between min-h-[360px] lg:min-h-[390px] hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-7 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="16" height="16" x="4" y="4" rx="2" />
                                <rect width="6" height="6" x="9" y="9" rx="1" />
                                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                            </svg>
                        </div>
                        <h3 className="relative z-10 text-xl font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                            Engineer
                        </h3>
                    </div>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word] font-normal mt-auto" lang="en">
                        Translating theoretical breakthroughs into high-performance systems. In the AI Supercomputing Lab, we write clean code, build autonomous AI agents, deploy custom LLM pipelines, and contribute to open-source software.
                    </p>
                </motion.div>

                {/* Pillar 3: Impact */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 lg:p-12 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center justify-between min-h-[360px] lg:min-h-[390px] hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-7 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                            </svg>
                        </div>
                        <h3 className="relative z-10 text-xl font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                            Impact
                        </h3>
                    </div>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word] font-normal mt-auto" lang="en">
                        Deploying tangible AI solutions that drive real-world change. We channel our projects into national hackathons, research publications, intellectual property patents, and production-grade applications.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

// ==========================================
// VISION SECTION COMPONENT
// ==========================================
function VisionSection() {
    const visionPillars = [
        {
            title: "Empowering Next-Gen AI Talent",
            desc: "Bridging the gap between academic theory and bleeding-edge research by training student engineers to solve real-world industry problems.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            )
        },
        {
            title: "Democratizing High-Performance Computing",
            desc: "Providing access to high-end GPU clusters at the AI Supercomputing Lab to foster ambitious student-led builds and massive model training.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
            )
        },
        {
            title: "Pioneering Open & Ethical Research",
            desc: "Advancing open-source intelligence pipelines and transparent, human-aligned AI agents that contribute positively to the scientific community.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-primary">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            )
        }
    ];

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-[#F5F3ED] py-16 md:py-24 px-6 md:px-[10%] z-10" id="vision">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
            >
                <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                    Our Horizon
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                    Vision of HiveMind
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full max-w-6xl items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:col-span-5 relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[320px] shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent" />
                    <div>
                        <div className="text-gold-primary text-4xl font-serif mb-4 leading-none select-none">“</div>
                        <p className="text-base sm:text-lg leading-relaxed text-[#DDDDDD] font-medium text-justify [hyphens:auto] [text-justify:inter-word] italic mb-6">
                            To serve as a premier incubator of intelligence at Sathyabama Institute of Science and Technology, driving collaborative boundaries and equipping the next generation of engineers to reshape the landscape of Artificial Intelligence.
                        </p>
                    </div>
                    <span className="text-[9px] font-black text-gold-primary uppercase tracking-[0.25em]">
                        HiveMind Community
                    </span>
                </motion.div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                    {visionPillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                            className="flex gap-5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-[border-color,background-color] duration-300"
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
                                {pillar.icon}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-base font-bold text-white uppercase tracking-wide">
                                    {pillar.title}
                                </h3>
                                <p className="text-sm text-[#AAAAAA] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word]">
                                    {pillar.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ==========================================
// TESTIMONIALS SECTION COMPONENT
// ==========================================
interface TestimonialsSectionProps {
    settings?: {
        communityVoices: Array<{
            name: string;
            title: string;
            description: string;
            pic?: string;
        }>;
    } | null;
}

function TestimonialsSection({ settings }: TestimonialsSectionProps) {
    const sourceList = settings?.communityVoices && settings.communityVoices.length > 0
        ? settings.communityVoices
        : [];

    if (sourceList.length === 0) {
        return null;
    }

    const duplicatedTestimonials = [...sourceList, ...sourceList];

    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-[#F5F3ED] py-16 md:py-24 px-6 md:px-[10%] z-10 overflow-hidden" id="testimonials">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center w-full animate-scroll-scale"
            >
                <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                    Testimonials
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-center mb-14 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                    Community Voices
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="relative w-full max-w-7xl overflow-hidden py-4 mask-marquee"
            >
                <div className="flex animate-marquee gap-8 cursor-pointer">
                    {duplicatedTestimonials.map((t, index) => {
                        const initials = t.name
                            ? t.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                            : "U";
                        return (
                            <div
                                key={index}
                                className="relative w-[320px] md:w-[420px] flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-gold-primary/20 hover:bg-white/[0.04]"
                            >
                                <div className="absolute top-4 right-6 text-4xl text-gold-primary/10 font-serif select-none pointer-events-none">“</div>
                                <p className="relative z-10 text-xs md:text-sm text-[#DDDDDD] leading-relaxed italic mb-6 break-words [word-break:break-word] overflow-hidden">"{t.description}"</p>
                                <div className="flex items-center gap-4">
                                    {t.pic ? (
                                        <img
                                            src={t.pic}
                                            alt={t.name}
                                            className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-[0_0_8px_rgba(255,193,7,0.2)]"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(255,193,7,0.2)]">
                                            {initials}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm font-bold text-white">{t.name}</span>
                                        <span className="text-[10px] text-[#888888] mt-0.5">{t.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}

// ==========================================
// HOME PAGE CONTAINER
// ==========================================
export default function Home({ showSplash }: { showSplash?: boolean }) {
    const { settings } = useCommunitySettings();

    useEffect(() => {
        document.title = "HiveMind - Artificial Intelligence Community";
    }, []);

    return (
        <>
            <main>
                <HeroSection settings={settings} showSplash={showSplash} />
                <AboutSection settings={settings} />
                <MissionSection />
                <VisionSection />
                <TestimonialsSection settings={settings} />
            </main>
            <Footer />
        </>
    );
}
