'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Force a hard refresh to update cookies/middleware state if any
                window.location.href = '/admin/dashboard'; 
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-black dark:text-white">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xl">
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/30">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold anta-regular">Admin Login</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Enter your secured credentials</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
