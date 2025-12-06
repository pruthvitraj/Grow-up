/* src/pages/InvestorDashboard/Topbar.jsx */
import React from "react";

export default function Topbar({ setSidebarOpen, dark, setDark, icons }) {
    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg 
            border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 py-3"
        >
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden focus:outline-none"
            >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Right-side Icons */}
            <div className="flex items-center gap-3 ml-auto">
                <button title="Notifications" className="p-2 rounded-lg bg-white ">
                    {icons.bell}
                </button>

                <button
                    onClick={() => setDark(!dark)}
                    title="Toggle theme"
                    className="p-2 rounded-lg bg-white "
                >
                    {dark ? icons.sun : icons.moon}
                </button>

                <button title="Logout" className="p-2 rounded-lg bg-white ">
                    {icons.logout}
                </button>
            </div>
        </header>
    );
}
