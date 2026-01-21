'use client'
import Link from "next/link";
import AuthSidebar from "@/components/AuthSidebar";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Signup() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-black" />}>
            <SignupForm />
        </Suspense>
    );
}

function SignupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        referralCode: ""
    });

    // Auto-fill referral code from URL if present
    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const timer = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Signup failed");
            }

            if (data.isExistingUnverified) {
                setSuccess("You were already registered but not verified. A new code has been sent!");
            } else {
                setSuccess("Account created! Please check your email for the verification code.");
            }
            setShowOtpInput(true);
            startResendTimer();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Verification failed");
            }

            // Successfully verified! Redirect to login with a special message
            router.push("/login?verified=true");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to resend code");
            }

            setSuccess("A new code has been sent to your email.");
            startResendTimer();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <AuthSidebar />
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:ml-[440px]">
        <div className="max-w-[400px] w-full">
            <h1 className="text-4xl font-medium mb-4 leading-tight anta-regular text-black dark:text-white">
                {showOtpInput ? "Verify your email" : "Begin investing in five minutes or even faster."}
            </h1>
            <p className="text-gray-600 mb-8 dark:text-zinc-400">
                {showOtpInput ? `Enter the 6-digit code sent to ${formData.email}` : <>Already have an account? <Link href="/login" className="text-blue-500 hover:underline font-bold">Log in &gt;</Link></>}
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium mb-6">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-medium mb-6">
                    {success}
                </div>
            )}

            {!showOtpInput ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name" 
                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email" 
                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                            required
                        />
                    </div>
                    
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password" 
                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                            required
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-4 text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            <Eye size={20} />
                        </button>
                    </div>

                    <div>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number (Optional)" 
                            className="w-full bg-transparent border-b border-gray-200 py-4 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-black text-white py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xl"
                    >
                        {loading ? "Processing..." : "Create Account"}
                    </button>
                </form>
            ) : (
                <div className="space-y-8">
                    <form className="space-y-8" onSubmit={handleVerifyOtp}>
                        <div>
                            <input 
                                type="text" 
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000 000" 
                                className="w-full bg-transparent border-b border-gray-200 py-4 text-center text-4xl tracking-[0.5em] font-bold text-black placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                                maxLength={6}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white py-5 rounded-full font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xl"
                        >
                            {loading ? "Verifying..." : "Verify & Continue"}
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500 dark:text-zinc-500">
                            Didn't receive the code? {" "}
                            {resendTimer > 0 ? (
                                <span className="font-bold text-black dark:text-white">Resend in {resendTimer}s</span>
                            ) : (
                                <button 
                                    onClick={handleResendOtp}
                                    type="button"
                                    className="text-blue-500 font-bold hover:underline"
                                >
                                    Resend Code
                                </button>
                            )}
                        </p>
                        <button 
                            type="button"
                            onClick={() => {
                                setShowOtpInput(false);
                                setSuccess("");
                                setError("");
                            }}
                            className="text-sm font-medium text-gray-400 hover:text-black dark:hover:text-white"
                        >
                            Change Email Address
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
