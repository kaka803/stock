"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8 anta-regular">Cookie Policy</h1>
                    
                    <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">1. What Are Cookies</h2>
                            <p>
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better user experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">2. How We Use Cookies</h2>
                            <p>
                                We use cookies for several reasons. Some cookies are required for technical reasons in order for our Site to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">3. Types of Cookies We Use</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
                                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website.</li>
                                <li><strong>Functional Cookies:</strong> Allow the website to remember choices you make (such as your user name).</li>
                                <li><strong>Targeting Cookies:</strong> Used to deliver adverts more relevant to you and your interests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">4. Managing Cookies</h2>
                            <p>
                                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">5. Updates to This Policy</h2>
                            <p>
                                We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
                            </p>
                        </section>
                    </div>

                    <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
