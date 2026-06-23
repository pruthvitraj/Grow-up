/* src/pages/FounderDashboard/FounderDashBoard.jsx */
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./Sidebar.jsx";
import Topbar  from "./Topbar.jsx";

export default function FounderDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hideNav,     setHideNav]     = useState(false);

    return (
        <div
            className="h-screen flex overflow-hidden"
            style={{
                /* Deep, premium neon-blue fintech theme */
                background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)',
            }}
        >
            <Toaster position="top-right" />

            {/* Sidebar */}
            {!hideNav && (
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    setHideNav={setHideNav}
                />
            )}

            {/* Main column */}
            <div className={`flex flex-col flex-1 h-screen overflow-hidden transition-all duration-300 ${!hideNav ? "lg:ml-64" : ""}`}>
                {/* Topbar */}
                {!hideNav && <Topbar setSidebarOpen={setSidebarOpen} />}

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto h-0">
                    <Outlet />
                </main>
            </div>

            {/* Show sidebar FAB when collapsed */}
            {hideNav && (
                <button
                    onClick={() => setHideNav(false)}
                    className="fixed top-20 left-0 z-50 rounded-r-xl p-3 shadow-xl transition hover:translate-x-1"
                    style={{ background: "rgba(14,56,168,0.9)", color: "#fff" }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
}
