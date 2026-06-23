import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import NotificationDropdown from "../../components/NotificationDropdown";
import ThemeToggle from "../../components/ThemeToggle";
import { LogOut } from "lucide-react";

export default function Topbar({ setSidebarOpen, icons }) {
    const navigate = useNavigate();

    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        logout();          // ✅ clears auth (token, userId, status, etc.)
        navigate("/login"); // ✅ redirect to login page
    };

    return (
        <header className="sticky top-0 z-20 backdrop-blur-lg border-b flex items-center justify-between px-6 py-3 transition-colors bg-blue-900/40 border-blue-400/20">

            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden focus:outline-none text-gray-200"
            >
                <svg className="w-6 h-6" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Right-side Icons */}
            <div className="flex items-center gap-3 ml-auto">
                <NotificationDropdown />

                <ThemeToggle />


                <button
                    title="Logout"
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all relative border border-rose-500/20 flex items-center justify-center"
                >
                    <LogOut size={20} />
                </button>

            </div>
        </header>
    );
}
