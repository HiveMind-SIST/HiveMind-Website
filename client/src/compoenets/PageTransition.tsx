import { type ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
    children: ReactNode;
    deferUntil?: boolean;
}

export default function PageTransition({ children, deferUntil = false }: PageTransitionProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!deferUntil) {
            const timer = setTimeout(() => {
                setIsMounted(true);
            }, 100);

            return () => clearTimeout(timer);
        } else {
            setIsMounted(false);
        }
    }, [deferUntil]);

    return (
        <div
            className={`transition-all duration-[1200ms] cubic-bezier(0.16,1,0.3,1) ${
                isMounted ? "opacity-100 translate-y-0 filter blur-0" : "opacity-0 translate-y-12 filter blur-[2px]"
            }`}
        >
            {children}
        </div>
    );
}
