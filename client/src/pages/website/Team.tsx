import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TeamManagementServices, { type TeamMember } from "../../services/admin/TeamManagementServices";
import { useBodyBackground } from "../../utils/hooks";
import { cardVariants } from "../../utils/motionVariants";
import { LinkedInIcon, GitHubIcon } from "../../compoenets/icons";
import PageHero from "../../compoenets/PageHero";
import AmbientGlow from "../../compoenets/AmbientGlow";
import Spinner from "../../compoenets/Spinner";
import Footer from "../../compoenets/Footer";

const HexagonCard = ({ member }: { member: TeamMember }) => {
    const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
    const [isActive, setIsActive] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const maxTilt = 15;
        const rotateX = -y * maxTilt;
        const rotateY = x * maxTilt;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
        });
        setIsActive(false);
    };

    return (
        <div
            onClick={() => setIsActive(!isActive)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative w-72 h-84 sm:w-80 sm:h-92 p-[1.5px] transition-transform duration-200 ease-out hover:shadow-[0_25px_55px_rgba(255,193,7,0.18)] cursor-pointer select-none"
            style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                transformStyle: "preserve-3d",
                ...tiltStyle
            }}
        >
            {/* Hexagonal Gold Border Background */}
            <div className={`absolute inset-0 bg-gradient-to-br from-gold-primary/30 to-gold-primary/80 group-hover:from-gold-primary group-hover:to-gold-light transition-all duration-300 ${isActive ? "from-gold-primary to-gold-light" : ""}`} />

            {/* Hexagonal Inner Content Wrapper */}
            <div
                className="relative w-full h-full bg-[#0c0c0e] overflow-hidden flex flex-col items-center justify-center"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
                {/* Profile Photo */}
                {member.pic ? (
                    <img
                        src={member.pic}
                        alt={member.fullname}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-white/[0.02] flex flex-col items-center justify-center text-white/40">
                        <span className="text-4xl font-extrabold uppercase tracking-widest">
                            {member.fullname.substring(0, 2)}
                        </span>
                    </div>
                )}

                {/* Hover / Tap overlay details */}
                <div
                    className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent flex flex-col items-center justify-end pb-10 sm:pb-12 px-6 text-center transition-opacity duration-300 z-10 select-none ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100"
                        }`}
                >
                    <div
                        className={`transition-transform duration-500 ease-out flex flex-col items-center w-full ${isActive ? "translate-y-0" : "transform translate-y-6 group-hover:translate-y-0"
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <span className="name-glow-transition text-base sm:text-lg font-extrabold uppercase tracking-wider block mb-1 select-none">
                                {member.fullname}
                            </span>
                            {member.role === "Faculty Mentor" && (
                                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full mt-1 mb-2 shadow-[0_0_10px_rgba(255,193,7,0.2)]">
                                    Faculty Mentor
                                </span>
                            )}
                            {member.department && member.department !== "Faculty" && (
                                <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-1">
                                    {member.department}
                                </span>
                            )}
                            <div
                                className={`h-[1.5px] bg-gradient-to-r from-transparent via-gold-primary to-transparent transition-all duration-500 ease-out mb-4 shadow-[0_0_8px_#FFC107] ${isActive ? "w-12" : "w-0 group-hover:w-12"
                                    }`}
                            />
                        </div>

                        {/* Social links */}
                        <div className="flex items-center justify-center gap-4">
                            {member.Linkedin && (
                                <a
                                    href={member.Linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-10 h-10 social-btn social-btn-linkedin group"
                                    title="LinkedIn"
                                >
                                    <LinkedInIcon />
                                </a>
                            )}
                            {member.github && (
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-10 h-10 social-btn social-btn-github group"
                                    title="GitHub"
                                >
                                    <GitHubIcon />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Team() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useBodyBackground("/assets/backgrounds/gb.webp");

    useEffect(() => {
        document.title = "HiveMind | Our Team";
        TeamManagementServices.getTeamMembers()
            .then(res => {
                if (res.success && res.members) {
                    setTeamMembers(res.members);
                }
            })
            .catch(() => { })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const facultyMentors = teamMembers.filter(m => m.role === "Faculty Mentor");
    const studentMembers = teamMembers.filter(m => m.role !== "Faculty Mentor");

    return (
        <div className="min-h-screen bg-transparent text-white flex flex-col relative overflow-x-clip">
            {/* Dark overlay backdrop to keep content readable */}
            <div className="fixed inset-0 bg-[#050505]/45 z-0 pointer-events-none" />

            <AmbientGlow />

            <main className="flex-1 z-10 pt-6 md:pt-10 pb-16 flex flex-col items-center justify-start">
                <section className="relative flex flex-col items-center bg-transparent text-white pt-2 pb-16 md:pt-4 md:pb-24 px-6 md:px-[10%] z-10 w-full" id="team">
                    <PageHero
                        badge="THE MINDS BEHIND THE HIVE"
                        title="MEET OUR TEAM"
                        subtitle="A collective of curious minds building, learning, and innovating together"
                        editorialBadge="OUR COLLECTIVE"
                        editorialHeading={<>Built by People.<br />Driven by Curiosity.</>}
                        paragraphs={[
                            "HiveMind brings together individuals with diverse skills, ideas, and perspectives, united by a shared passion for technology, research, and innovation. We believe that meaningful ideas emerge when curious minds come together — sharing knowledge, challenging perspectives, and learning from one another.",
                            "Our members explore emerging technologies, collaborate on ambitious projects, experiment with new ideas, and transform curiosity into practical solutions. Every contribution brings a unique perspective to the collective."
                        ]}
                        highlightParagraph="At HiveMind, growth is not an individual journey. Every member brings their own strengths and experiences while learning alongside others. Together, we create an environment where ideas evolve, skills grow, and people build things that matter."
                        catalogueBadge="OUR PEOPLE"
                        catalogueTitle="THE HIVEMIND COLLECTIVE"
                    />

                    {loading ? (
                        <Spinner label="Assembling Crew..." />
                    ) : teamMembers.length === 0 ? (
                        <div className="py-20 text-center">
                            <span className="text-xs text-[#666666] uppercase tracking-widest block font-black">No team members found</span>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center gap-16">
                            {/* Faculty Mentors Section at top */}
                            {facultyMentors.length > 0 && (
                                <div className="w-full flex flex-col items-center">
                                    <div className="text-center mb-8">
                                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-gold-primary bg-gold-primary/10 border border-gold-primary/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,193,7,0.15)] inline-block mb-3">
                                            FACULTY GUIDANCE
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white">
                                            FACULTY MENTORS
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-7xl w-full">
                                        {facultyMentors.map(member => (
                                            <motion.div
                                                key={member._id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: false, amount: 0.15 }}
                                            >
                                                <HexagonCard member={member} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Core Team / Student Members Section */}
                            {studentMembers.length > 0 && (
                                <div className="w-full flex flex-col items-center">
                                    {facultyMentors.length > 0 && (
                                        <div className="text-center mb-8">
                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white/50 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block mb-3">
                                                MEMBERS
                                            </span>
                                            <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white">
                                                CORE TEAM & RESEARCHERS
                                            </h3>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-7xl w-full">
                                        {studentMembers.map(member => (
                                            <motion.div
                                                key={member._id}
                                                variants={cardVariants}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: false, amount: 0.15 }}
                                            >
                                                <HexagonCard member={member} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
