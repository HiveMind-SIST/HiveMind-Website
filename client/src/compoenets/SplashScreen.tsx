import { useEffect, useState } from "react";
import CommunitySettingsServices from "../services/admin/CommunitySettingsServices";

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [logoVisible, setLogoVisible] = useState(false);
    const [revealText, setRevealText] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [communityName, setCommunityName] = useState("HIVEMIND");

    useEffect(() => {
        CommunitySettingsServices.getSettings()
            .then(res => {
                if (res && res.success && res.settings?.communityName) {
                    setCommunityName(res.settings.communityName);
                }
            })
            .catch(() => {});
    }, []);

    // ==========================================
    // BODY SCROLL LOCK
    // ==========================================
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // ==========================================
    // ANIMATION TIMELINE TIMERS
    // ==========================================
    useEffect(() => {
        // 1. Fade in logo in the center
        const timer1 = setTimeout(() => {
            setLogoVisible(true);
        }, 100);

        // 2. Slide logo to the left and reveal the text "HiveMind"
        const timer2 = setTimeout(() => {
            setRevealText(true);
        }, 1200);

        // 3. Fade out the entire splash screen
        const timer3 = setTimeout(() => {
            setFadeOut(true);
        }, 2600);

        // 4. Complete splash screen and unmount
        const timer4 = setTimeout(() => {
            onComplete();
        }, 3200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 w-full h-full bg-[#050505] z-[9999] flex items-center justify-center transition-all duration-700 ease-in-out ${
                fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
            }`}
        >
            {/* Circling Border container */}
            <div className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-1000 ease-out">
                {/* Rotating conic gradient using only white, gold, and light gold (website defined colors) */}
                <div 
                    className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_30%,#FFC107_50%,#FFFFFF_60%,#FFD54F_75%,transparent_100%)] animate-[spin_2.5s_linear_infinite]"
                    style={{ zIndex: 1 }}
                />
                
                {/* Inner card container */}
                <div 
                    className="relative z-10 bg-[#050505] rounded-full px-8 py-5 flex items-center gap-4 md:gap-6 shadow-[0_0_50px_rgba(255,193,7,0.15)] transition-all duration-1000 ease-out"
                    style={{ zIndex: 2 }}
                >
                    {/* Logo wrapper */}
                    <div
                        className={`transition-all duration-700 ease-out flex items-center justify-center ${
                            logoVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                        }`}
                    >
                        <img
                            src="/assets/logos/HiveMind_logo_bg_removed.webp"
                            alt="HiveMind Logo"
                            decoding="async"
                            className="h-14 w-auto md:h-18 filter drop-shadow-[0_0_15px_rgba(255,193,7,0.4)]"
                        />
                    </div>

                    {/* Text reveal wrapper */}
                    <div
                        className={`overflow-hidden transition-all duration-1000 ease-out flex items-center ${
                            revealText ? "max-w-[600px] opacity-100" : "max-w-0 opacity-0"
                        }`}
                    >
                        <span className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest select-none whitespace-nowrap pl-1 text-gold-sweep drop-shadow-[0_0_15px_rgba(255,193,7,0.35)]">
                            {communityName}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
