interface HoneycombPatternProps {
    className?: string;
}

export default function HoneycombPattern({ className = "opacity-[0.02]" }: HoneycombPatternProps) {
    return (
        <svg
            className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className} text-white`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern
                    id="shared-honeycomb"
                    width="56"
                    height="97"
                    patternUnits="userSpaceOnUse"
                    patternTransform="scale(1.2)"
                >
                    <path
                        d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 97 L56 81 L56 49 L28 33 L0 49 L0 81 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shared-honeycomb)" />
        </svg>
    );
}
