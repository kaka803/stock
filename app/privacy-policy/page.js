"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8 anta-regular">Privacy Policy</h1>
                    
                    <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Logo. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at support@logo.com.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">2. Information We Collect</h2>
                            <p>
                                We collect personal information that you voluntarily provide to us when registering at the Services, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or otherwise contacting us.
                            </p>
                            <p className="mt-4">
                                The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                            <p>
                                We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>To facilitate account creation and logon process.</li>
                                <li>To send you marketing and promotional communications.</li>
                                <li>To fulfill and manage your orders.</li>
                                <li>To post testimonials.</li>
                                <li>To deliver services to the user.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">4. Will Your Information Be Shared With Anyone?</h2>
                            <p>
                                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">5. How Long Do We Keep Your Information?</h2>
                            <p>
                                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have questions or comments about this policy, you may email us at support@logo.com or by post to our official business address.
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
