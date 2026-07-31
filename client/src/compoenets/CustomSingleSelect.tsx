import { useState, useRef, useEffect } from "react";

interface CustomSingleSelectProps {
    label?: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    bgClass?: string;
    dropdownBgClass?: string;
}

export default function CustomSingleSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Select option",
    required = false,
    bgClass = "bg-[#171717] border border-white/5",
    dropdownBgClass = "bg-[#171717]"
}: CustomSingleSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={containerRef} className="flex flex-col gap-2 relative text-left w-full">
            {label && (
                <label className="text-[10px] font-bold text-[#9D9D9D] uppercase tracking-wider">
                    {label} {required && "*"}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`${bgClass} rounded-xl py-3 px-4 text-xs text-white cursor-pointer flex justify-between items-center select-none min-h-[42px] transition-colors`}
            >
                <span className={selectedOption ? "text-white font-semibold" : "text-white/40 font-semibold"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg className={`w-4 h-4 text-white/40 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className={`absolute top-[100%] left-0 right-0 mt-1 ${dropdownBgClass} border border-white/10 rounded-xl shadow-2xl z-[9999] max-h-[148px] overflow-y-auto p-2 space-y-1`}>
                    {options.map((opt, idx) => {
                        const isSelected = opt.value === value;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors text-xs font-semibold ${
                                    isSelected ? "text-gold-primary font-bold bg-white/5" : "text-white/80"
                                }`}
                            >
                                {opt.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
