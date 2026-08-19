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
            .catch(() => { });
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

    const communityName = settings?.communityName || "HiveMind";
    const primaryEmail = "hivemindsist@gmail.com";
    const githubUrl = settings?.github || "https://github.com/HiveMind-SIST";
    const linkedinUrl = settings?.linkedin || "https://linkedin.com/company/hivemindsist";
    const instagramUrl = settings?.instagram || "https://instagram.com/hivemindsist";
    const addressLocation = settings?.location || "AI Supercomputing Lab, School of Computing, Sathyabama Institute of Science and Technology";
    const contactNumber = settings?.contactNumber || "";
    const displayPhone = formatPhoneNumber(contactNumber);
    const cleanTelNumber = contactNumber.startsWith("+") ? contactNumber : `+91${contactNumber}`;

    return (
        <footer className="relative bg-gradient-to-b from-[#050505] via-[#120E06] to-[#050505] text-[#F5F3ED] border-t border-[#D6A84F]/25 pt-16 pb-8 px-6 md:px-[10%] z-20 overflow-hidden shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
            {/* Visual background treatment */}
            <HoneycombPattern />

            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D6A84F] to-transparent z-10" />

            {/* Ambient golden glow behind brand area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[radial-gradient(ellipse_at_top,rgba(214,168,79,0.12)_0%,transparent_70%)] pointer-events-none z-0 blur-[60px]" />

            <div className="relative max-w-7xl mx-auto z-10">
                {/* Center-aligned Logo & Community Name at the top (Stable, clean branding) */}
                <div className="flex flex-col items-center justify-center mb-14 text-center select-none">
                    <Link
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        className="flex flex-col items-center gap-3.5 no-underline cursor-pointer"
                    >
                        <img
                            src="/assets/logos/HiveMind_logo_bg_removed.webp"
                            alt="HiveMind Logo"
                            className="h-16 md:h-20 w-auto filter drop-shadow-[0_0_16px_rgba(214,168,79,0.4)]"
                        />
                        <span className="text-2xl md:text-4xl font-black uppercase tracking-[0.25em] bg-gradient-to-r from-[#F5F3ED] via-[#F0C766] to-[#D6A84F] bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(214,168,79,0.3)]">
                            {communityName}
                        </span>
                    </Link>
                    <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D6A84F] to-transparent mt-3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-10 items-start pb-12">
                    {/* COLUMN 1: BRAND IDENTITY */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#858278] uppercase">
                                Engineering Intelligence.
                            </span>
                            <span className="text-[11px] font-black tracking-[0.16em] text-[#D6A84F] uppercase [text-shadow:0_0_10px_rgba(214,168,79,0.3)]">
                                BUILDING THE FUTURE.
                            </span>
                        </div>

                        <p className="text-xs text-[#B8B5AA] leading-relaxed max-w-[270px] font-medium mt-1">
                            A student-driven AI and supercomputing community developing cutting-edge intelligence systems, machine learning models, and high-performance applications.
                        </p>
                    </motion.div>

                    {/* COLUMN 2: QUICK EXPLORE */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#F5F3ED] uppercase tracking-[0.25em] mb-1">
                            Navigation
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
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/team"
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/projects"
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Projects
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* COLUMN 3: COMMUNITY INITIATIVES */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#F5F3ED] uppercase tracking-[0.25em] mb-1">
                            Community
                        </span>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0 w-full">
                            <li>
                                <Link
                                    to="/join"
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Join HiveMind
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/events"
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/journey"
                                    className="text-xs text-[#B8B5AA] hover:text-[#D6A84F] transition-colors duration-200 font-medium tracking-wide py-0.5 inline-block"
                                >
                                    Journey
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    {/* COLUMN 4: CONNECT & CONTACT */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.1 }}
                        variants={columnVariants}
                        className="flex flex-col gap-4 items-start w-full"
                    >
                        <span className="text-[10px] font-black text-[#F5F3ED] uppercase tracking-[0.25em] mb-1">
                            Connect
                        </span>

                        {/* Social Brand Buttons (Full-circle color on hover) */}
                        <div className="flex items-center gap-3 mt-1">
                            {/* GitHub */}
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-github group bg-[#171714] border border-[#2A2A25] text-[#B8B5AA] hover:border-[#D6A84F]/50"
                                aria-label="Follow HiveMind on GitHub"
                            >
                                <GitHubIcon size={18} />
                            </a>
                            {/* LinkedIn */}
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-linkedin group bg-[#171714] border border-[#2A2A25] text-[#B8B5AA] hover:border-[#D6A84F]/50"
                                aria-label="Connect with HiveMind on LinkedIn"
                            >
                                <LinkedInIcon size={18} />
                            </a>
                            {/* Instagram */}
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 social-btn social-btn-instagram group bg-[#171714] border border-[#2A2A25] text-[#B8B5AA] hover:border-[#D6A84F]/50"
                                aria-label="Follow HiveMind on Instagram"
                            >
                                <InstagramIcon size={18} />
                            </a>
                        </div>

                        {/* Contact info list */}
                        <div className="flex flex-col gap-3 mt-3 text-xs text-[#B8B5AA] leading-relaxed font-medium w-full">
                            <div className="flex items-start gap-2.5">
                                <span className="p-1 rounded-md bg-[#171714] border border-[#D6A84F]/30 text-[#D6A84F] flex-shrink-0 mt-0.5">
                                    <LocationIcon size={13} />
                                </span>
                                <a
                                    href="https://www.sathyabama.ac.in/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#D6A84F] text-[#B8B5AA] transition-colors no-underline text-left"
                                >
                                    {addressLocation}
                                </a>
                            </div>

                            <div className="flex items-center gap-2.5">
                                <span className="p-1 rounded-md bg-[#171714] border border-[#D6A84F]/30 text-[#D6A84F] flex-shrink-0">
                                    <EmailIcon size={13} />
                                </span>
                                <a
                                    href={`mailto:${primaryEmail}`}
                                    className="hover:text-[#D6A84F] text-[#B8B5AA] transition-colors no-underline text-xs"
                                >
                                    {primaryEmail}
                                </a>
                            </div>

                            {contactNumber && (
                                <div className="flex items-center gap-2.5">
                                    <span className="p-1 rounded-md bg-[#171714] border border-[#D6A84F]/30 text-[#D6A84F] flex-shrink-0">
                                        <PhoneIcon size={13} />
                                    </span>
                                    <a
                                        href={`tel:${cleanTelNumber.replace(/\s+/g, '')}`}
                                        className="hover:text-[#D6A84F] text-[#B8B5AA] transition-colors no-underline"
                                    >
                                        {displayPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Copyright Section */}
                <div className="pt-8 mt-6 border-t border-[#D6A84F]/15 flex items-center justify-center text-[10px] text-[#858278] uppercase tracking-widest font-bold text-center w-full">
                    <div>
                        © {new Date().getFullYear()} {communityName}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
