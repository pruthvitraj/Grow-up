import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";
import TopInvestorsSection from "../../components/Dashboard/TopInvestorsSection";
import AnalyticsSection from "../../components/Dashboard/AnalyticsSection";
import BestInvestorsSection from "../../components/Dashboard/BestInvestorsSection";

const SUPABASE_BUCKET = "Grow-up";
const SIGNED_URL_TTL = 60 * 5;

export default function FounderHome() {
    const token  = useAuthStore((s) => s.token);
    const userId = useAuthStore((s) => s.userId);

    const [topInvestors, setTopInvestors] = useState([]);
    const [metricsData, setMetricsData] = useState({
        totalRaised: 0,
        currentValuation: 0,
        totalInvestors: 0,
    });

    useEffect(() => {
        const load = async () => {
            if (!token) return;
            try {
                /* ── AI-matched investors ── */
                const matchRes = await axios.get(
                    "http://localhost:5000/api/founder/ai-matches",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const loaded = [];
                for (const inv of (matchRes.data || []).slice(0, 6)) {
                    let imgUrl = null;
                    if (inv.investorprofilePhoto && !inv.investorprofilePhoto.startsWith("http")) {
                        const { data } = await supabase.storage
                            .from(SUPABASE_BUCKET)
                            .createSignedUrl(inv.investorprofilePhoto, SIGNED_URL_TTL);
                        if (data) imgUrl = data.signedUrl;
                    }
                    loaded.push({
                        name  : inv.user?.name || "Investor",
                        role  : inv.jobStatus  || "Angel Investor",
                        amount: inv.investmentRange || "$0",
                        img   : imgUrl,
                    });
                }
                setTopInvestors(loaded);

                /* ── Founder valuation ── */
                const founderRes = await axios.get(
                    `http://localhost:5000/api/founder/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                /* ── Funding rounds ── */
                const fundingRes = await axios.get(
                    "http://localhost:5000/api/funding/",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const fundings = fundingRes.data || [];
                const totalRaised = fundings.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
                const uniqueInvestors = new Set(
                    fundings.map((f) => f.investorId?._id || f.investorId)
                ).size;

                setMetricsData({
                    totalRaised,
                    currentValuation: parseInt(founderRes.data?.valuation) || 0,
                    totalInvestors  : uniqueInvestors,
                });
            } catch (err) {
                console.error("FounderHome fetch error:", err);
            }
        };
        load();
    }, [token, userId]);

    return (
        <div className="h-full flex flex-col items-center overflow-y-auto">
            <div className="w-full max-w-[1200px] flex flex-col gap-8 p-6 lg:p-10">
                {/* 1 ── Top Investors (search bar card) */}
                <TopInvestorsSection />

                {/* 2 ── My Analytics: investor row + 3 metric cards combined */}
                <AnalyticsSection
                    investorsList={topInvestors}
                    metricsData={metricsData}
                />

                {/* 3 ── Best Investors (scrollable card row) */}
                <BestInvestorsSection investorsList={topInvestors} />
            </div>
        </div>
    );
}
