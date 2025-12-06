/* src/pages/InvestorDashboard/DashboardContent.jsx */
import React from "react";

export default function DashboardContent({
    topFounders,
    startUps,
    news,
    CounterCard,
    NewsCard
}) {
    return (
        <main className="flex-1 p-6 space-y-10">
            {/* Hero sections: Top Founders + Portfolio counters */}
            <section className="space-y-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Founders</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topFounders.map((f) => (
                            <div key={f.name} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
                                <img src={f.img} alt="" className="w-24 h-24 rounded-full object-cover shadow-lg" />
                                <h4 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">{f.name}</h4>
                                <p className="text-indigo-600 dark:text-indigo-300 font-medium">{f.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">My Portfolio</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" /></svg>}
                            label="Total Investment"
                            target={2400000}
                            prefix="$"
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            label="Total Profit"
                            target={480000}
                            prefix="$"
                        />
                        <CounterCard
                            icon={<svg className="w-14 h-14 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                            label="Start-ups Invested"
                            target={12}
                        />
                    </div>
                </div>
            </section>

            {/* Best Start-ups Carousel */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Best Start-ups</h2>
                    <div className="flex gap-2">
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: -320, behavior: "smooth" })} className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={() => document.getElementById("startupCarousel").scrollBy({ left: 320, behavior: "smooth" })} className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
                <div id="startupCarousel" className="flex gap-6 overflow-x-auto scroll-snap-x mandatory scroll-smooth pb-4">
                    {startUps.map((s) => (
                        <div key={s.name} className="flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <img src={s.img} alt={s.name} className="h-48 w-full object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-gray-800 dark:text-white">{s.name}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{s.desc}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {s.tags.map((t) => (
                                        <span key={t} className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest News */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Latest News</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((n) => (
                        <NewsCard key={n.title} {...n} />
                    ))}
                </div>
            </section>


        </main>


    );
}
