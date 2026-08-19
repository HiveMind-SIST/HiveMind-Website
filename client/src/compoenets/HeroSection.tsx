import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { HERO_TYPEWRITER_WORDS } from "../utils/constants";

interface HeroSectionProps {
    settings?: {
        communityName: string;
        tagline?: string;
    } | null;
    showSplash?: boolean;
}

export default function HeroSection({ settings, showSplash }: HeroSectionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [gifLoaded, setGifLoaded] = useState(false);

    const communityName = settings?.communityName || "HiveMind SIST";
    const tagline = settings?.tagline || "Engineering Intelligence. Building the Future.";

    const splitName = (name: string) => {
        if (!name) return { first: "HiveMind", second: " SIST" };
        const spaceIdx = name.indexOf(" ");
        if (spaceIdx > 0) {
            return {
                first: name.substring(0, spaceIdx),
                second: name.substring(spaceIdx)
            };
        }
        for (let i = 1; i < name.length; i++) {
            const char = name[i];
            if (char === char.toUpperCase() && char !== char.toLowerCase()) {
                return {
                    first: name.substring(0, i),
                    second: " " + name.substring(i)
                };
            }
        }
        const mid = Math.ceil(name.length / 2);
        return {
            first: name.substring(0, mid),
            second: " " + name.substring(mid)
        };
    };

    const { first: firstPart, second: secondPart } = splitName(communityName);

    // ==========================================
    // TYPEWRITER EFFECT LOGIC
    // ==========================================
    const words = HERO_TYPEWRITER_WORDS;
    const [wordIndex, setWordIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typewriterText, setTypewriterText] = useState("");

    useEffect(() => {
        const currentWord = words[wordIndex % words.length];
        let timer: number;

        if (isDeleting) {
            timer = window.setTimeout(() => {
                setTypewriterText(currentWord.substring(0, charIndex - 1));
                setCharIndex((prev) => prev - 1);
            }, 50);
        } else {
            timer = window.setTimeout(() => {
                setTypewriterText(currentWord.substring(0, charIndex + 1));
                setCharIndex((prev) => prev + 1);
            }, 100);
        }

        if (!isDeleting && charIndex === currentWord.length) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
                setIsDeleting(false);
                setWordIndex((prev) => prev + 1);
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, wordIndex]);

    // ==========================================
    // HIGH PERFORMANCE CANVAS ENGINE
    // ==========================================
    useEffect(() => {
        const canvas = canvasRef.current;
        const heroSection = heroRef.current;
        if (!canvas || !heroSection) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let particles: Particle[] = [];

        const mouse = {
            x: null as number | null,
            y: null as number | null,
            radius: 120, // Interaction radius
        };

        const colors = ["#FFC107", "#FFD54F", "#FFFFFF"];

        class Particle {
            x: number;
            y: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;
            color: string;
            vx: number;
            vy: number;
            alpha: number;
            alphaChange: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 20 + 5;
                this.color = colors[Math.floor(Math.random() * colors.length)];

                // Movement vectors
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;

                // Twinkle effect
                this.alpha = Math.random();
                this.alphaChange = Math.random() * 0.02 + 0.005;
            }

            update() {
                // Slow floating movement
                this.x += this.vx;
                this.y += this.vy;

                // Screen wrap
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Twinkle logic
                this.alpha += this.alphaChange;
                if (this.alpha >= 1 || this.alpha <= 0.1) {
                    this.alphaChange *= -1;
                }

                // Mouse Interaction (Subtle Parallax / Repulsion)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const dirX = (dx / distance) * force * 0.5;
                        const dirY = (dy / distance) * force * 0.5;
                        this.x -= dirX;
                        this.y -= dirY;
                    }
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha * 0.6; // Keep particles subtle
                ctx.fill();
                ctx.globalAlpha = 1.0; // Reset
            }
        }

        function initSystems() {
            particles = [];
            for (let i = 0; i < 350; i++) {
                particles.push(new Particle());
            }
        }

        let animationFrameId: number;

        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Update & Draw Global Particles
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        // Boot Up
        const setupTimeout = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initSystems();
            animate();
        }, 100);

        // Event Listeners
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initSystems();
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Get mouse position relative to viewport
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            // Modify text glow intensity based on mouse distance to center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distToCenter = Math.hypot(mouse.x - centerX, mouse.y - centerY);
            const maxDist = Math.max(centerX, centerY);

            // Closer to center = brighter glow
            const glowVal = Math.max(15, 40 - (distToCenter / maxDist) * 30);
            heroSection.style.setProperty("--glow-intensity", `${glowVal}px`);
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
            heroSection.style.setProperty("--glow-intensity", "15px");
        };

        window.addEventListener("resize", handleResize);
        heroSection.addEventListener("mousemove", handleMouseMove);
        heroSection.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            clearTimeout(setupTimeout);
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            heroSection.removeEventListener("mousemove", handleMouseMove);
            heroSection.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section
            className="relative w-full h-screen min-h-[500px] flex justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed z-[1] overflow-hidden"
            id="hero-section"
            ref={heroRef}
            style={{ backgroundImage: "url('/assets/backgrounds/hero-bg.webp')" }}
        >
            <div className="absolute inset-0 bg-[#050505]/75 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-[2]"></div>
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050505] to-transparent z-[4] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-72 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505] z-[4] pointer-events-none" />

            <img
                src="/assets/backgrounds/bee_background.gif"
                alt="Center Atmospheric GIF"
                loading="lazy"
                decoding="async"
                onLoad={() => setGifLoaded(true)}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] max-w-[200vw] h-auto z-[3] pointer-events-none mix-blend-screen center-bg-gif-mask transition-opacity duration-1000 ${gifLoaded ? "opacity-85" : "opacity-0"
                    }`}
            />

            <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(255,193,7,0.08)_0%,transparent_60%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[3] pointer-events-none animate-[pulseGlowBg_6s_ease-in-out_infinite_alternate]"></div>
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[10px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(255,213,79,0.1)_40%,transparent_70%)] blur-[4px] z-[3] pointer-events-none"></div>

            <canvas id="fx-canvas" ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-[4] pointer-events-none"></canvas>

            {/* Centered Typography Content */}
            <motion.div
                className="relative z-[5] text-center select-none"
                initial="hidden"
                whileInView={showSplash ? "hidden" : "visible"}
                viewport={{ once: false, amount: 0.15 }}
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}
            >
                <motion.h1
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.95,
                            y: 30,
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }
                    }}
                    className="text-[clamp(2.5rem,8vw,8rem)] font-black tracking-tighter leading-[1.1] mb-6 uppercase drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] drop-shadow-[0_0_var(--glow-intensity,20px)_rgba(255,193,7,0.35)]"
                    id="main-heading"
                >
                    {/* Spans split for targeted canvas effects */}
                    <span className="gold-sweep-text inline-block" id="hive-target">
                        {firstPart}
                    </span>
                    <span className="hollow-glow-text inline-block">{secondPart}</span>
                </motion.h1>
                <motion.h2
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 1.0,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }
                    }}
                    className="relative inline-block text-[clamp(0.75rem,1.3vw,1.1rem)] font-bold text-[#E5E5E5] tracking-[0.3em] uppercase subheading-lines"
                >
                    {tagline}
                </motion.h2>

                {/* Typewriter Effect Container */}
                <motion.div
                    variants={{
                        hidden: {
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                duration: 1.0,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }
                    }}
                    className="mt-6 text-[clamp(1rem,2vw,1.3rem)] font-medium text-white tracking-widest"
                >
                    We explore <span className="text-gold-primary font-bold drop-shadow-[0_0_10px_rgba(255,193,7,0.4)]">{typewriterText}</span>
                    <span className="text-gold-primary font-bold cursor-blink">|</span>
                </motion.div>
            </motion.div>
        </section>
    );
}
