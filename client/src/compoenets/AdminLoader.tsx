interface AdminLoaderProps {
    isComponent?: boolean;
    label?: string;
}

export default function AdminLoader({ isComponent = false, label }: AdminLoaderProps) {
    return (
        <div className={isComponent ? "w-full flex-1 min-h-[60vh] flex flex-col items-center justify-center text-center my-auto py-12 select-none" : "fixed inset-0 bg-[#050505]/90 backdrop-blur-md flex flex-col items-center justify-center z-[99999] select-none"}>
            <div className="loader"></div>
            {label && (
                <span className="text-xs text-[#888888] uppercase tracking-wider font-bold mt-4 animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );
}
