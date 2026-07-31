import { useEffect } from "react";
import Portal from "./Portal";

interface ToastProps {
    message: string;
    type?: "error" | "success" | "info";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = "error", onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    // Border and icon styling based on notification type
    const isError = type === "error";
    const accentColor = isError ? "border-l-[#EF4444]" : "border-l-[#FFC107]";
    const iconColor = isError ? "text-[#EF4444]" : "text-[#FFC107]";

    return (
        <Portal>
            <div className="fixed top-6 right-6 z-[10000] animate-toast-slide-in">
            <div className={`flex items-center gap-3.5 bg-black/60 backdrop-blur-xl border border-white/10 ${accentColor} border-l-4 rounded-xl py-4 px-5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] max-w-sm w-80 text-left transition-all duration-300`}>
                {/* Type Icon */}
                <div className={`${iconColor} flex-shrink-0`}>
                    {isError ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </div>

                {/* Message text */}
                <div className="flex-1">
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                        {isError ? "Authentication Error" : "System Notification"}
                    </span>
                    <p className="text-xs text-white leading-relaxed mt-0.5 font-medium">{message}</p>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="text-[#888888] hover:text-white transition-colors cursor-pointer focus:outline-none"
                    aria-label="Dismiss toast"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    </Portal>
);
}
