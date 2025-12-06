/* src/pages/InvestorDashboard/InvestorDashboard.jsx */
import React, { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DashboardContent from "./DashboardContent.jsx";

import { CounterCard } from "./Card/CounterCard";
import { NewsCard } from "./Card/NewsCard";

/* Import your icons & menu from your current code */
import { icons, menu } from "./dashboardIcons";

export default function InvestorDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

    /* Dark Mode Handler */
    useEffect(() => {
        dark
            ? document.documentElement.classList.add("dark")
            : document.documentElement.classList.remove("dark");

        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    /* Dummy data */
    const topFounders = [
        { name: "Sarah Lee", role: "AI HealthTech", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
        { name: "Nathan Roy", role: "Fin-Tech", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
        { name: "Mei Chen", role: "Green-Tech", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    ];

    const startUps = [
        { name: "EcoCharge", desc: "EV charging network", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=60", tags: ["Green", "Series-A"] },
        { name: "MediAI", desc: "AI radiology platform", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=60", tags: ["Health", "Seed"] },
        { name: "Edtech", desc: "Education platform", img: "https://th.bing.com/th/id/OIP.HcNsZULh7qKuilD_rex3JAHaE8?w=256&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", tags: ["Education", "Seed"] },
        { name: "BlockShip", desc: "Logistics on blockchain", img: "https://th.bing.com/th/id/OIP.plcY02Ehze6xEgOY83no-QHaFj?w=232&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", tags: ["Logistics", "Pre-Seed"] },
        { name: "BlockShip", desc: "Logistics on blockchain", img: "https://th.bing.com/th/id/OIP.plcY02Ehze6xEgOY83no-QHaFj?w=232&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", tags: ["Logistics", "Pre-Seed"] },
        { name: "BlockShip", desc: "Logistics on blockchain", img: "https://th.bing.com/th/id/OIP.plcY02Ehze6xEgOY83no-QHaFj?w=232&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", tags: ["Logistics", "Pre-Seed"] },
        { name: "BlockShip", desc: "Logistics on blockchain", img: "https://th.bing.com/th/id/OIP.plcY02Ehze6xEgOY83no-QHaFj?w=232&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", tags: ["Logistics", "Pre-Seed"] },
    ];

    const news = [
        { title: "Fintech seed rounds up 34 % YoY", excerpt: "Global data shows continued investor appetite for early-stage fintech.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60", likes: 128, comments: 34 },
        { title: "Fintech seed rounds up 34 % YoY", excerpt: "Global data shows continued investor appetite for early-stage fintech.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60", likes: 128, comments: 34 },
        { title: "Fintech seed rounds up 34 % YoY", excerpt: "Global data shows continued investor appetite for early-stage fintech.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60", likes: 128, comments: 34 },
        { title: "Fintech seed rounds up 34 % YoY", excerpt: "Global data shows continued investor appetite for early-stage fintech.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60", likes: 128, comments: 34 },
        { title: "Green-tech subsidies expand in EU", excerpt: "New policy packages promise faster deployment of clean-tech startups.", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=60", likes: 97, comments: 21 },
        { title: "SaaS valuations rebound in Q3", excerpt: "Public markets push SaaS multiples back to pre-2022 levels.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=60", likes: 112, comments: 45 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                menu={menu}
            />

            <div className="lg:ml-64 flex flex-col">
                <Topbar
                    setSidebarOpen={setSidebarOpen}
                    dark={dark}
                    setDark={setDark}
                    icons={icons}
                />

                <DashboardContent
                    topFounders={topFounders}
                    startUps={startUps}
                    news={news}
                    CounterCard={CounterCard}
                    NewsCard={NewsCard}
                />
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => alert("Scheduler opened")}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg 
                hover:bg-indigo-700 transition transform hover:scale-105"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
        </div>
    );
}
