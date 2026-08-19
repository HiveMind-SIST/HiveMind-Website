import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface ErrorPageProps {
    code?: 404 | 401 | 403 | 500 | 503 | number;
    title?: string;
    description?: string;
}

const ERROR_CONFIGS: Record<number, { title: string; line1: string; line2: string; badge: string }> = {
    404: {
        title: "Page Not Found",
        line1: "The page you're looking for",
        line2: "doesn't exist.",
        badge: "PAGE NOT FOUND"
    },
    401: {
        title: "Authentication Required",
        line1: "You need authentication to access",
        line2: "this secure resource.",
        badge: "AUTHENTICATION REQUIRED"
    },
    403: {
        title: "Access Denied",
        line1: "You do not have permission to view",
        line2: "this protected page.",
        badge: "ACCESS FORBIDDEN"
    },
    500: {
        title: "Server Error",
        line1: "Our neural servers encountered",
        line2: "an unexpected error.",
        badge: "INTERNAL SERVER ERROR"
    },
    503: {
        title: "Under Maintenance",
        line1: "HiveMind systems are currently",
        line2: "undergoing scheduled upgrades.",
        badge: "SERVICE UNAVAILABLE"
    }
};

export default function ErrorPage({ code = 404, title, description }: ErrorPageProps) {
    const navigate = useNavigate();
    const TOTAL_SECONDS = 15;
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

    const defaultConfig = ERROR_CONFIGS[code] || {
        title: "Unexpected Error",
        line1: "An unexpected system exception",
        line2: "occurred.",
        badge: `${code} ERROR`
    };

    const finalTitle = title || defaultConfig.title;
    const badgeText = defaultConfig.badge;

    useEffect(() => {
        document.title = `HiveMind | ${code} - ${finalTitle}`;

        const originalBg = document.body.style.backgroundImage;
        const originalBgColor = document.body.style.backgroundColor;
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = "#050505";

        return () => {
            document.body.style.backgroundImage = originalBg;
            document.body.style.backgroundColor = originalBgColor;
        };
    }, [code, finalTitle]);

    // Auto-redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const progressPercentage = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-between relative overflow-hidden font-sans select-none px-6 py-10">
            {/* Background Layer: Deep Obsidian Space + Ambient Gold Glow + Starfield particles */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Radial Gold Ambient Glow Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(214,168,79,0.07)_0%,transparent_70%)] blur-[90px]" />

                {/* Subtle Starfield Particle Matrix */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:28px_28px] opacity-75" />
            </div>

            {/* Top Spacer / Subtle Logo Header */}
            <div className="w-full flex justify-center z-10 pt-2">
                <Link to="/" className="inline-flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity">
                    <img
                        src="/assets/logos/HiveMind_logo_bg_removed.webp"
                        alt="HiveMind"
                        className="w-6 h-6 object-contain"
                    />
                    <span className="text-xs font-black tracking-widest text-[#B8B5AA] group-hover:text-white uppercase transition-colors">
                        HiveMind
                    </span>
                </Link>
            </div>

            {/* Central Error Showcase */}
            <motion.div
                className="w-full max-w-xl text-center z-10 flex flex-col items-center my-auto py-8"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Giant 404 / Error Code in Gold Typography */}
                <h1 className="text-8xl sm:text-9xl md:text-[11.5rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D6A84F] to-[#735118] mb-3 filter drop-shadow-[0_20px_45px_rgba(214,168,79,0.3)]">
                    {code}
                </h1>

                {/* Eyebrow Label */}
                <span className="text-xs sm:text-sm font-extrabold tracking-[0.35em] text-[#888888] uppercase mb-8 [text-shadow:0_0_12px_rgba(214,168,79,0.2)]">
                    {badgeText}
                </span>

                {/* Message Description */}
                <div className="text-base sm:text-lg text-[#CCCCCC] leading-relaxed mb-8 max-w-md">
                    {description ? (
                        <p className="font-medium">{description}</p>
                    ) : (
                        <p className="font-medium">
                            {defaultConfig.line1} <span className="font-bold text-white block sm:inline">{defaultConfig.line2}</span>
                        </p>
                    )}
                </div>

                {/* Dual Action Buttons */}
                <div className="flex flex-row gap-4 items-center justify-center">
                    <Link
                        to="/"
                        className="bg-[#171714]/90 hover:bg-[#D6A84F] border border-[#D6A84F]/50 hover:border-[#D6A84F] text-[#F5F3ED] hover:text-[#0B0B0A] font-extrabold text-[11px] uppercase tracking-widest py-3 px-7 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(214,168,79,0.18)] hover:shadow-[0_0_25px_rgba(214,168,79,0.5)] no-underline flex items-center justify-center cursor-pointer"
                    >
                        Go Home
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-[#171714]/60 hover:bg-[#1f1f1a] border border-[#2A2A25] hover:border-[#D6A84F]/40 text-[#888888] hover:text-white font-bold text-[11px] uppercase tracking-widest py-3 px-7 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none"
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>

            {/* Bottom Auto-Redirect Countdown Bar */}
            <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-2 z-10 pb-4">
                <div className="flex items-center justify-between w-full text-[10px] font-bold text-[#888888] uppercase tracking-[0.25em]">
                    <span>Redirecting in</span>
                    <span className="text-[#D6A84F] font-black">{secondsLeft}s</span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#D6A84F] via-[#F0C766] to-[#D6A84F] shadow-[0_0_8px_#D6A84F]"
                        style={{ width: `${progressPercentage}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                    />
                </div>
            </div>
        </div>
    );
}
