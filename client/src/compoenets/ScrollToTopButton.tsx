import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    useEffect(() => {
        const toggleVisibility = (e?: Event) => {
            const targetScrollTop = (e?.target as HTMLElement)?.scrollTop || 0;
            const windowScrollTop = window.scrollY || window.pageYOffset || 0;
            const docScrollTop = document.documentElement?.scrollTop || document.body?.scrollTop || 0;

            const maxScroll = Math.max(windowScrollTop, docScrollTop, targetScrollTop);

            if (maxScroll > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Check initial scroll state
        toggleVisibility();

        // Listen for scroll events on window, document, and all containers (using capture phase)
        window.addEventListener("scroll", toggleVisibility, true);

        return () => {
            window.removeEventListener("scroll", toggleVisibility, true);
        };
    }, [location.pathname]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isAdminRoute) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    key="scroll-to-top-button"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    whileHover={{ scale: 1.15, translateY: -4 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[99999] w-12 h-12 rounded-full bg-[#0c0c0e]/95 backdrop-blur-2xl border-2 border-[#FFC107] text-[#FFC107] flex items-center justify-center shadow-[0_0_25px_rgba(255,193,7,0.5)] hover:shadow-[0_0_40px_rgba(255,193,7,0.8)] hover:bg-[#FFC107] hover:text-black cursor-pointer group transition-[background-color,color,border-color,box-shadow] duration-300"
                    aria-label="Scroll to top"
                    title="Back to Top"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:-translate-y-1"
                    >
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
