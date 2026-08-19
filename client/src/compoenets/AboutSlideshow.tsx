import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideItem {
    src: string;
    alt: string;
    caption?: string;
}

const SLIDES: SlideItem[] = [
    {
        src: "/assets/images/1.png",
        alt: "HiveMind AI Community Workshop",
        caption: "Innovating & Collaborating Together",
    },
    {
        src: "/assets/images/2.jpeg",
        alt: "HiveMind Team & Mentors",
        caption: "Hands-on Technical Sessions",
    },
    {
        src: "/assets/images/3.png",
        alt: "HiveMind Community Gathering",
        caption: "Building Intelligent Systems",
    },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.96,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: "spring" as const, stiffness: 260, damping: 28 },
            opacity: { duration: 0.45 },
            scale: { duration: 0.45 },
        },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.96,
        transition: {
            x: { type: "spring" as const, stiffness: 260, damping: 28 },
            opacity: { duration: 0.35 },
        },
    }),
};

export default function AboutSlideshow() {
    const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 0]);
    const [isHovered, setIsHovered] = useState(false);

    // Preload all slideshow images for seamless instant transitions
    useEffect(() => {
        SLIDES.forEach((slide) => {
            const img = new Image();
            img.src = slide.src;
        });
    }, []);

    const paginate = useCallback(
        (newDirection: number) => {
            setSlide(([prev]) => {
                let nextIndex = prev + newDirection;
                if (nextIndex < 0) nextIndex = SLIDES.length - 1;
                if (nextIndex >= SLIDES.length) nextIndex = 0;
                return [nextIndex, newDirection];
            });
        },
        []
    );

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;
        setSlide([index, index > currentSlide ? 1 : -1]);
    };

    // Auto-advance slideshow every 5 seconds (paused when hovered)
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 5000);
        return () => clearInterval(timer);
    }, [isHovered, paginate]);

    const activeSlide = SLIDES[currentSlide];

    return (
        <div
            className="relative w-full max-w-4xl mx-auto select-none group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Slide Frame */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.7)] bg-[#0A0A0A]">
                {/* Animated Slide */}
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -100 || offset.x < -60) {
                                paginate(1);
                            } else if (swipe > 100 || offset.x > 60) {
                                paginate(-1);
                            }
                        }}
                        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                    >
                        <img
                            src={activeSlide.src}
                            alt={activeSlide.alt}
                            className="w-full h-full object-cover object-center pointer-events-none"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Cinematic gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
                    </motion.div>
                </AnimatePresence>

                {/* Centered Bottom Pagination Dots / Pills */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
                    {SLIDES.map((_, index) => {
                        const isActive = index === currentSlide;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                                    isActive
                                        ? "w-7 h-2 bg-gold-primary shadow-[0_0_10px_rgba(255,193,7,0.8)]"
                                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
