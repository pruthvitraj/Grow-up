import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

// ===============================
// Helper: Card Gradients
// ===============================
const getCardStyle = (index) => {
    const styles = [
        "from-blue-600/60 to-blue-400/40 hover:to-blue-500/60",
        "from-emerald-600/60 to-emerald-400/40 hover:to-emerald-500/60",
        "from-purple-700/60 to-purple-500/40 hover:to-purple-600/60",
        "from-slate-900/70 to-slate-800/50 hover:to-slate-800/70",
    ];
    return styles[index % styles.length];
};

const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5; // 5 minutes

// ===============================
// Helper: Match Score Badge
// ===============================
const MatchBadge = ({ score }) => {
    let bg;
    if (score >= 75) bg = "bg-emerald-500";
    else if (score >= 50) bg = "bg-amber-500";
    else if (score >= 25) bg = "bg-orange-500";
    else bg = "bg-red-500";

    return (
        <div
            className={`absolute top-3 right-3 z-20 ${bg} text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}
            title="Match Score"
        >
            {/* <span>🤖</span> */}
            <span>{score}%</span>
        </div>
    );
};

// ===============================
// Startup Card Component
// ===============================
const StartupCard = ({ startup, index }) => {
    const navigate = useNavigate();
    const gradientClass = getCardStyle(index);
    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            if (!startup?.productImageUrl) return;
            // Skip dummy/seed paths — they are not real Supabase objects
            if (
                startup.productImageUrl.startsWith('product-images/') ||
                startup.productImageUrl.startsWith('startup-images/')
            ) return;

            const { data, error } = await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .createSignedUrl(startup.productImageUrl, SIGNED_URL_EXPIRES);

            if (error) {
                console.error("Image load failed:", error);
                return;
            }
            setBgImage(data.signedUrl);
        };

        loadImage();
    }, [startup?.productImageUrl]);

    const score = startup?.matchScore ?? 0;

    return (
        <div className="relative h-[450px] w-90 rounded-2xl overflow-hidden shadow-xl group transition-all duration-300 hover:-translate-y-2 select-none">

            {/* AI Match Badge */}
            <MatchBadge score={score} />

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                    backgroundImage: `url('${bgImage ||
                        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                        }')`,
                }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass}`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                <div>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4">
                        Valuation: {startup.valuation || "Valuation"}
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight mb-2">
                        {startup.startupName || "Startup Name"}
                    </h2>

                    <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                        {startup.problemStatement || "Problem statement"}
                    </p>

                    <p className="text-white/90 text-sm leading-relaxed mt-3 line-clamp-3">
                        {startup.solutionOverview || "Solution overview"}
                    </p>

                    {/* Score Breakdown Chips */}
                    {startup.scoreBreakdown && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {startup.scoreBreakdown.industryMatch > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">🏭 Industry</span>}
                            {startup.scoreBreakdown.fundingRange > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">💰 Range</span>}
                            {startup.scoreBreakdown.businessStage > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">📈 Stage</span>}
                            {startup.scoreBreakdown.locationMatch > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">📍 Location</span>}
                            {startup.scoreBreakdown.investmentType > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">🔖 Type</span>}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => navigate(`/investor/startup/${startup._id}`)}
                        className="flex-1 bg-white text-gray-900 py-2.5 rounded-lg text-sm font-bold"
                    >
                        Read More
                    </button>
                    <button className="flex-1 bg-white/20 border border-white/30 py-2.5 rounded-lg text-sm font-semibold">
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

// ===============================
// ===============================
// Slider Section Component
// ===============================
const SliderSection = ({ title, subtitle, items, CardComponent, isDark, tag }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        if (!items || items.length === 0 || isHovered) return;

        const interval = setInterval(() => {
            if (sliderRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
                if (!sliderRef.current.firstChild) return;
                const cardWidth = sliderRef.current.firstChild.clientWidth + 24;

                let nextScroll = scrollLeft + cardWidth;

                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    nextScroll = 0;
                    setActiveIndex(0);
                } else {
                    const newIndex = Math.round(nextScroll / cardWidth);
                    setActiveIndex(newIndex);
                }

                sliderRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [items, isHovered]);

    const scrollToSlide = (index) => {
        if (sliderRef.current && sliderRef.current.firstChild) {
            const cardWidth = sliderRef.current.firstChild.clientWidth + 24;
            sliderRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
            setActiveIndex(index);
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <div className="mb-16">
            <header className="mb-8 pl-2">
                <div className="flex items-center gap-4 flex-wrap mb-2">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    {tag && (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30 animate-pulse">
                            {tag}
                        </span>
                    )}
                </div>
                <p className="text-gray-400">{subtitle}</p>
            </header>

            <div
                className="relative w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 pt-4 px-2"
                >
                    {items.map((item, index) => (
                        <div
                            key={item._id || index}
                            className="min-w-[85%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[22%] snap-start shrink-0"
                        >
                            <CardComponent startup={item} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-4 ml-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                            ? "w-8 bg-blue-600"
                            : `${isDark ? "w-2 bg-gray-700 hover:bg-gray-600" : "w-2 bg-gray-300 hover:bg-gray-400"}`
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ===============================
// Main Component
// ===============================
const Founders = () => {
    const [allFounders, setAllFounders] = useState([]);
    const [aiFounders, setAiFounders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("all"); // 'all' or 'ai'

    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const token = useAuthStore((s) => s.token);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch AI Matches
                const resAI = await axios.get(
                    "http://localhost:5000/api/investor/ai-matches",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAiFounders(resAI.data);
                
                // Fetch All Founders
                const resAll = await axios.get(
                    "http://localhost:5000/api/profile/investor/founders",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAllFounders(resAll.data);
            } catch (error) {
                console.error("Error fetching founders:", error);
                // Fallbacks
                setAiFounders(new Array(4).fill({ title: "Demo AI Startup", description: "Loading content..." }));
                setAllFounders(new Array(4).fill({ title: "Demo Startup", description: "Loading content..." }));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    return (
        <div className={`min-h-screen font-sans overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#030711] text-gray-100" : "bg-white text-gray-900"}`}>
            <style>
                {`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>

            <main className="w-full mx-auto p-4 sm:p-6 lg:p-10">
                <button
                    onClick={() => window.history.back()}
                    className={`group flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all shadow-sm border mb-8 ${isDark ? "bg-gray-900 text-gray-300 border-gray-800 hover:border-indigo-500/50" : "bg-white text-gray-700 border-gray-100 hover:border-indigo-100"
                        }`}
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-black uppercase tracking-widest text-[10px]">Back to Dashboard</span>
                </button>

                <div className="max-w-[1400px] mx-auto">
                    {loading && <p className="text-gray-400 mb-8 pl-2">Loading startups...</p>}

                    {!loading && (
                        <>
                            {/* Toggle Buttons */}
                            <div className="flex flex-wrap gap-4 mb-12 pl-2">
                                <button
                                    onClick={() => setViewMode("all")}
                                    className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${
                                        viewMode === "all"
                                            ? "bg-indigo-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.4)] translate-y-[-2px]"
                                            : isDark ? "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700" : "bg-gray-100 text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    All Founders
                                </button>
                                <button
                                    onClick={() => setViewMode("ai")}
                                    className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-2 ${
                                        viewMode === "ai"
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)] translate-y-[-2px]"
                                            : isDark ? "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700" : "bg-gray-100 text-gray-600 border border-gray-200"
                                    }`}
                                >
                                    <span className="text-sm">🤖</span>
                                    AI Match
                                </button>
                            </div>

                            {viewMode === "all" ? (
                                <SliderSection 
                                    title="All Founders" 
                                    subtitle="Browse through all the founders on the platform." 
                                    items={allFounders} 
                                    CardComponent={StartupCard} 
                                    isDark={isDark} 
                                />
                            ) : (
                                <SliderSection 
                                    title="Predicted Founders" 
                                    subtitle="Startups ranked by AI compatibility score — best fit first. Powered by ML." 
                                    items={aiFounders} 
                                    CardComponent={StartupCard} 
                                    isDark={isDark} 
                                    tag="Top Matched"
                                />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Founders;