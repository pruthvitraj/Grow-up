/* src/pages/InvestorDashboard/Sidebar.jsx */
import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen, menu }) {
    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg 
                border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-4">
                    <span className="font-bold text-xl text-gray-800 dark:text-white">Investor</span>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden focus:outline-none"
                    >
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Profile Picture */}
                <div className="px-4 pb-4 flex flex-col items-center">
                    <img
                        src="https://th.bing.com/th/id/OIP.Q2eZFhqhTBqhxQm3_lrTxwHaLH?w=116&h=150&c=6"
                        alt=""
                        className="w-40 h-40 rounded-full object-cover shadow-lg"
                    />
                    <p className="mt-2 text-lg font-bold text-gray-800 dark:text-white">Alex Walker</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2 px-4">
                    {menu.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-2 rounded-lg transition 
                                ${isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-800"
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                />
            )}
        </>
    );
}
