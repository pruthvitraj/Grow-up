import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

// ===============================
// Helper: Card Gradients (Investor Palette)
// ===============================
const getCardStyle = (index) => {
    const styles = [
        "from-amber-600/60 to-amber-400/40 hover:to-amber-500/60",
        "from-indigo-700/60 to-indigo-500/40 hover:to-indigo-600/60",
        "from-blue-700/60 to-blue-500/40 hover:to-blue-600/60",
        "from-slate-800/80 to-slate-700/60 hover:to-slate-700/80",
    ];
    return styles[index % styles.length];
};

const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

// ===============================
// Helper: Match Score Badge
// ===============================
const MatchBadge = ({ score }) => {
    let bg, text;
    if (score >= 75) { bg = "bg-emerald-500"; text = "text-white"; }
    else if (score >= 50) { bg = "bg-amber-500"; text = "text-white"; }
    else if (score >= 25) { bg = "bg-orange-500"; text = "text-white"; }
    else { bg = "bg-red-500"; text = "text-white"; }

    return (
        <div
            className={`absolute top-3 right-3 z-20 ${bg} ${text} text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1`}
            title="AI Match Score"
        >
            {/* <span>🤖</span> */}
            <span>{score}%</span>
        </div>
    );
};

// ===============================
// Investor Card Component
// ===============================
const InvestorCard = ({ investor, index }) => {
    const navigate = useNavigate();
    const gradientClass = getCardStyle(index);
    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            const imgPath = investor?.profileImageUrl || investor?.productImageUrl;
            // Only attempt signed URL for real Supabase paths (avatars/ or images/)
            if (!imgPath || imgPath.startsWith('avatars/') || imgPath.startsWith('startup-images/') || imgPath.startsWith('product-images/')) return;

            const { data, error } = await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .createSignedUrl(imgPath, SIGNED_URL_EXPIRES);

            if (error) {
                console.error("Image load failed:", error);
                return;
            }
            setBgImage(data.signedUrl);
        };

        loadImage();
    }, [investor]);

    const score = investor?.matchScore ?? 0;

    return (
        <div className="relative h-[450px] w-90 rounded-xl overflow-hidden shadow-xl group transition-all duration-300 hover:-translate-y-2 select-none">
            {/* AI Match Badge */}
            <MatchBadge score={score} />

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                    backgroundImage: `url('${bgImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}')`,
                }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass}`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                <div>
                    <div className="flex justify-between items-start">
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                            {investor.investmentFocus || investor.investmentInterest || "Generalist"}
                        </div>
                        <div className="bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg">
                            {investor.investmentRange || investor.ticketSize || "₹10L-50L"}
                        </div>
                    </div>

                    {/* Name comes from the populated 'user' object */}
                    <h2 className="text-2xl font-bold tracking-tight mb-1">
                        {investor.user?.name || "Investor Profile"}
                    </h2>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">
                        {investor.firmName || investor.investorLocation || "Independent Angel"}
                    </p>

                    <p className="text-white/90 text-sm leading-relaxed line-clamp-4 italic border-l-2 border-white/20 pl-3">
                        "{investor.investmentThesis || investor.bio || "Seeking high-growth startups with passionate founders and scalable business models."}"
                    </p>

                    {/* Score Breakdown Tooltip Area */}
                    {investor.scoreBreakdown && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {investor.scoreBreakdown.industryMatch > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">🏭 Industry</span>}
                            {investor.scoreBreakdown.fundingRange > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">💰 Range</span>}
                            {investor.scoreBreakdown.businessStage > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">📈 Stage</span>}
                            {investor.scoreBreakdown.locationMatch > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">📍 Location</span>}
                            {investor.scoreBreakdown.investmentType > 0 && <span className="bg-white/10 text-[9px] px-2 py-0.5 rounded-full">🔖 Type</span>}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={() => navigate(`/founder/investor/${investor.user._id}`)}
                        className="flex-1 bg-white text-gray-900 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        View Profile
                    </button>
                    <button className="flex-1 bg-black/40 border border-white/30 backdrop-blur-md py-2.5 rounded-xl text-sm font-semibold hover:bg-black/60 transition-all">
                        Pitch
                    </button>
                </div>
            </div>
        </div>
    );
};

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
        }, 4000);

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
            <header className="mb-10 pl-2">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-12 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-400 font-black uppercase tracking-widest text-[10px]">Strategic Partners</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap mb-3">
                    <h1 className="text-4xl font-black text-white">{title}</h1>
                    {tag && (
                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/30 animate-pulse">
                            {tag}
                        </span>
                    )}
                </div>
                <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed">
                    {subtitle}
                </p>
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
                            <CardComponent investor={item} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 mt-6 ml-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSlide(index)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${index === activeIndex
                            ? "w-12 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.3)]"
                            : "w-3 bg-blue-900/30 hover:bg-blue-900/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

// ===============================
// Main Investors Component
// ===============================
const Investors = () => {
    const [allInvestors, setAllInvestors] = useState([]);
    const [aiInvestors, setAiInvestors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("all"); // 'all' or 'ai'

    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const token = useAuthStore((s) => s.token);

    useEffect(() => {
        const fetchInvestors = async () => {
            try {
                // Fetch AI Matches
                const resAI = await axios.get(
                    "http://localhost:5000/api/founder/ai-matches",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAiInvestors(resAI.data);
                
                // Fetch All Investors
                const resAll = await axios.get(
                    "http://localhost:5000/api/founder/investors",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAllInvestors(resAll.data);
            } catch (error) {
                console.error("Error fetching investors:", error);
                setAiInvestors(new Array(4).fill({ user: { name: "Demo AI Investor" }, firmName: "AI VC" }));
                setAllInvestors(new Array(4).fill({ user: { name: "Demo Investor" }, firmName: "Nexus VC" }));
            } finally {
                setLoading(false);
            }
        };
        fetchInvestors();
    }, [token]);

    return (
        <div className="min-h-screen font-sans overflow-hidden" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>
            <style>
                {`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>

            <main className="w-full mx-auto p-4 sm:p-6 lg:p-10">
                <button
                    onClick={() => window.history.back()}
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-sm border mb-8 bg-blue-900/20 text-blue-300 border-blue-400/30 hover:border-blue-400/50"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-black uppercase tracking-widest text-[10px]">Back to Dashboard</span>
                </button>

                <div className="max-w-[1400px] mx-auto">
                    {loading && (
                        <div className="flex gap-6 overflow-hidden px-2 mb-10">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="min-w-[85%] sm:min-w-[22%] h-[450px] animate-pulse rounded-xl bg-blue-900/20"></div>
                            ))}
                        </div>
                    )}

                    {!loading && (
                        <>
                            {/* Toggle Buttons */}
                            <div className="flex flex-wrap gap-4 mb-12 pl-2">
                                <button
                                    onClick={() => setViewMode("all")}
                                    className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 ${
                                        viewMode === "all"
                                            ? "bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] translate-y-[-2px]"
                                            : "bg-blue-900/20 text-blue-300 border border-blue-400/20 hover:bg-blue-900/40"
                                    }`}
                                >
                                    All Investors
                                </button>
                                <button
                                    onClick={() => setViewMode("ai")}
                                    className={`px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 flex items-center gap-2 ${
                                        viewMode === "ai"
                                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] translate-y-[-2px]"
                                            : "bg-emerald-900/20 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-900/40"
                                    }`}
                                >
                                    <span className="text-sm">🤖</span>
                                    AI Match
                                </button>
                            </div>

                            {viewMode === "all" ? (
                                <SliderSection 
                                    title="All Investors" 
                                    subtitle="Browse through our entire network of top-tier investors." 
                                    items={allInvestors} 
                                    CardComponent={InvestorCard} 
                                    isDark={isDark} 
                                />
                            ) : (
                                <SliderSection 
                                    title="Predicted Investors" 
                                    subtitle="These investors are ranked by AI compatibility score — best fit first. Connect with the ones most aligned with your startup." 
                                    items={aiInvestors} 
                                    CardComponent={InvestorCard} 
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

export default Investors;