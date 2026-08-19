import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CommunitySettingsServices, { type ICommunitySettings } from "../services/admin/CommunitySettingsServices";
import HoneycombPattern from "./HoneycombPattern";
import { GitHubIcon, LinkedInIcon, InstagramIcon, LocationIcon, EmailIcon, PhoneIcon } from "./icons";
import { columnVariants } from "../utils/motionVariants";

export default function Footer() {
    const location = useLocation();
    const [settings, setSettings] = useState<ICommunitySettings | null>(null);

    useEffect(() => {
        CommunitySettingsServices.getSettings()
            .then((res) => {
                if (res.success && res.settings) {
                    setSettings(res.settings);
                }
            })
            .catch(() => {});
    }, []);

    const formatPhoneNumber = (num: string) => {
        const cleaned = num.replace(/[\s()\-]/g, "");
        if (cleaned.startsWith("+91") && cleaned.length === 13) {
            return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
        }
        if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
            return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        return num;
    };

    const communityName = settings?.communityName || "";
    const primaryEmail = settings?.primaryEmail || "hivemindsist@gmail.com";
    const githubUrl = settings?.github || "";
    const linkedinUrl = settings?.linkedin || "";
    const instagramUrl = settings?.instagram || "";
    const addressLocation = settings?.location || "";
    const contactNumber = settings?.contactNumber || "";
    const displayPhone = formatPhoneNumber(contactNumber);
    const cleanTelNumber = contactNumber.startsWith("+") ? contactNumber : `+91${contactNumber}`;

    return (
        <footer className="relative bg-[#050505] text-white border-t border-white/5 pt-16 pb-8 px-6 md:px-[10%] z-20 overflow-hidden">
            {/* Visual background treatment */}
            <HoneycombPattern />

            {/* Radial glow behind brand area */}
            <div className="absolute top-0 left-[-5%] w-[40%] h-[55%] bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_75%)] pointer-events-none z-0 blur-[40px]" />

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Center-aligned Logo & Community Name at the top */}
                <div className="flex flex-col items-center justify-center mb-12 text-center select-none">
                    <Link
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        className="group flex flex-col items-center gap-4 no-underline cursor-pointer"
                    >
                        <img
                            src="/assets/logos/HiveMind_logo_bg_removed.webp"
                            alt="HiveMind Logo"
                            className="h-20 w-auto filter drop-shadow-[0_0_15px_rgba(255,193,7,0.4)] transition-transform duration-500 group-hover:scale-108 group-hover:rotate-2"
                        />
                        <span className="text-3xl md:text-5xl font-black uppercase tracking-[0.3em] bg-gradient-to-r from-white via-[#DDDDDD] to-gold-primary bg-clip-text text-transparent [text-shadow:0_0_15px_rgba(255,193,7,0.15)]">
                            {communityName}
                        </span>
                    </Link>
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/30 to-transparent mt-4" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-8 items-start pb-12">
                    {/* COLUMN 1: BRAND */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <div className="flex flex-col gap-0.5 mt-1">
                            <span className="text-[11px] font-bold tracking-wider text-[#AAAAAA] uppercase">
                                Engineering Intelligence.
                            </span>
                            <span className="text-[11px] font-black tracking-[0.18em] text-gold-primary uppercase">
                                BUILDING THE FUTURE.
                            </span>
                        </div>

                        <p className="text-[11px] text-[#777777] leading-relaxed max-w-[260px] font-medium mt-2">
                            A community of innovators, researchers, and developers building intelligent systems and exploring emerging technologies.
                        </p>
                    </motion.div>

                    {/* COLUMN 2: EXPLORE */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Explore
                        </span>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                            <li>
                                <Link
                                    to="/"
                                    onClick={(e) => {
                                        if (location.pathname === "/") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Team
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* COLUMN 3: COMMUNITY */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Community
                        </span>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                            <li>
                                <Link
                                    to="/join"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Join HiveMind
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/projects"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/events"
                                    className="group flex items-center gap-1.5 text-xs text-[#888888] hover:text-gold-primary transition-all duration-300 transform hover:translate-x-1.5 font-semibold uppercase tracking-wider py-0.5"
                                >
                                    <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 text-gold-primary text-[10px] font-black">
                                        ➔
                                    </span>
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* COLUMN 4: CONNECT */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.25em] mb-1">
                            Connect
                        </span>

                        <div className="flex items-center gap-3.5 mt-1">
                            {/* GitHub */}
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-github group"
                                aria-label="Follow HiveMind on GitHub"
                            >
                                <GitHubIcon />
                            </a>
                            {/* LinkedIn */}
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-linkedin group"
                                aria-label="Connect with HiveMind on LinkedIn"
                            >
                                <LinkedInIcon />
                            </a>
                            {/* Instagram */}
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-instagram group"
                                aria-label="Follow HiveMind on Instagram"
                            >
                                <InstagramIcon />
                            </a>
                        </div>

                        {/* Contact details with icons */}
                        <div className="flex flex-col gap-3 mt-2 text-[11px] text-[#777777] leading-relaxed font-medium">
                            <div className="flex items-center gap-2">
                                <LocationIcon />
                                <a
                                    href="https://www.sathyabama.ac.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-gold-primary text-[#777777] transition-colors no-underline text-left"
                                >
                                    {addressLocation}
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <EmailIcon />
                                <a href={`mailto:${primaryEmail}`} className="hover:text-gold-primary text-[#777777] transition-colors no-underline">
                                    {primaryEmail}
                                </a>
                            </div>

                            {contactNumber && (
                                <div className="flex items-center gap-2">
                                    <PhoneIcon />
                                    <a href={`tel:${cleanTelNumber.replace(/\s+/g, '')}`} className="hover:text-gold-primary text-[#777777] transition-colors no-underline">
                                        {displayPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-center text-[10px] text-[#555555] uppercase tracking-widest font-black text-center w-full">
                    <div>
                        © {new Date().getFullYear()} {communityName}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
