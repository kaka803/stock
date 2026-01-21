'use client'
import Link from "next/link";
import AuthSidebar from "@/components/AuthSidebar";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (searchParams.get("verified")) {
            setSuccess("Email verified successfully! Please log in.");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            await login(formData.email, formData.password);
            // Redirection is now handled centrally in AuthContext to support role-based routing
        } catch (err) {
            if (err.needsVerification) {
                setError("Please verify your email first.");
                // Optionally redirect to a verification page or resend OTP flow
            } else {
                setError(err.message || "Invalid credentials");
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <AuthSidebar />
      <div className="flex-1 flex flex-col justify-center items-center px-8 lg:ml-[440px]"> 
        {/* Added ml-[440px] to account for sidebar width and ensure content is in the remaining space.
            Note: Sidebar is fixed width [440px]. 
            justify-center items-center with flex-col will center content vertically and horizontally in this div.
        */}
        <div className="max-w-[400px] w-full">
            <h1 className="text-4xl font-medium mb-2 anta-regular text-black dark:text-white">Log in</h1>
            <p className="text-gray-600 mb-12 dark:text-zinc-400">
                New to logo? <Link href="/signup" className="text-blue-500 hover:underline">Sign up here &gt;</Link>
            </p>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email" 
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                        required
                    />
                </div>
                
                <div className="relative">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password" 
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors dark:text-white dark:border-zinc-800 dark:focus:border-white"
                        required
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-3 text-gray-400 hover:text-black dark:hover:text-white"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                <div className="pt-4 flex justify-between items-center">
                    <Link href="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot your password?
                    </Link>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
