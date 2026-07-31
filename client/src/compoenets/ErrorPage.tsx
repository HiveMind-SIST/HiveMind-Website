import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface ErrorPageProps {
    code?: 404 | 401 | 403 | 500 | 503 | number;
    title?: string;
    description?: string;
}

const ERROR_CONFIGS: Record<number, { title: string; description: string; badge: string }> = {
    404: {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist or has been moved.",
        badge: "404 ERROR"
    },
    401: {
        title: "Authentication Required",
        description: "Please sign in to access this page or resource.",
        badge: "401 UNAUTHORIZED"
    },
    403: {
        title: "Access Denied",
        description: "You don't have permission to view this resource.",
        badge: "403 FORBIDDEN"
    },
    500: {
        title: "Internal Server Error",
        description: "Something went wrong on our side. Please try again in a moment.",
        badge: "500 SERVER ERROR"
    },
    503: {
        title: "Service Unavailable",
        description: "HiveMind systems are currently undergoing brief maintenance.",
        badge: "503 MAINTENANCE"
    }
};

export default function ErrorPage({ code = 404, title, description }: ErrorPageProps) {
    const navigate = useNavigate();

    const defaultConfig = ERROR_CONFIGS[code] || {
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        badge: `${code} NOTICE`
    };

    const finalTitle = title || defaultConfig.title;
    const finalDescription = description || defaultConfig.description;
    const badgeText = defaultConfig.badge;

    useEffect(() => {
        document.title = `HiveMind | ${code} - ${finalTitle}`;
    }, [code, finalTitle]);

    return (
        <div className="h-screen max-h-screen w-full bg-[#0B0B0B] text-[#F5F5F5] flex flex-col items-center justify-between relative overflow-hidden font-sans select-none px-4 py-6 sm:py-8">
            
            {/* Background Layer: Radial Gold Glow & Ambient Tech Grid */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div 
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(circle at 50% 45%, rgba(255, 193, 7, 0.07) 0%, rgba(11, 11, 11, 0) 70%)"
                    }}
                />
                
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Top Spacer */}
            <div className="w-full h-2 z-10" />

            {/* Main Centered Content */}
            <motion.div 
                className="w-full max-w-lg text-center z-10 flex flex-col items-center my-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* HiveMind Animated Neural Core Graphic */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4 flex items-center justify-center">
                    
                    {/* Rotating Outer Hexagonal Ring */}
                    <motion.svg 
                        className="absolute inset-0 w-full h-full text-[#FFC107]/20"
                        viewBox="0 0 100 100"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        <polygon 
                            points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.5"
                            strokeDasharray="6 6"
                        />
                    </motion.svg>

                    {/* Counter-Rotating Inner Tech Ring */}
                    <motion.svg 
                        className="absolute inset-3 w-[85%] h-[85%] text-[#FFC107]/40"
                        viewBox="0 0 100 100"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    >
                        <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1"
                            strokeDasharray="4 8"
                        />
                    </motion.svg>

                    {/* Pulsing Glow Core behind Logo */}
                    <motion.div 
                        className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFC107]/15 blur-xl"
                        animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Central Hive Logo Card */}
                    <motion.div 
                        className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#141414] border border-[#FFC107]/30 flex items-center justify-center shadow-[0_0_25px_rgba(255,193,7,0.2)]"
                        animate={{ y: [-3, 3, -3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <img 
                            src="/assets/logos/HiveMind_logo_bg_removed.webp" 
                            alt="HiveMind Logo" 
                            className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
                        />
                    </motion.div>

                    {/* Animated Nodes / Signal Dots */}
                    <motion.div 
                        className="absolute top-2 left-1/2 w-2 h-2 rounded-full bg-[#FFC107]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                        className="absolute bottom-2 left-1/2 w-2 h-2 rounded-full bg-[#FFC107]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <motion.div 
                        className="absolute top-1/2 right-2 w-2 h-2 rounded-full bg-[#FFC107]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    />
                </div>

                {/* Badge Tag */}
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FFC107] bg-[#FFC107]/10 border border-[#FFC107]/20 px-3 py-0.5 rounded-full mb-2 select-none">
                    {badgeText}
                </span>

                {/* Large Gradient Error Code */}
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#FFC107] via-[#FFD54F] to-[#9E7A00] mb-1.5 drop-shadow-[0_10px_25px_rgba(255,193,7,0.15)]">
                    {code}
                </h1>

                {/* Error Title */}
                <h2 className="text-lg sm:text-xl font-extrabold text-[#F5F5F5] uppercase tracking-wider mb-1.5">
                    {finalTitle}
                </h2>

                {/* Concise Description */}
                <p className="text-xs sm:text-sm text-[#A8A8A8] max-w-sm mx-auto leading-relaxed mb-6 font-medium">
                    {finalDescription}
                </p>

                {/* Streamlined Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                    <Link
                        to="/"
                        className="bg-[#FFC107] hover:bg-[#FFD54F] text-[#0B0B0B] font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(255,193,7,0.2)] hover:shadow-[0_6px_20px_rgba(255,193,7,0.35)] transform hover:-translate-y-0.5 no-underline flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>Back to Home</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-[#141414] hover:bg-[#1A1A1A] border border-white/[0.08] hover:border-[#FFC107]/40 text-[#F5F5F5] hover:text-[#FFC107] font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Go Back</span>
                    </button>
                </div>
            </motion.div>

            {/* Minimal Non-Scrollable Footer */}
            <div className="w-full text-center z-10 text-[#A8A8A8]/40 text-[10px] font-medium tracking-wider pb-2">
                &copy; {new Date().getFullYear()} HiveMind &bull; Building Intelligence. Together.
            </div>
        </div>
    );
}
