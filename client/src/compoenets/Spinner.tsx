interface SpinnerProps {
    label?: string;
}

export default function Spinner({ label = "Loading..." }: SpinnerProps) {
    return (
        <div className="py-20 flex flex-col items-center justify-center gap-4 select-none">
            <div className="w-12 h-12 rounded-full border-2 border-white/5 border-t-gold-primary animate-spin" />
            {label && (
                <span className="text-[10px] text-[#888888] uppercase tracking-widest font-black">
                    {label}
                </span>
            )}
        </div>
    );
}
