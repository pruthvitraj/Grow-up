/* src/pages/FounderDashboard/Sidebar.jsx */
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";

const MENU = [
    { name: "Update Profile", to: "/founder/profile",       icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { name: "Communication",  to: "/founder/communication", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
    { name: "Deals",           to: "/founder/deals",        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { name: "Connections",    to: "/founder/connections",   icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
    { name: "Investors",      to: "/founder/investors",     icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { name: "Watchlist",      to: "/founder/watchlist",     icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { name: "Funding / Bonds",to: "/founder/funding",       icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { name: "Appointments",   to: "/founder/appointments",  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { name: "Sector Growth",  to: "/founder/sector",        icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
];

const initials = (name) => {
    if (!name || name === "Founder") return "U";
    const w = name.trim().split(" ").filter(Boolean);
    return w.length >= 2 ? (w[0][0] + w[w.length - 1][0]).toUpperCase() : w[0][0].toUpperCase();
};

export default function Sidebar({ sidebarOpen, setSidebarOpen, setHideNav }) {
    const token  = useAuthStore((s) => s.token);
    const userId = useAuthStore((s) => s.userId);
    const [profileName,  setProfileName]  = useState("Founder");
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (!token || !userId) return;
        axios.get(`http://localhost:5000/api/founder/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (res) => {
            if (res.data?.user?.name) setProfileName(res.data.user.name);
            if (res.data?.productImageUrl) {
                const { data } = await supabase.storage.from("Grow-up")
                    .createSignedUrl(res.data.productImageUrl, 3600);
                if (data?.signedUrl) setProfileImage(data.signedUrl);
            }
        }).catch(() => {});
    }, [token, userId]);

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 h-screen w-64 flex-shrink-0 flex flex-col z-40 transition-transform duration-300 lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{
                    background: 'linear-gradient(145deg, rgba(20,40,90,0.4), rgba(10,20,50,0.8))',
                    backdropFilter: 'blur(20px)',
                    borderRight: "1px solid rgba(80,120,255,0.15)",
                    boxShadow: '10px 0 30px rgba(59,130,246,0.05), inset -1px 0 1px rgba(255,255,255,0.02)',
                }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
                    <span style={{ color: "#e8f0ff", fontWeight: 700, fontSize: 15 }}>Founder</span>
                    <button
                        onClick={() => { setSidebarOpen(false); setHideNav?.(true); }}
                        className="hidden lg:flex items-center justify-center rounded p-1 transition hover:bg-white/10"
                        style={{ color: "#4a78b0" }}
                        title="Collapse"
                    >
                        {/* << double chevron */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1" style={{ color: "#4a78b0" }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Avatar ── */}
                <div className="flex flex-col items-center pt-3 pb-4 px-4 flex-shrink-0">
                    {/* Glowing ring */}
                    <div
                        className="rounded-full p-[3px]"
                        style={{
                            background: "linear-gradient(145deg,#1e90ff 0%,#00c4ff 60%,#1060e0 100%)",
                            boxShadow: "0 0 20px 5px rgba(30,144,255,0.5), 0 0 50px 10px rgba(30,144,255,0.2)",
                        }}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Avatar"
                                className="w-[110px] h-[110px] rounded-full object-cover block"
                                style={{ background: "#071535" }} />
                        ) : (
                            <div
                                className="w-[110px] h-[110px] rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg,#0b2460,#0f3080)" }}
                            >
                                <span style={{ color: "#fff", fontWeight: 900, fontSize: 40, lineHeight: 1 }}>
                                    {initials(profileName)}
                                </span>
                            </div>
                        )}
                    </div>
                    <p style={{ color: "#d0e4ff", fontWeight: 600, fontSize: 18, marginTop: 12 }}>
                        {profileName}
                    </p>
                </div>

                {/* ── Divider ── */}
                <div style={{ height: 1, background: "rgba(20,60,160,0.35)", margin: "0 16px" }} />

                {/* ── Nav — spread evenly to fill height ── */}
                <nav className="flex-1 flex flex-col justify-evenly px-3 py-2">
                    {MENU.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-[12px] text-[17px] font-medium transition-all duration-300
                                 ${isActive ? "text-white bg-blue-500/10" : "text-white/80 hover:text-white hover:bg-white/10"}`
                            }
                            style={({ isActive }) => ({
                                background: isActive
                                    ? "rgba(59,130,246,0.2)"
                                    : "transparent",
                                boxShadow: isActive ? "0 0 20px rgba(59,130,246,0.3)" : "none",
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <svg 
                                        className="w-[22px] h-[22px] flex-shrink-0 transition-transform duration-300" 
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        style={{ filter: isActive ? "drop-shadow(0 0 8px rgba(59,130,246,0.8))" : "none" }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                                    </svg>
                                    <span className="truncate" style={{ letterSpacing: "0.02em" }}>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden" />
            )}
        </>
    );
}
