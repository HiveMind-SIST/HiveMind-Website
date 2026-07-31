import { useEffect } from "react";
import HeroSection from "../../compoenets/HeroSection";
import Footer from "../../compoenets/Footer";
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
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="about">
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
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                className="w-full max-w-4xl mx-auto mb-10"
            >
                <picture>
                    <source srcSet="/assets/images/grp-pic.webp" type="image/webp" />
                    <img
                        src="/assets/images/grp-pic.jpg"
                        alt="HiveMind Community Group Photo"
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-2xl object-cover border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                    />
                </picture>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="w-full max-w-4xl mx-auto"
            >
                <p className="text-base md:text-lg leading-[1.8] text-[#CCCCCC] text-justify [hyphens:auto] [text-justify:inter-word]">
                    {description}
                </p>
            </motion.div>
        </section>
    );
}

// ==========================================
// MISSION SECTION COMPONENT
// ==========================================
function MissionSection() {
    return (
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="mission">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {/* Pillar 1: Explore */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M16.2 7.8l-2 5.6-5.6 2 2-5.6 5.6-2z" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Explore
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word]">
                        Curiosity-driven mapping of emerging AI fields. We dive deep into theoretical foundations, investigate new frameworks, and dissect cutting-edge literature to understand where technology is going.
                    </p>
                </motion.div>

                {/* Pillar 2: Build */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-1.8 0L2.5 6v12l3.25 1.76a1.79 1.79 0 0 0 1.8 0L16.5 14.6V9.4z" />
                            <path d="m7 4.75 9.5 5.45" />
                            <path d="M7 19.25V9.45" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Build
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word]">
                        Translating formulas into functional algorithms. In the AI Supercomputing Lab, we write clean code, build autonomous AI agents, deploy custom LLM pipelines, and contribute to open-source ecosystem.
                    </p>
                </motion.div>

                {/* Pillar 3: Advance */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -8 }}
                    viewport={{ once: false, amount: 0.15 }}
                    variants={cardVariants}
                    className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 sm:p-10 text-center transition-[border-color,box-shadow,background-color] duration-400 flex flex-col items-center hover:border-gold-primary/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),_0_0_20px_rgba(255,193,7,0.05)] overflow-hidden"
                >
                    <div className="relative z-10 w-[70px] h-[70px] rounded-full bg-white/5 border border-white/10 flex justify-center items-center mb-8 text-gold-primary transition-all duration-400 group-hover:bg-gold-primary group-hover:text-black group-hover:scale-110 shadow-[0_0_15px_rgba(255,193,7,0.05)] group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
                        </svg>
                    </div>
                    <h3 className="relative z-10 text-lg font-bold mb-4 text-white tracking-wider uppercase transition-colors duration-400 group-hover:text-gold-primary">
                        Advance
                    </h3>
                    <p className="relative z-10 text-sm text-[#A0A0A0] leading-relaxed text-justify [hyphens:auto] [text-justify:inter-word]">
                        Pioneering new solutions and publishing research. We channel our projects into hackathons, intellectual property patents, and academic research papers to push the frontier of student-led AI development.
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
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10" id="vision">
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
        <section className="relative flex flex-col items-center bg-[#050505] text-white py-16 md:py-24 px-6 md:px-[10%] border-b border-white/5 z-10 overflow-hidden" id="testimonials">
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
