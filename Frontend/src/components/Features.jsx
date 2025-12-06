import React, { useState } from 'react';
import chartIcon from '../assets/icons/chart.png'; // Ensure this path is correct

function Features() {
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <section id="overview" className="py-20 px-4 md:px-8  bg-[#1a4c9d] text-white text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-16">Platform Overview</h2>

            <div className="max-w-6xl mx-auto space-y-20">

                {/* Workflow Section */}
                <div className="workflow">
                    <h3 className="text-3xl font-semibold text-teal-600 mb-10">Workflow Process</h3>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 justify-center">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-8 border-teal-500 p-8 rounded-xl shadow-lg text-left transform transition duration-300 hover:scale-105">
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">For Startups</h4>
                            <p className="text-gray-600 text-lg leading-relaxed">Register your startup &rarr; Create Profile &rarr; Submit Pitch &rarr; Get Reviewed &rarr; Receive Investment Offers</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-l-8 border-purple-500 p-8 rounded-xl shadow-lg text-left transform transition duration-300 hover:scale-105">
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">For Investors</h4>
                            <p className="text-gray-600 text-lg leading-relaxed">Register &rarr; Verify Profile &rarr; Browse Startups &rarr; Evaluate &rarr; Invest & Track Performance</p>
                        </div>
                    </div>
                </div>

                {/* User Stats Section */}
                <div className="stats">
                    <h3 className="text-3xl font-semibold text-teal-600 mb-10">Platform Growth</h3>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                        <div className="grid md:grid-cols-3 gap-8 flex-1 w-full max-w-3xl">
                            <div className="bg-blue-500 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105">
                                <h4 className="text-4xl font-extrabold mb-2">👩‍💼 500+</h4>
                                <p className="text-lg font-light">Startups Registered</p>
                            </div>
                            <div className="bg-green-500 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105">
                                <h4 className="text-4xl font-extrabold mb-2">💸 200+</h4>
                                <p className="text-lg font-light">Investments Made</p>
                            </div>
                            <div className="bg-purple-500 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-105">
                                <h4 className="text-4xl font-extrabold mb-2">🌍 1000+</h4>
                                <p className="text-lg font-light">Active Users</p>
                            </div>
                        </div>
                        <div className="flex-shrink-0 max-w-sm w-full mt-10 lg:mt-0">
                            <img src={chartIcon} alt="chart" className="w-full h-auto rounded-xl shadow-lg border border-gray-200" />
                            <p className="text-gray-600 text-sm mt-4">User Growth & Engagement</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq">
                    <h3 className="text-3xl font-semibold text-teal-600 mb-10">Frequently Asked Questions</h3>
                    <div className="max-w-3xl mx-auto space-y-6 text-left">
                        {[
                            {
                                question: 'How do startups get verified?',
                                answer: 'Every startup goes through a comprehensive verification process involving business model evaluation and document checks to ensure credibility and investment readiness.'
                            },
                            {
                                question: 'Can investors directly contact startups?',
                                answer: 'Yes, after mutual approval and match confirmation on the platform, both parties can communicate securely through our integrated messaging system to discuss further details.'
                            },
                            {
                                question: 'Is there any commission or fee?',
                                answer: 'The GrowUp platform charges a minimal success-based commission only on successfully closed funding deals, ensuring we only benefit when our users do.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl shadow-md overflow-hidden">
                                <h4
                                    className="p-6 cursor-pointer text-xl font-medium text-gray-800 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition duration-200"
                                    onClick={() => toggleFaq(index)}
                                >
                                    {item.question}
                                    <span className={`transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : 'rotate-0'}`}>
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </h4>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-screen opacity-100 p-6 pt-0' : 'max-h-0 opacity-0 p-0'}`}
                                >
                                    <p className="text-gray-700 text-base leading-relaxed">{item.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Features;