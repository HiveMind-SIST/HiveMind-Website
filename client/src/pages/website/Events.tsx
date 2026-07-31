import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCommunitySettings } from "../../utils/hooks";

const HexSwarm = () => {
    const d = 34.64;
    const centers = [
        { x: 100, y: 100, delay: 0 },
        { x: 100, y: 100 - d, delay: 0.25 },
        { x: 100 + 30, y: 100 - 17.32, delay: 0.5 },
        { x: 100 + 30, y: 100 + 17.32, delay: 0.75 },
        { x: 100, y: 100 + d, delay: 1.0 },
        { x: 100 - 30, y: 100 + 17.32, delay: 1.25 },
        { x: 100 - 30, y: 100 - 17.32, delay: 1.5 }
    ];

    const getHexPoints = (cx: number, cy: number, r: number) => {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 - 30) * Math.PI / 180;
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return points.join(" ");
    };

    return (
        <svg viewBox="0 0 200 200" className="w-36 h-36 md:w-44 md:h-44 filter drop-shadow-[0_0_20px_rgba(255,193,7,0.3)]">
            {centers.map((c, idx) => (
                <motion.polygon
                    key={idx}
                    points={getHexPoints(c.x, c.y, 16)}
                    className="fill-black/60 stroke-gold-primary"
                    strokeWidth="1.5"
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        fill: ["rgba(255,193,7,0.02)", "rgba(255,193,7,0.3)", "rgba(255,193,7,0.02)"],
                        stroke: ["#FFC107", "#FFD54F", "#FFC107"]
                    }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        delay: c.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </svg>
    );
};

export default function Events() {
    const { settings } = useCommunitySettings();

    useEffect(() => {
        document.title = "HiveMind | Events";
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const communityName = settings?.communityName || "";

    return (
        <div
            className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full bg-[#050505] text-white flex flex-col relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assets/backgrounds/gb.webp')" }}
        >
            <div className="absolute inset-0 bg-[#040406]/20 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)] z-0"></div>

            <div className="absolute top-[30%] left-[20%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(255,193,7,0.06)_0%,transparent_70%)] pointer-events-none z-0 filter blur-[90px]" />

            <main className="flex-1 z-10 flex flex-col items-center justify-center px-6 overflow-hidden">
                <div className="relative flex flex-col items-center justify-center max-w-lg w-full text-center py-2">
                    <div className="relative mb-6 flex items-center justify-center">
                        <HexSwarm />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-4 px-4"
                    >
                        <span className="text-[10px] font-bold text-gold-primary uppercase tracking-[0.4em] [text-shadow:0_0_10px_rgba(255,193,7,0.3)]">
                            STATUS • STANDBY
                        </span>
                        
                        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-white via-white to-gold-light bg-clip-text text-transparent">
                            Stay tuned for events
                        </h1>

                        <p className="text-xs sm:text-sm text-[#888888] max-w-sm mx-auto leading-relaxed">
                            No events currently running. {communityName} is planning the next big workshop, hackathon, and developer meetup. Check back soon!
                        </p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
