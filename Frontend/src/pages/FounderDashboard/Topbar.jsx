/* src/pages/FounderDashboard/Topbar.jsx */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import NotificationDropdown from "../../components/NotificationDropdown";

export default function Topbar({ setSidebarOpen }) {
    const navigate = useNavigate();
    const logout   = useAuthStore((s) => s.logout);

    return (
        <header
            className="flex-shrink-0 flex items-center justify-between px-5 py-3 z-20"
            style={{
                background: 'linear-gradient(145deg, rgba(20,40,90,0.4), rgba(10,20,50,0.8))',
                backdropFilter: 'blur(20px)',
                borderBottom: "1px solid rgba(80,120,255,0.15)",
                boxShadow: '0 4px 30px rgba(59,130,246,0.05), inset 0 -1px 1px rgba(255,255,255,0.02)',
            }}
        >
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden transition-transform hover:scale-110" style={{ color: "#60a5fa" }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <div className="flex-1" />

            {/* Right icons */}
            <div className="flex items-center gap-3 pr-2">
                {/* Bell */}
                <NotificationDropdown />

                {/* Message */}
                <button
                    title="Messages"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#94a3b8",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(59,130,246,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* Logout — red */}
                <button
                    title="Logout"
                    onClick={() => { logout(); navigate("/login"); }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>

                {/* Decorative chevron */}
                <span style={{ color: "#2e4f70", marginLeft: 2 }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </header>
    );
}
