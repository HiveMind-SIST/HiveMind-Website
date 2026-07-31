import { useState, useRef, useEffect } from "react";

interface CustomTimePickerProps {
    value: string; // HH:MM (24-hour format, e.g. 14:30)
    onChange: (val: string) => void;
    label?: string;
    required?: boolean;
}

export default function CustomTimePicker({ value, onChange, label, required }: CustomTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value
    const [hours, setHours] = useState("09");
    const [minutes, setMinutes] = useState("00");

    useEffect(() => {
        if (value) {
            const parts = value.split(":");
            if (parts.length === 2) {
                setHours(parts[0]);
                setMinutes(parts[1]);
            }
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectHour = (h: string) => {
        setHours(h);
        onChange(`${h}:${minutes}`);
    };

    const handleSelectMinute = (m: string) => {
        setMinutes(m);
        onChange(`${hours}:${m}`);
    };

    // Format display time as 12-hour AM/PM format
    const getDisplayTime = () => {
        if (!value) return "Select Time";
        const parts = value.split(":");
        if (parts.length !== 2) return value;
        const hInt = parseInt(parts[0]);
        const mStr = parts[1];
        const ampm = hInt >= 12 ? "PM" : "AM";
        const displayH = hInt % 12 === 0 ? 12 : hInt % 12;
        return `${displayH}:${mStr} ${ampm}`;
    };

    const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

    return (
        <div ref={containerRef} className="flex flex-col gap-2 relative text-left w-full select-none">
            {label && (
                <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">
                    {label} {required && "*"}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/[0.02] border border-white/5 hover:border-gold-primary/30 rounded-xl py-3 px-4 text-xs text-white cursor-pointer flex justify-between items-center min-h-[42px] transition-colors font-semibold"
            >
                <span>{getDisplayTime()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#121214] border border-white/10 rounded-xl shadow-2xl z-[9999] p-3 flex gap-4 h-[180px] animate-fade-in-up">
                    {/* Hours Column */}
                    <div className="flex-1 flex flex-col">
                        <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest text-center mb-1.5">Hours</span>
                        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                            {hourOptions.map((h) => {
                                const hInt = parseInt(h);
                                const isCurrent = hours === h;
                                const ampm = hInt >= 12 ? "PM" : "AM";
                                const displayH = hInt % 12 === 0 ? 12 : hInt % 12;
                                return (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => handleSelectHour(h)}
                                        className={`w-full py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border-none text-center ${
                                            isCurrent
                                                ? "bg-gold-primary text-[#050505] font-black shadow-[0_0_5px_rgba(255,193,7,0.2)]"
                                                : "bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        {String(displayH).padStart(2, "0")} {ampm}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] bg-white/5 my-2" />

                    {/* Minutes Column */}
                    <div className="flex-1 flex flex-col">
                        <span className="text-[9px] font-black text-[#888888] uppercase tracking-widest text-center mb-1.5">Minutes</span>
                        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                            {minuteOptions.map((m) => {
                                const isCurrent = minutes === m;
                                return (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => handleSelectMinute(m)}
                                        className={`w-full py-1 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border-none text-center ${
                                            isCurrent
                                                ? "bg-gold-primary text-[#050505] font-black shadow-[0_0_5px_rgba(255,193,7,0.2)]"
                                                : "bg-transparent text-white/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        {m}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
