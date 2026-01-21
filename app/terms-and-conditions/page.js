"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8 anta-regular">Terms and Conditions</h1>
                    
                    <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">1. Agreement to Terms</h2>
                            <p>
                                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Logo (“we,” “us” or “our”), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">3. User Representations</h2>
                            <p>
                                By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">4. Prohibited Activities</h2>
                            <p>
                                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">5. Guideline for Reviews</h2>
                            <p>
                                We may provide you areas on the Site to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">6. Governing Law</h2>
                            <p>
                                These Terms and Conditions and your use of the Site are governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law principles.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">7. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@logo.com.
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
