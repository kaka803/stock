"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Disclaimer() {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8 anta-regular">Disclaimer</h1>
                    
                    <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">1. Investment Risk</h2>
                            <p>
                                Investing in financial markets involves risks. The value of your investments can go down as well as up and you may get back less than you put in. Past performance is not a reliable indicator of future results.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">2. Not Financial Advice</h2>
                            <p>
                                The information provided on this platform is for educational and informational purposes only and does not constitute financial, investment, legal, or tax advice. You should consult with a qualified professional before making any investment decisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">3. Accuracy of Information</h2>
                            <p>
                                While we strive to provide accurate and up-to-date information, we cannot guarantee that all content is free from errors or omissions. Data provided by third-party APIs may have delays or inaccuracies beyond our control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">4. External Links</h2>
                            <p>
                                Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with Logo. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">5. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, Logo shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your access to or use of the Site.
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
