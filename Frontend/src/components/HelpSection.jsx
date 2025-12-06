import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const HelpSection = () => {
    const { theme } = useContext(ThemeContext);

    const sectionClasses = theme === 'light'
        ? 'bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900'
        : 'bg-[#051d3e] text-white';

    const bubble1 = theme === 'light' ? 'bg-orange-300/25' : 'bg-orange-500/10';
    const bubble2 = theme === 'light' ? 'bg-emerald-300/25' : 'bg-emerald-500/10';

    const bodyText = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

    const cardClasses = theme === 'light'
        ? 'bg-white border border-gray-200 shadow-md hover:shadow-lg'
        : 'bg-white/5 border border-white/10 hover:border-emerald-400/50 backdrop-blur-md shadow-2xl';

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

    return (
        <section
            id="help"
            className={`relative py-20 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${bubble1}`}></div>
                <div className={`absolute bottom-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse delay-1000 ${bubble2}`}></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 animate-fade-in-up">
                        Dedicated Support
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
                </div>

                <p className={`text-xl mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200 ${bodyText}`}>
                    Need assistance or have a question? Our committed support team is always on standby to provide expert help with account inquiries, investment questions, or any technical challenges you may encounter.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className={`relative group rounded-3xl p-8 transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-300 ${cardClasses}`}>
                        <div className="text-5xl mb-4">📧</div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Email Support</h3>
                        <p className={`${bodyText} mb-4`}>Get detailed responses within 24 hours</p>
                        <a href="mailto:support@growup.com" className="text-orange-500 font-semibold hover:text-orange-400 transition-colors">
                            support@growup.com
                        </a>
                    </div>

                    <div className={`relative group rounded-3xl p-8 transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-400 ${cardClasses}`}>
                        <div className="text-5xl mb-4">📞</div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Phone Support</h3>
                        <p className={`${bodyText} mb-4`}>Mon-Fri, 9AM-6PM IST</p>
                        <a href="tel:+919876543210" className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors">
                            +91 98765 43210
                        </a>
                    </div>

                    <div className={`relative group rounded-3xl p-8 transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up delay-500 ${cardClasses}`}>
                        <div className="text-5xl mb-4">💬</div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Live Chat</h3>
                        <p className={`${bodyText} mb-4`}>Instant support 24/7</p>
                        <button className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">
                            Start Chat →
                        </button>
                    </div>
                </div>

                {/* FAQ Highlight + Grid */}
                <div className="gap-7">
                    <div className="animate-fade-in-up delay-600 mb-10">
                        <div className="bg-gradient-to-r from-orange-500/15 to-yellow-500/15 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                            <h3 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Frequently Asked Questions</h3>
                            <p className={`${bodyText} mb-6`}>Find quick answers to common questions in our comprehensive FAQ section.</p>
                            <a href="/faq" className="inline-flex items-center text-orange-500 font-semibold hover:text-orange-400 transition-colors">
                                Browse FAQ Section →
                            </a>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                                    theme === 'light'
                                        ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                        : 'bg-white/5 border border-white/10 hover:border-cyan-400 backdrop-blur-lg'
                                }`}
                            >
                                <h4 className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-cyan-300'}`}>{faq.q}</h4>
                                <p className={`text-sm ${bodyText}`}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </section>
    );
};

export default HelpSection;