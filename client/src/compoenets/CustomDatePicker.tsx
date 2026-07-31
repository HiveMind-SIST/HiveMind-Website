import { useState, useRef, useEffect } from "react";

interface CustomDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (val: string) => void;
    label?: string;
    required?: boolean;
    disablePast?: boolean;
}

export default function CustomDatePicker({
    value,
    onChange,
    label,
    required,
    disablePast = true,
}: CustomDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Today's date normalized to 00:00:00
    const getToday = () => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const today = getToday();

    // Parse current date or default to today
    const getInitialDate = () => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) return d;
        }
        return today;
    };

    const initialDate = getInitialDate();
    const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync state when value changes from parent
    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setCurrentYear(d.getFullYear());
                setCurrentMonth(d.getMonth());
            }
        } else {
            setCurrentYear(today.getFullYear());
            setCurrentMonth(today.getMonth());
        }
    }, [value]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Disable prev month if disablePast is true and we're at or before current month
    const isPrevMonthDisabled = disablePast && (
        currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() && currentMonth <= today.getMonth())
    );

    const handlePrevMonth = () => {
        if (isPrevMonthDisabled) return;
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const isPastDate = (day: number) => {
        if (!disablePast) return false;
        const cellDate = new Date(currentYear, currentMonth, day);
        cellDate.setHours(0, 0, 0, 0);
        return cellDate < today;
    };

    const isTodayDate = (day: number) => {
        const cellDate = new Date(currentYear, currentMonth, day);
        cellDate.setHours(0, 0, 0, 0);
        return cellDate.getTime() === today.getTime();
    };

    const handleSelectDay = (day: number) => {
        if (isPastDate(day)) return;
        const y = currentYear;
        const m = String(currentMonth + 1).padStart(2, "0");
        const d = String(day).padStart(2, "0");
        onChange(`${y}-${m}-${d}`);
        setIsOpen(false);
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Build grid of days
    const calendarCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
        calendarCells.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push(i);
    }

    // Format display date
    const getDisplayDate = () => {
        if (!value) return "Select Date";
        const d = new Date(value + "T00:00:00");
        if (isNaN(d.getTime())) return value;
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

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
                <span>{getDisplayDate()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute top-[100%] left-0 right-0 mt-1 bg-[#121214] border border-white/10 rounded-xl shadow-2xl z-[9999] p-3.5 w-[260px] mx-auto sm:w-full animate-fade-in-up">
                    {/* Header: Month and Year */}
                    <div className="flex justify-between items-center mb-3">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled}
                            className={`p-1 rounded-lg transition-colors bg-transparent border-none ${
                                isPrevMonthDisabled
                                    ? "opacity-20 text-white/20 cursor-not-allowed"
                                    : "hover:bg-white/5 text-white/60 hover:text-white cursor-pointer"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                            {months[currentMonth]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {daysOfWeek.map((day, idx) => (
                            <span key={idx} className="text-[9px] font-black text-[#888888] uppercase">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {calendarCells.map((dayNum, idx) => {
                            if (dayNum === null) {
                                return <div key={idx} className="h-7" />;
                            }

                            const formattedCellDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                            const isSelected = value === formattedCellDate;
                            const disabled = isPastDate(dayNum);
                            const isToday = isTodayDate(dayNum);

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleSelectDay(dayNum)}
                                    className={`h-7 w-full text-[10px] font-bold rounded-lg flex items-center justify-center transition-all border-none relative ${
                                        disabled
                                            ? "opacity-20 text-white/20 cursor-not-allowed bg-transparent"
                                            : isSelected
                                            ? "bg-gold-primary text-[#050505] font-black shadow-[0_0_10px_rgba(255,193,7,0.3)] cursor-pointer"
                                            : isToday
                                            ? "bg-gold-primary/10 border border-gold-primary/50 text-gold-primary font-black cursor-pointer"
                                            : "bg-transparent text-white/80 hover:bg-white/5 hover:text-white cursor-pointer"
                                    }`}
                                >
                                    {dayNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Today indicator footer note */}
                    <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center px-1">
                        <span className="text-[9px] text-gold-primary font-bold uppercase tracking-wider">Today: {today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <button
                            type="button"
                            onClick={() => {
                                const y = today.getFullYear();
                                const m = String(today.getMonth() + 1).padStart(2, "0");
                                const d = String(today.getDate()).padStart(2, "0");
                                setCurrentYear(y);
                                setCurrentMonth(today.getMonth());
                                onChange(`${y}-${m}-${d}`);
                            }}
                            className="text-[9px] font-bold text-white/60 hover:text-gold-primary uppercase tracking-wider bg-transparent border-none cursor-pointer transition-colors"
                        >
                            Select Today
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
