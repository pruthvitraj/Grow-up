import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const LoginSection = () => {
    const { theme } = useContext(ThemeContext);

    const sectionClasses = theme === 'light'
        ? 'bg-white text-gray-900'
        : 'bg-[#051d3e] text-white';

    const bubble1 = theme === 'light' ? 'bg-emerald-100/20' : 'bg-green-500/10';
    const bubble2 = theme === 'light' ? 'bg-emerald-300/10' : 'bg-emerald-500/10';
    const bodyText = theme === 'light' ? 'text-gray-600' : 'text-gray-300';


    const cardClasses = theme === 'light'
        ? 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-emerald-400/50 shadow-2xl';

    return (
        <section id="login" className={`relative py-20 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}>



            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl animate-pulse ${bubble1}`}></div>
                <div className={`absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${bubble2}`}></div>

            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-fade-in-up">
                        Login to Your Dashboard
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
                </div>

                <p className={`text-xl mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 ${bodyText}`}>
                    Access your personalized dashboard to effortlessly explore potential startups, manage your investments, and track funding progress in real-time.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <div className={`relative group rounded-xl p-8 animate-fade-in-up delay-300 transform hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="text-5xl mb-4">🚀</div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>For Startups</h3>
                        <p className={`mb-6 ${bodyText}`}>Track your funding progress, update your pitch, and connect with interested investors.</p>

                        <a href="/login" className="inline-flex items-center text-green-400 font-semibold hover:text-green-300 transition-colors">
                            Startup Login →
                        </a>
                    </div>

                    <div className={`relative group rounded-xl p-8 animate-fade-in-up delay-400 transform hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="text-5xl mb-4">💼</div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>For Investors</h3>
                        <p className={bodyText}>Browse vetted startups, manage your portfolio, and discover new investment opportunities.</p>

                        <a href="/login" className="inline-flex items-center text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                            Investor Login →
                        </a>
                    </div>
                </div>

                <div className="animate-fade-in-up delay-500">
                    <a href="/login" className="inline-block bg-gradient-to-r from-green-400 to-emerald-400 text-black px-12 py-5 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                        Secure Login Portal
                    </a>
                    <p className="mt-6 text-gray-400 text-sm">
                        New to GrowUp? <a href="/register" className="text-green-400 hover:text-green-300 font-semibold">Create an account</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default LoginSection;