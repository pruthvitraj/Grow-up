import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import ecogoImg from '../assets/images/ecogo.png';
import healthlinkImg from '../assets/images/healthlink.png';
import foodfiImg from '../assets/images/foodfi.png';

const newsItems = [
    {
        image: ecogoImg,
        title: 'EcoGo Secures ₹1 Cr in Seed Round',
        category: 'Funding',
        date: '2 days ago',
        description: 'EcoGo, a pioneering sustainability-focused transport startup, successfully secures critical seed funding to significantly expand its electric vehicle fleet and infrastructure.'
    },
    {
        image: healthlinkImg,
        title: 'HealthLink Forges Major Hospital Partnerships',
        category: 'Partnerships',
        date: '1 week ago',
        description: 'HealthLink is revolutionizing healthcare by introducing its advanced AI-driven patient management systems across a network of prominent hospital groups.'
    },
    {
        image: foodfiImg,
        title: 'FoodFi Receives Significant Angel Investment',
        category: 'Funding',
        date: '3 days ago',
        description: 'FoodFi is poised to disrupt the meal delivery sector with a substantial angel investment, fueling its innovative blockchain-based supply tracking solutions.'
    }
];

const NewsSection = () => {
    const { theme } = useContext(ThemeContext);

    const gradientText = "text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400";

    const sectionClasses = theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 to-slate-100 text-gray-900'
        : ' text-white';

    const bubble1 = theme === 'light' ? 'bg-rose-300/20' : 'bg-rose-500/10';
    const bubble2 = theme === 'light' ? 'bg-pink-300/20' : 'bg-pink-500/10';

    return (
        <section id="news" className={`relative py-20 md:py-32 px-6 overflow-hidden transition-colors duration-300 ${sectionClasses}`}>

            {/* Background Glow */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse ${bubble1}`}></div>
                <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${bubble2}`}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className={`text-5xl md:text-7xl font-extrabold mb-8 animate-fade-in-up ${gradientText}`}>
                        Latest News & Updates
                    </h2>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto rounded-full"></div>
                </div>

                <p className={`text-xl mb-20 max-w-3xl mx-auto leading-relaxed text-center animate-fade-in-up delay-200 ${sectionClasses}`}>
                    Stay informed with the latest developments, success stories, and insights from the GrowUp ecosystem.
                </p>

                {/* News Cards */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8`}>
                    {newsItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl 
                            overflow-hidden hover:border-rose-400/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative overflow-hidden h-48">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                                    group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center mb-4">
                                    <span className={`text-xs font-semibold bg-rose-400/20 px-3 py-1 rounded-full ${sectionClasses}`}>
                                        {item.category}
                                    </span>
                                    <span className={`text-xs ml-auto ${sectionClasses}`}>
                                        {item.date}
                                    </span>
                                </div>

                                <h3 className={`text-xl font-bold mb-4 transition-colors ${sectionClasses}`}>
                                    {item.title}
                                </h3>

                                <p className={`mb-6 leading-relaxed ${sectionClasses}`}>
                                    {item.description}
                                </p>

                                <a
                                    href="#"
                                    className={`inline-flex items-center font-semibold transition-colors group/link ${sectionClasses}`}
                                >
                                    Read More
                                    <span className="ml-2 transform transition-transform group-hover/link:translate-x-1">→</span>
                                </a>
                            </div>

                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full blur-lg opacity-60 
                                group-hover:opacity-100 transition-all duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-16 text-center animate-fade-in-up delay-400">
                    <div className="bg-gradient-to-r from-indigo-500/15 to-cyan-500/15  backdrop-blur-xl border border-white/20 rounded-xl p-8">

                        <h3 className={`text-2xl font-bold mb-4  `}>
                            Never Miss an Update
                        </h3>

                        <p className={`mb-6 `}>
                            Subscribe to our newsletter for exclusive insights and early access to investment opportunities
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full
                                text-white placeholder-gray-400 focus:outline-none focus:border-rose-400/50 transition-colors"
                            />

                            <button
                                className="bg-gradient-to-r from-rose-400 to-pink-400 text-white px-8 py-3 
                                rounded-full font-semibold hover:shadow-xl transition-all duration-300 
                                transform hover:-translate-y-1"
                            >
                                Subscribe
                            </button>
                        </div>

                        <a href="#" className={`font-semibold mt-4 inline-block hover:underline `}>
                            Read More →
                        </a>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default NewsSection;
