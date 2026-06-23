import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const HowItWorksSection = () => {
    const { theme } = useContext(ThemeContext);

    const sectionClasses =
        theme === "light"
            ? "bg-gradient-to-br from-white via-slate-50 to-blue-50 text-gray-900"
            : "bg-[#051d3e] text-white";

    const bubble1 = theme === "light" ? "bg-indigo-200/40" : "bg-indigo-500/10";
    const bubble2 = theme === "light" ? "bg-blue-200/40" : "bg-blue-500/10";

    const subText = theme === "light" ? "text-gray-700" : "text-gray-300";

    const cardClasses =
        theme === "light"
            ? "bg-white border border-gray-200 shadow-md hover:shadow-lg"
            : "bg-white/5 border border-white/20 backdrop-blur-xl hover:border-cyan-400/50 shadow-2xl";

    return (
        <section
            id="howitworks"
            className={`relative py-20 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}
        >
            {/* Floating glows */}
            <div className="absolute inset-0">
                <div
                    className={`absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse ${bubble1}`}
                />
                <div
                    className={`absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${bubble2}`}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
                        How It Works
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full" />
                </div>

                <p
                    className={`text-xl mb-20 max-w-3xl mx-auto leading-relaxed ${subText}`}
                >
                    Our streamlined process ensures a seamless journey from startup registration to successful funding partnerships.
                </p>

                {/* 3 Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                    {/* Connecting line */}
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-400/40 to-blue-400/40 -translate-y-1/2" />

                    {/* STEP 1 */}
                    <div className={`relative rounded-xl p-10 hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xl">
                            1
                        </div>

                        <div className="text-6xl mb-6 mt-4">🔐</div>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                            Register & Verify
                        </h3>
                        <p className={`leading-relaxed ${subText}`}>
                            Create your account and complete our verification process to ensure a secure and trustworthy ecosystem.
                        </p>

                        <div className="mt-6 flex justify-center space-x-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                            <span className="w-2 h-2 bg-indigo-400/50 rounded-full" />
                            <span className="w-2 h-2 bg-indigo-400/30 rounded-full" />
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className={`relative rounded-xl p-10 hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xl">
                            2
                        </div>

                        <div className="text-6xl mb-6 mt-4">🤝</div>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                            Connect & Engage
                        </h3>
                        <p className={`leading-relaxed ${subText}`}>
                            Startups showcase their vision, while investors discover and evaluate promising opportunities.
                        </p>

                        <div className="mt-6 flex justify-center space-x-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="w-2 h-2 bg-blue-400/50 rounded-full" />
                            <span className="w-2 h-2 bg-blue-400/30 rounded-full" />
                        </div>
                    </div>

                    {/* STEP 3 */}
                    <div className={`relative rounded-xl p-10 hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xl">
                            3
                        </div>

                        <div className="text-6xl mb-6 mt-4">🚀</div>
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                            Invest & Grow
                        </h3>
                        <p className={`leading-relaxed ${subText}`}>
                            Form strategic partnerships and watch innovative ideas transform into successful businesses.
                        </p>

                        <div className="mt-6 flex justify-center space-x-2">
                            <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                            <span className="w-2 h-2 bg-cyan-400/50 rounded-full" />
                            <span className="w-2 h-2 bg-cyan-400/30 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20">
                    <div className="bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 backdrop-blur-xl border border-white/20 rounded-xl p-8">
                        <h3 className={`text-2xl font-bold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                            Ready to Get Started?
                        </h3>
                        <p className={`${subText} mb-6`}>
                            Join thousands of startups and investors already growing with GrowUp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/signup/startup"
                                className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-indigo-400 to-blue-400 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                Join as Startup
                            </a>
                            <a
                                href="/signup/investor"
                                className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                Join as Investor
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
