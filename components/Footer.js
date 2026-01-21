import Link from "next/link";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-black dark:bg-black dark:border-zinc-800 dark:text-white transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    
                    {/* Product Column */}
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 dark:text-white">Product</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Stocks', href: '/stocks' },
                                { name: 'Crypto', href: '/crypto' },
                                { name: 'Forex', href: '/forex' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 dark:text-white">Resources</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'About Us', href: '/company' },
                                { name: 'Help Center', href: '/help-center' },
                                { name: 'Contact Support', href: '/contact' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 dark:text-white">Legal</h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Privacy Policy', href: '/privacy-policy' },
                                { name: 'Terms of Service', href: '/terms-and-conditions' },
                                { name: 'Cookie Policy', href: '/cookie-policy' },
                                { name: 'Disclaimer', href: '/disclaimer' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors dark:text-zinc-400 dark:hover:text-blue-400">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us Column */}
                    <div>
                        <h3 className="text-base font-semibold text-black mb-4 dark:text-white">Contact Us</h3>
                        <ul className="space-y-3 mb-6">
                            <li><Link href="/help-center" className="text-sm text-gray-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">Help Center</Link></li>
                            <li><Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">FAQ</Link></li>
                            <li><a href="mailto:support@logo.com" className="text-sm text-gray-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400">support@logo.com</a></li>
                        </ul>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="text-black transition-colors hover:text-blue-600 border border-black rounded-full p-1.5 dark:text-white dark:border-white dark:hover:text-blue-400 dark:hover:border-blue-400">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                     {/* Logo & Legal Column */}
                     <div className="lg:col-span-1">
                         <div className="mb-6">
                            <span className="text-4xl font-bold tracking-tight anta-regular">Logo</span>
                         </div>
                        
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed dark:text-zinc-500">
                            © {new Date().getFullYear()} Logo Investing, Inc. All rights reserved. Your trusted partner in global markets.
                        </p>
                         <p className="text-xs text-blue-500 mb-6 leading-relaxed hover:underline cursor-pointer dark:text-blue-400">
                            Customer Relationship Summary & Disclosures.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
