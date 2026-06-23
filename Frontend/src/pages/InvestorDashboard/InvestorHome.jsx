import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardContent from "./DashboardContent.jsx";
import { CounterCard } from "./Card/CounterCard.jsx";
import { NewsCard } from "./Card/NewsCard.jsx";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";

const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

export default function InvestorHome() {
    const token = useAuthStore((s) => s.token);
    const [topFounders, setTopFounders] = useState([]);
    const [startUps, setStartUps] = useState([]);
    const [portfolioStats, setPortfolioStats] = useState({
        totalInvestment: 0,
        totalProfit: 0,  // Since we don't have an ROI tracker, we'll keep at 0 or mock 15%
        startupsInvested: 0
    });

    // Mock news since we don't have a news endpoint yet
    const news = [
        { title: "Fintech seed rounds up 34% YoY", excerpt: "Strong investor appetite remains.", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=60", likes: 128, comments: 34 },
        { title: "Green-tech subsidies expand", excerpt: "Faster deployment coming soon.", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=60", likes: 97, comments: 21 },
        { title: "SaaS valuations rebound", excerpt: "Market recovery continues.", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=60", likes: 112, comments: 45 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) return;
            try {
                // 1. Fetch AI matches (Top Founders & Startups)
                const matchesRes = await axios.get("http://localhost:5000/api/investor/ai-matches", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const loadedFounders = [];
                const loadedStartups = [];

                let matchIndex = 0;
                for (const f of matchesRes.data) {
                    if (matchIndex >= 10) break; // Maximum 10 startups in carousel
                    
                    let imgUrl = null;
                    if (f.productImageUrl && !f.productImageUrl.startsWith('http') && !f.productImageUrl.startsWith('product-images/') && !f.productImageUrl.startsWith('startup-images/')) {
                        const { data } = await supabase.storage.from(SUPABASE_BUCKET_NAME).createSignedUrl(f.productImageUrl, SIGNED_URL_EXPIRES);
                        if (data) imgUrl = data.signedUrl;
                    }

                    if (matchIndex < 3) {
                        loadedFounders.push({
                            name: f.startupName || "Startup Founder", 
                            role: f.industry?.split(",")[0] || "Founding Member", 
                            img: imgUrl
                        });
                    }

                    loadedStartups.push({
                        name: f.startupName || "New Startup",
                        desc: f.problemStatement || "Solving future problems today.",
                        img: imgUrl,
                        tags: f.industry ? f.industry.split(",").slice(0, 2) : ["Tech", "Startup"]
                    });
                    
                    matchIndex++;
                }

                setTopFounders(loadedFounders);
                setStartUps(loadedStartups);

                // 2. Fetch Portfolio Data
                const fundingRes = await axios.get("http://localhost:5000/api/funding/", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fundings = fundingRes.data;
                const totalInvested = fundings.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
                
                // Track unique startups invested based on dealId or founderId
                const uniqueStartups = new Set(fundings.map(f => f.founderId?._id));

                setPortfolioStats({
                    totalInvestment: totalInvested,
                    totalProfit: totalInvested * 0.15, // Mock 15% estimated ROI for dashboard purposes
                    startupsInvested: uniqueStartups.size
                });

            } catch (error) {
                console.error("Dashboard data fetch error:", error);
            }
        };

        fetchDashboardData();
    }, [token]);

    return (
        <DashboardContent
            topFounders={topFounders}
            startUps={startUps}
            news={news}
            CounterCard={CounterCard}
            NewsCard={NewsCard}
            portfolioStats={portfolioStats}
        />
    );
}
