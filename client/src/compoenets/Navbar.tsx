import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "./icons";

export default function Navbar({ showSplash = false }: { showSplash?: boolean }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const isLinkActive = (path: string) => location.pathname === path;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Our Team", path: "/team" },
        { name: "Projects", path: "/projects" },
        { name: "Events", path: "/events" },
    ];

    const isAdminRoute = location.pathname.startsWith("/admin");
    const isErrorRoute = location.pathname.startsWith("/error");
    const knownWebsiteRoutes = ["/", "/team", "/projects", "/events", "/journey", "/join"];
    const isKnownRoute = knownWebsiteRoutes.includes(location.pathname) || isAdminRoute;

    if (showSplash || isAdminRoute || isErrorRoute || !isKnownRoute) {
        return null;
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 w-full z-[100000] flex justify-between items-center px-5 md:px-12 h-16 md:h-20 py-3.5 transition-all duration-300 overflow-hidden ${
                    isScrolled
                        ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                        : "bg-black/40 backdrop-blur-md border-b border-white/5 shadow-2xl"
                }`}
            >
                {/* Ambient subtle glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-full bg-[radial-gradient(ellipse_at_top,rgba(214,168,79,0.06)_0%,transparent_70%)] pointer-events-none z-0 blur-[25px]" />

                {/* Logo Icon Only */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative z-10"
                >
                    <Link
                        to="/"
                        onClick={(e) => {
                            if (location.pathname === "/") {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        className="flex items-center no-underline group"
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gold-primary/25 rounded-full blur-md group-hover:bg-gold-primary/50 transition-all duration-300" />
                            <img
                                src="/assets/logos/HiveMind_logo_bg_removed.webp"
                                alt="HiveMind Logo"
                                className="w-8 h-8 md:w-9 md:h-9 object-contain relative z-10 filter drop-shadow-[0_0_16px_rgba(214,168,79,0.4)]"
                            />
                        </div>
                    </Link>
                </motion.div>

                {/* Desktop Navigation Links */}
                <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0 relative z-10">
                    {navLinks.map((link) => {
                        const isActive = isLinkActive(link.path);
                        return (
                            <li key={link.path} className="relative py-2">
                                <Link
                                    to={link.path}
                                    onClick={(e) => {
                                        if (link.path === "/" && location.pathname === "/") {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }
                                    }}
                                    className={`no-underline text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                                        isActive
                                            ? "text-gold-primary [text-shadow:0_0_12px_rgba(214,168,79,0.6)]"
                                            : "text-[#B8B5AA] hover:text-[#D6A84F]"
                                    }`}
                                >
                                    {link.name}
                                </Link>

                                {/* Active Underline */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            key="desktop-active-underline"
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            exit={{ scaleX: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6A84F] to-transparent shadow-[0_0_12px_#FFC107] origin-center"
                                        />
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ul>

                {/* Desktop Join Button */}
                <div className="hidden lg:block relative z-10">
                    <Link to="/join" className="no-underline">
                        <button className="bg-[#D6A84F] hover:bg-[#F0C766] text-[#0B0B0A] font-extrabold px-6 py-2.5 text-xs tracking-widest uppercase rounded-full cursor-pointer transition-all duration-200 border-none shadow-[0_2px_15px_rgba(214,168,79,0.35)] hover:shadow-[0_4px_22px_rgba(214,168,79,0.55)]">
                            Join HiveMind
                        </button>
                    </Link>
                </div>

                {/* Mobile Right Bar: JOIN US Pill Button + In-Place Hamburger/'X' Toggle */}
                <div className="flex lg:hidden items-center gap-3">
                    <Link to="/join" className="no-underline">
                        <button className="bg-[#D6A84F] hover:bg-[#F0C766] text-[#0B0B0A] font-extrabold text-[10px] sm:text-[11px] tracking-widest uppercase py-2 px-4.5 rounded-full transition-colors duration-200 cursor-pointer border-none shadow-[0_2px_10px_rgba(214,168,79,0.25)]">
                            JOIN US
                        </button>
                    </Link>

                    <motion.button
                        onClick={toggleMobileMenu}
                        whileTap={{ scale: 0.9 }}
                        className="text-white hover:text-gold-primary focus:outline-none cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                        aria-label="Toggle Mobile Menu"
                    >
                        <AnimatePresence mode="wait">
                            {isMobileMenuOpen ? (
                                <motion.div
                                    key="close-circle"
                                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                                >
                                    <CloseIcon size={16} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="hamburger-lines"
                                    initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="4" y1="6" x2="20" y2="6" />
                                        <line x1="4" y1="12" x2="20" y2="12" />
                                        <line x1="4" y1="18" x2="20" y2="18" />
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* Fullscreen Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[99999] bg-[#0B0B0B]/98 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 sm:px-10 select-none overflow-hidden"
                    >
                        {/* Background Radial Glow */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: "radial-gradient(circle at 50% 40%, rgba(255, 193, 7, 0.08) 0%, rgba(11, 11, 11, 0) 70%)"
                            }}
                        />

                        {/* Centered Navigation Links Stack */}
                        <motion.div
                            className="flex-1 flex flex-col justify-center items-center gap-7 text-center z-10 py-6"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={{
                                open: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                                closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                            }}
                        >
                            {navLinks.map((link) => {
                                const isActive = isLinkActive(link.path);
                                return (
                                    <motion.div
                                        key={link.path}
                                        variants={{
                                            open: { opacity: 1, x: 0, scale: 1 },
                                            closed: { opacity: 0, x: -30, scale: 0.95 },
                                        }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full flex flex-col items-center"
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={(e) => {
                                                setIsMobileMenuOpen(false);
                                                if (link.path === "/" && location.pathname === "/") {
                                                    e.preventDefault();
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }
                                            }}
                                            className={`text-2xl sm:text-3xl font-extrabold tracking-[0.15em] uppercase transition-all duration-300 no-underline py-1 flex flex-col items-center ${isActive
                                                ? "text-gold-primary drop-shadow-[0_0_15px_rgba(255,193,7,0.5)]"
                                                : "text-white/80 hover:text-gold-primary"
                                                }`}
                                        >
                                            <span>{link.name}</span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="mobile-active-underline"
                                                    className="h-[3px] w-12 bg-gradient-to-r from-gold-light via-gold-primary to-gold-light rounded-full mt-2 shadow-[0_0_10px_#FFC107]"
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Footer Note */}
                        <div className="w-full text-center z-10 pt-4 border-t border-white/5 text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase">
                            HiveMind &bull; Building Intelligence. Together.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
