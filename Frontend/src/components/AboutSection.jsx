import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const AboutSection = () => {
    const { theme } = useContext(ThemeContext);

    const sectionClasses = theme === 'light'
        ? ' from-white via-gray-50 to-emerald-50 text-gray-900'
        : 'bg-[#051d3e] text-white';

    const bubble1 = theme === 'light' ? 'bg-purple-300/25' : 'bg-purple-500/10';
    const bubble2 = theme === 'light' ? 'bg-blue-300/25' : 'bg-blue-500/10';

    const mainText = theme === 'light' ? 'text-gray-700' : 'text-gray-200';
    const subText = theme === 'light' ? 'text-gray-600' : 'text-gray-300';

    const cardClasses = theme === 'light'
        ? 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
        : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-purple-400/50 shadow-2xl';

    return (
        <section
            id="about"
            className={`relative py-20 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse ${bubble1}`}></div>
                <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 ${bubble2}`}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="mb-12">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-fade-in-up">
                        About GrowUp
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full" />
                </div>

                <div className="space-y-8 text-xl leading-relaxed animate-fade-in-up delay-200">
                    <p className={`max-w-4xl mx-auto ${mainText}`}>
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-400">GrowUp</span>{' '}
                        is more than just a platform; it's an ecosystem designed to bridge the crucial gap between groundbreaking startups and discerning investors.
                    </p>
                    <p className={`max-w-4xl mx-auto ${subText}`}>
                        Our core mission is to empower visionary entrepreneurs by connecting them with the strategic financial partners essential for their growth.
                    </p>
                    <p className={`max-w-4xl mx-auto ${subText}`}>
                        We firmly believe that every innovative idea deserves the opportunity to flourish, and every astute investor merits a secure and impactful investment avenue.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className={`relative group rounded-xl p-8 transform hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Mission</h3>
                        <p className={`${subText} text-sm`}>Empower startups with strategic capital and guidance</p>
                    </div>
                    <div className={`relative group rounded-xl p-8 transform hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="text-4xl mb-4">💎</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Vision</h3>
                        <p className={`${subText} text-sm`}>Create the world's most trusted startup ecosystem</p>
                    </div>
                    <div className={`relative group rounded-xl p-8 transform hover:-translate-y-2 transition-all duration-300 ${cardClasses}`}>
                        <div className="text-4xl mb-4">🚀</div>
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Values</h3>
                        <p className={`${subText} text-sm`}>Innovation, integrity, and impact-driven growth</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;