import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardContent({
    topFounders,
    startUps,
    news,
    CounterCard,
    NewsCard,
    portfolioStats
}) {
    const { theme } = useContext(ThemeContext);
    const role = useAuthStore((s) => s.role);
    const isFounder = role === "founder";

    const fallbacks = [
        "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1559136555-e467112aa52b?auto=format&fit=crop&w=400&q=80"
    ];

    return (
        <main className="flex-1 p-8 space-y-12 min-h-screen transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>



            {/* Hero sections: Top Founders + Portfolio counters */}
            <section className="space-y-10">
                <div className="rounded-[2.5rem] shadow-sm border p-8 transition-colors bg-blue-900/20 border-blue-400/30">
                    <h3 className="text-2xl font-black mb-8 text-white">{isFounder ? "Top Investors" : "Top Founders"}</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topFounders.map((f, i) => (
                            <div key={i} className="rounded-xl p-6 flex flex-col items-center text-center transition-colors border bg-blue-800/20 border-blue-400/20">
                                <div className="rounded-full shadow-lg border-[3px] border-blue-500 overflow-hidden mb-4 relative bg-blue-900/40">
                                    <img src={f.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`} alt="" className="w-20 h-20 object-cover" />
                                </div>
                                <h4 className="text-sm font-bold truncate w-full text-white">{f.name}</h4>
                                <p className="text-blue-400 font-semibold text-xs mt-1">{f.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2.5rem] shadow-sm border p-8 transition-colors bg-blue-900/20 border-blue-400/30">
                    <h3 className="text-2xl font-black mb-8 text-white">My Analytics</h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" /></svg>}
                            label={isFounder ? "Total Raised" : "Total Investment"}
                            target={portfolioStats?.totalInvestment || 0}
                            prefix="$"
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            label={isFounder ? "Current Valuation" : "Estimated Profit"}
                            target={portfolioStats?.totalProfit || 0}
                            prefix="$"
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            label={isFounder ? "Total Investors" : "Start-ups Invested"}
                            target={portfolioStats?.startupsInvested || 0}
                        />
                    </div>
                </div>
            </section>

            {/* Best Start-ups Carousel */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{isFounder ? "Best Investors" : "Best Start-ups"}</h2>
                    <div className="flex gap-2">
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: -320, behavior: "smooth" })} className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1e293b] text-white hover:bg-slate-700 transition shadow">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: 320, behavior: "smooth" })} className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1e293b] text-white hover:bg-slate-700 transition shadow">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div id="startupCarousel" className="flex gap-4 overflow-x-auto scroll-snap-x mandatory scroll-smooth pb-4" style={{scrollbarWidth: 'auto'}}>
                    {startUps.map((s, i) => (
                        <div key={i} className="flex-shrink-0 w-[280px] rounded-xl shadow-sm border overflow-hidden transition-colors bg-blue-900/20 border-blue-400/20">
                            <div className="p-2 pb-0">
                                <img src={s.img || fallbacks[i % fallbacks.length]} alt={s.name} className="h-40 w-full object-cover rounded-xl" />
                            </div>
                            <div className="p-4 pt-3">
                                <h4 className="font-bold text-sm text-white">{s.name}</h4>
                                <p className="text-xs mt-1 line-clamp-2 text-gray-300">{s.desc}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(s.tags || []).map((t, idx) => (
                                        <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest bg-blue-900/50 text-blue-300">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section>
                <h2 className="text-3xl font-black tracking-tight mb-8 text-white">Latest News</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {news.map((n) => (
                        <NewsCard key={n.title} {...n} />
                    ))}
                </div>
            </section>


        </main>


    );
}
