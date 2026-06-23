import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";


export default function DashboardContent({
    topFounders,
    startUps,
    news,
    CounterCard,
    NewsCard,
    portfolioStats = { totalInvestment: 0, totalProfit: 0, startupsInvested: 0 }
}) {

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
                <div className="rounded-[2.5rem] shadow-sm border p-8 transition-colors bg-gradient-to-br from-blue-900/40 to-blue-900/20 border-blue-400/40 hover:from-blue-900/50 hover:to-blue-900/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                        </div>
                        <h3 className="text-2xl font-black mb-0 text-white">Top Founders</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topFounders.map((f, i) => (
                            <div key={i} className="rounded-xl p-6 flex flex-col items-center text-center transition-all border hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-800/30 to-indigo-800/20 border-blue-400/30 hover:from-blue-800/50 hover:to-indigo-800/40 hover:border-blue-300/50">
                                <div className="rounded-full shadow-lg border-4 border-blue-400 overflow-hidden mb-4 relative bg-gradient-to-br from-blue-600 to-indigo-700">
                                    <img src={f.img || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`} alt="" className="w-20 h-20 object-cover" />
                                </div>
                                <h4 className="text-sm font-bold truncate w-full text-white">{f.name}</h4>
                                <p className="text-blue-300 font-semibold text-xs mt-1 uppercase tracking-widest">{f.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2.5rem] shadow-sm border p-8 transition-colors bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-purple-400/40 hover:from-purple-900/50 hover:to-purple-900/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        </div>
                        <h3 className="text-2xl font-black mb-0 text-white">My Portfolio</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" /></svg>}
                            label="Total Investment"
                            target={portfolioStats.totalInvestment}
                            prefix="$"
                            index={0}
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            label="Total Profit"
                            target={portfolioStats.totalProfit}
                            prefix="$"
                            index={1}
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            label="Start-ups Invested"
                            target={portfolioStats.startupsInvested}
                            index={2}
                        />
                    </div>
                </div>
            </section>

            {/* Best Start-ups Carousel */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7H7v6h6V7z" /><path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2V2a1 1 0 112 0v1a2 2 0 012 2v2h1a2 2 0 012 2v2h1a2 2 0 012 2v6a2 2 0 01-2 2h-1v1a1 1 0 11-2 0v-1h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H4a2 2 0 01-2-2v-6a2 2 0 012-2h1V9a2 2 0 012-2h2V6a2 2 0 012-2zm0 5a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-white">Best Start-ups</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: -320, behavior: "smooth" })} className="w-8 h-8 flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg shadow-blue-500/20 transition shadow">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: 320, behavior: "smooth" })} className="w-8 h-8 flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-lg shadow-indigo-500/20 transition shadow">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div id="startupCarousel" className="flex gap-4 overflow-x-auto scroll-snap-x mandatory scroll-smooth pb-4" style={{scrollbarWidth: 'auto'}}>
                    {startUps.map((s, i) => (
                        <div key={i} className="flex-shrink-0 w-[280px] rounded-xl shadow-sm border overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border-blue-400/40 hover:from-blue-900/50 hover:to-indigo-900/40 group">
                            <div className="p-2 pb-0 relative overflow-hidden">
                                <img src={s.img || fallbacks[i % fallbacks.length]} alt={s.name} className="h-40 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                            </div>
                            <div className="p-4 pt-3">
                                <h4 className="font-bold text-sm text-white">{s.name}</h4>
                                <p className="text-xs mt-1 line-clamp-2 text-gray-300">{s.desc}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(s.tags || []).map((t, idx) => (
                                        <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest bg-gradient-to-r from-blue-500/30 to-indigo-500/30 text-blue-300 border border-blue-400/30">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" /><path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Latest News & Insights</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((n) => (
                        <NewsCard key={n.title} {...n} />
                    ))}
                </div>
            </section>


        </main>


    );
}
