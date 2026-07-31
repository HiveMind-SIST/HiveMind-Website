import { motion } from "framer-motion";

interface PageHeroProps {
    badge: string;
    title: string;
    subtitle: string;
    editorialBadge: string;
    editorialHeading: React.ReactNode;
    paragraphs: string[];
    highlightParagraph?: string;
    sectionId?: string;
    catalogueBadge?: string;
    catalogueTitle?: string;
}

export default function PageHero({
    badge,
    title,
    subtitle,
    editorialBadge,
    editorialHeading,
    paragraphs,
    highlightParagraph,
    sectionId = "hero",
    catalogueBadge,
    catalogueTitle,
}: PageHeroProps) {
    return (
        <>
            {/* --- UNIFIED HERO SECTION --- */}
            <div className="w-full flex flex-col items-center justify-center pt-20 md:pt-28 pb-12 md:pb-16 border-b border-white/5 relative" id={sectionId}>
                {/* Upper Hero Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center text-center px-4 mb-10 md:mb-14"
                >
                    <span className="text-xs font-bold text-gold-primary uppercase tracking-[0.3em] mb-3 [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                        {badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-wide text-center mb-4 bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                        {title}
                    </h2>
                    <p className="text-sm md:text-base text-[#888888] text-center max-w-xl leading-relaxed uppercase tracking-wider font-semibold">
                        {subtitle}
                    </p>
                </motion.div>

                {/* Lower Hero Content */}
                <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-4 items-start text-left">
                    {/* Left Side: Label & Heading */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="md:col-span-5 space-y-4"
                    >
                        <span className="text-[10px] sm:text-xs font-bold text-gold-primary uppercase tracking-[0.25em] [text-shadow:0_0_10px_rgba(255,193,7,0.2)] block">
                            {editorialBadge}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white leading-tight bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                            {editorialHeading}
                        </h3>
                    </motion.div>

                    {/* Visual Connector Line */}
                    <div className="hidden md:flex md:col-span-1 justify-center h-full min-h-[220px]">
                        <motion.div
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                            className="w-[1px] h-full min-h-[220px] bg-gradient-to-b from-gold-primary/40 via-gold-primary/10 to-transparent origin-top"
                        />
                    </div>

                    {/* Right Side: Paragraphs */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="md:col-span-6 space-y-6 text-sm sm:text-base leading-relaxed text-[#888888] font-medium"
                    >
                        {paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                        {highlightParagraph && (
                            <p className="text-white/70">{highlightParagraph}</p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* --- TRANSITION SECTION --- */}
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center py-20 w-full"
            >
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-white select-none">
                    TOGETHER, WE ARE <span className="text-gold-primary [text-shadow:0_0_8px_rgba(255,193,7,0.3)]">HIVEMIND.</span>
                </h4>

                <div className="w-[1px] h-20 relative mt-6 overflow-hidden">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-b from-gold-primary via-gold-primary/50 to-transparent origin-top"
                    />
                </div>
            </motion.div>

            {/* --- CATALOGUE HEADER --- */}
            {catalogueTitle && (
                <div className="w-full flex flex-col items-center justify-center mb-12 text-center">
                    {catalogueBadge && (
                        <span className="text-[9px] font-bold text-gold-primary/60 uppercase tracking-[0.25em] mb-2">
                            {catalogueBadge}
                        </span>
                    )}
                    <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                        {catalogueTitle}
                    </h2>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent mt-2" />
                </div>
            )}
        </>
    );
}
