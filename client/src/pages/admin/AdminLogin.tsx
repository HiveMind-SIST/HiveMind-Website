import { type FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/admin/authService";
import Toast from "../../compoenets/Toast";
import AdminLoader from "../../compoenets/AdminLoader";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Live validation states
    const [validation, setValidation] = useState({
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
    });

    // Restore existing session if cookie is already authenticated
    useEffect(() => {
        document.title = "HiveMind Admin | Login";
        authService.getAdminStatus()
            .then((data) => {
                if (data.success) {
                    navigate("/admin/dashboard");
                }
            })
            .catch(() => {
                // Silence unauthenticated status check on login load
            });
    }, [navigate]);

    useEffect(() => {
        setValidation({
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            // Checks for any character that is not a letter or digit, or is an underscore
            hasSpecial: /[^A-Za-z0-9]/.test(password),
        });
    }, [password]);

    const isPasswordValid =
        validation.hasUpper &&
        validation.hasLower &&
        validation.hasNumber &&
        validation.hasSpecial;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        if (!isPasswordValid) {
            setErrorMessage("Password does not meet all the required criteria.");
            return;
        }

        setIsLoading(true);

        try {
            const data = await authService.login(email, password);
            if (data.success) {
                navigate("/admin/dashboard");
            } else {
                setErrorMessage(data.message || "Authentication failed.");
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Could not connect to the backend server. Please verify it is running on port 5000.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden z-[1]"
            style={{ backgroundImage: "url('/assets/backgrounds/hero-bg.webp')" }}
        >
            {/* Full-Screen Loader Overlay */}
            {isLoading && <AdminLoader />}

            {/* Toast Error Alert */}
            {errorMessage && <Toast message={errorMessage} onClose={() => setErrorMessage("")} />}

            {/* Background overlays, atmospheric GIFs and glowing effects */}
            <div className="absolute inset-0 bg-[#040406]/85 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-[2]"></div>

            <img
                src="/assets/backgrounds/bee_background.gif"
                alt="Center Atmospheric GIF"
                loading="lazy"
                decoding="async"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1800px] max-w-[200vw] h-auto z-[3] opacity-80 pointer-events-none mix-blend-screen center-bg-gif-mask"
            />

            <div className="absolute w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(255,193,7,0.06)_0%,transparent_60%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-[3] pointer-events-none animate-[pulseGlowBg_6s_ease-in-out_infinite_alternate]"></div>

            <div className="relative z-10 w-full max-w-lg bg-black/15 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[150%] before:h-[150%] before:bg-[radial-gradient(circle,rgba(255,193,7,0.02)_0%,transparent_60%)] before:pointer-events-none before:z-[1]">
                <div className="relative z-10">
                    {/* Header/Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <a href="/" className="mb-4 transition-transform duration-300 hover:scale-105">
                            <img
                                src="/assets/logos/HiveMind_logo_bg_removed.webp"
                                alt="HiveMind Logo"
                                decoding="async"
                                className="h-16 w-auto filter drop-shadow-[0_0_12px_rgba(255,193,7,0.4)]"
                            />
                        </a>
                        <h2 className="text-2xl font-extrabold uppercase tracking-widest text-gold-sweep drop-shadow-[0_0_10px_rgba(255,193,7,0.2)]">
                            Admin Portal
                        </h2>
                        <p className="text-xs text-[#888888] tracking-wider mt-1.5 uppercase">
                            HiveMind Supercomputing Lab
                        </p>
                    </div>

                    <form className="space-y-5 text-left" onSubmit={handleSubmit}>

                            {/* Email Address */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="bg-white/[0.02] border border-white/10 rounded-lg py-3 px-4 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)]"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-3 pl-4 pr-11 text-white text-sm transition-all duration-300 focus:outline-none focus:border-gold-primary focus:bg-gold-primary/[0.01] focus:shadow-[0_0_10px_rgba(255,193,7,0.15)]"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    {/* Toggle Eye Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none cursor-pointer"
                                        title={showPassword ? "Hide password" : "Show password"}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Strength Checklist */}
                            <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3.5 space-y-2 mt-2">
                                <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block mb-1">
                                    Password Live Requirements:
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {/* Uppercase */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${validation.hasUpper
                                                    ? "bg-gold-primary/10 border-gold-primary/40 text-gold-primary animate-pulse"
                                                    : "bg-white/[0.02] border-white/10 text-white/20"
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        <span className={`text-[11px] transition-colors duration-300 ${validation.hasUpper ? "text-white" : "text-[#666666]"}`}>
                                            1+ Uppercase (A-Z)
                                        </span>
                                    </div>

                                    {/* Lowercase */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${validation.hasLower
                                                    ? "bg-gold-primary/10 border-gold-primary/40 text-gold-primary animate-pulse"
                                                    : "bg-white/[0.02] border-white/10 text-white/20"
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        <span className={`text-[11px] transition-colors duration-300 ${validation.hasLower ? "text-white" : "text-[#666666]"}`}>
                                            1+ Lowercase (a-z)
                                        </span>
                                    </div>

                                    {/* Number */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${validation.hasNumber
                                                    ? "bg-gold-primary/10 border-gold-primary/40 text-gold-primary animate-pulse"
                                                    : "bg-white/[0.02] border-white/10 text-white/20"
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        <span className={`text-[11px] transition-colors duration-300 ${validation.hasNumber ? "text-white" : "text-[#666666]"}`}>
                                            1+ Number (0-9)
                                        </span>
                                    </div>

                                    {/* Special */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${validation.hasSpecial
                                                    ? "bg-gold-primary/10 border-gold-primary/40 text-gold-primary animate-pulse"
                                                    : "bg-white/[0.02] border-white/10 text-white/20"
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                        <span className={`text-[11px] transition-colors duration-300 ${validation.hasSpecial ? "text-white" : "text-[#666666]"}`}>
                                            1+ Special Char
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 text-center">
                                <button
                                    className={`w-full bg-gradient-to-br from-gold-primary to-[#D4AF37] text-black border-none py-3.5 px-8 text-xs font-extrabold tracking-widest uppercase rounded-full cursor-pointer transition-all duration-300 hover:translate-y-[-2px] flex items-center justify-center gap-2 ${isLoading || !isPasswordValid
                                            ? "opacity-50 cursor-not-allowed transform-none hover:shadow-none"
                                            : "shadow-[0_8px_25px_rgba(255,193,7,0.25)] hover:shadow-[0_12px_30px_rgba(255,193,7,0.4)] active:translate-y-0 active:shadow-[0_4px_15px_rgba(255,193,7,0.25)]"
                                        }`}
                                    type="submit"
                                    disabled={isLoading || !isPasswordValid}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Authenticating...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </div>
                        </form>

                    {/* Back to Site Link */}
                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="text-xs text-[#888888] hover:text-gold-primary uppercase tracking-widest no-underline transition-colors duration-300 flex items-center justify-center gap-1.5 inline-flex"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Back to website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
