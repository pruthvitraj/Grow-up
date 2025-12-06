import React, { useEffect, useState, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { ThemeContext } from '../context/ThemeContext';

const stats = [
    { value: 500, label: 'Innovative Startups', suffix: '+' },
    { value: 200, label: 'Successful Investments', suffix: '+' },
    { value: 1000, label: 'Active Global Users', suffix: '+' },
];

const faqs = [
    {
        q: 'How do startups get verified?',
        a: 'Every startup undergoes a rigorous verification process, including business model evaluation and document checks.',
    },
    {
        q: 'Can investors directly contact startups?',
        a: 'Yes. After match approval, both parties can communicate securely via our encrypted messaging system.',
    },
    {
        q: 'Is there any commission or fee?',
        a: 'We charge a minimal success-based commission only on closed deals — no upfront costs.',
    },
];

const AnimatedCounter = ({ value, suffix }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ threshold: 0.5 });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = value;
        const duration = 1500;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return (
        <span ref={ref} className="text-4xl font-bold text-greeen-400">
            {count.toLocaleString()}{suffix}
        </span>
    );
};

const OverviewSection = () => {
    const { theme } = useContext(ThemeContext);

    const sectionClasses = theme === 'light'
        ? ' from-white via-slate-50 to-blue-50 text-gray-900'
        : 'bg-[#051d3e] text-white';

    const subText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

    const cardClasses = theme === 'light'
        ? 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
        : 'bg-white/5 backdrop-blur-lg border border-white/10 hover:border-purple-400 shadow-lg';

    return (
        <section
            id="overview"
            className={`relative py-24 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-fade-in-up">
                        Platform Overview
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto mb-8 rounded-full"></div>
                    <p className={`text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 ${subText}`}>
                        Bridging bold ideas with smart capital — a seamless, secure, and scalable ecosystem for founders and investors.
                    </p>
                </div>

                {/* Workflow */}
                <div className="grid md:grid-cols-2 gap-10 mb-20">
                    {['Startups', 'Investors'].map((role, idx) => (
                        <div
                            key={role}
                            className={`relative group rounded-3xl p-10 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up ${cardClasses}`}
                            style={{ animationDelay: `${idx * 200}ms` }}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center mr-4">
                                        <span className="text-2xl font-bold">{role === 'Startups' ? '🚀' : '💼'}</span>
                                    </div>
                                    <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        For {role}
                                    </h3>
                                </div>
                                <p className={`text-lg leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    {role === 'Startups'
                                        ? 'Register → Create Profile → Submit Pitch → Get Reviewed → Receive Offers'
                                        : 'Register → Verify Profile → Browse Startups → Evaluate → Invest & Track'}
                                </p>
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mb-20 grid sm:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={
                                theme === 'light'
                                    ? 'bg-white shadow-md border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-400 transition-all'
                                    : 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center hover:border-purple-400 transition-all'
                            }
                        >
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default OverviewSection;