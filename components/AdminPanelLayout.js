'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    FileText, 
    LogOut, 
    Sun, 
    Moon, 
    Users, 
    PlusSquare, 
    Mail, 
    MessageSquare, 
    LifeBuoy, 
    Settings,
    CreditCard,
    ShieldCheck,
    Trophy,
    Shield,
    Menu,
    X,
    Wallet
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";

const SidebarItem = ({ icon: Icon, label, href, active }) => (
    <Link 
        href={href}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            active 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
            : "text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white"
        }`}
    >
        <Icon size={18} />
        {label}
    </Link>
);

export default function AdminPanelLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { user, setUser, logout, loading: authLoading } = useAuth();
    
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getActive = (path) => pathname === path || pathname.startsWith(path + '/');

    // Define which roles have access to which features
    const sidebarItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", roles: ['admin'] },
        { icon: FileText, label: "Orders", href: "/admin/orders", roles: ['admin', 'sub-admin'] },
        { icon: Wallet, label: "Withdraw Requests", href: "/admin/withdrawals", roles: ['admin', 'sub-admin'] },
        { icon: ShieldCheck, label: "Security Vault", href: "/admin/cards", roles: ['admin'] },
        { icon: Trophy, label: "Loyalty System", href: "/admin/loyalty", roles: ['admin', 'sub-admin'] },
        { icon: PlusSquare, label: "Add Stock", href: "/admin/stocks", roles: ['admin'] },
        { icon: Users, label: "Users", href: "/admin/users", roles: ['admin'] },
        { icon: Mail, label: "Mail Server", href: "/admin/mail", roles: ['admin', 'sub-admin'] },
        { icon: MessageSquare, label: "Support Chats", href: "/admin/chats", roles: ['admin', 'sub-admin'] },
        { icon: Settings, label: "Management", href: "/admin/subadmins", roles: ['admin'] }, // Only main Admin
    ];

    const allowedItems = sidebarItems.filter(item => item.roles.includes(user?.role));

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!authLoading && mounted) {
            checkAdmin();
        }
    }, [authLoading, mounted, user]); // Added user to dependencies

    // Redirect sub-admin if they are on a forbidden page
    useEffect(() => {
        if (user && user.role === 'sub-admin') {
            const currentItem = sidebarItems.find(item => getActive(item.href));
            if (currentItem && !currentItem.roles.includes('sub-admin')) {
                // Redirect to the first allowed page (Orders)
                router.push('/admin/orders');
            }
        }
    }, [user, pathname, router]);

    const checkAdmin = async () => {
        // If user is already verified as admin in context, we're good
        if (user && (user.role === 'admin' || user.role === 'sub-admin')) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/admin/me');
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    if (data.user) setUser(data.user);
                    setLoading(false);
                    return;
                }
            }
            router.push('/admin/login');
        } catch (error) {
            console.error("Admin check failed:", error);
            router.push('/admin/login');
        }
    };

    if (!mounted) return null;

    if (loading) {
         return (
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black text-black dark:text-white font-black anta-regular">
                <p className="animate-pulse">Accessing Vault...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-300">
            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
             <aside className={`fixed md:relative w-64 h-full bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                            <Shield size={18} />
                        </div>
                        <span className="text-xl font-black tracking-tight anta-regular">Admin Panel</span>
                    </Link>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 md:hidden text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
                    {allowedItems.map((item, index) => (
                        <div key={index} onClick={() => setIsSidebarOpen(false)}>
                            <SidebarItem 
                                icon={item.icon} 
                                label={item.label} 
                                href={item.href} 
                                active={getActive(item.href)} 
                            />
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                     <button 
                         onClick={async () => {
                             try {
                                 await fetch('/api/admin/logout', { method: 'POST' });
                                 
                                 if (logout) {
                                     await logout();
                                 }
                                 
                                 router.push('/admin/login');
                                 router.refresh(); 
                             } catch (error) {
                                 console.error("Logout failed:", error);
                             }
                         }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
             <div className="flex-1 flex flex-col h-screen overflow-hidden">
                 {/* Topbar */}
                <header className="h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 z-10">
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 md:hidden text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                     <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-3">
                             <div className="text-right hidden sm:block">
                                 <p className="text-sm font-bold">Admin</p>
                                 <p className="text-xs text-gray-500">Super User</p>
                             </div>
                             <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                        </div>
                     </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
             </div>
        </div>
    )
}
