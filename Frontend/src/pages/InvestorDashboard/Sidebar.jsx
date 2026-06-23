/* src/pages/InvestorDashboard/Sidebar.jsx */
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";

export default function Sidebar({ sidebarOpen, setSidebarOpen, setHideNav }) {
    const token = useAuthStore((s) => s.token);
    const userId = useAuthStore((s) => s.userId);

    const [profileName, setProfileName] = useState("Loading...");
    const [profileImage, setProfileImage] = useState(null);

    const getInitials = (name) => {
        if (!name || name === "Loading..." || name === "Investor") return "U";
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return "U";
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token || !userId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/profile/investor/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.data?.fullName) {
                    setProfileName(res.data.fullName);
                } else if (res.data?.user?.name) {
                    setProfileName(res.data.user.name);
                }
                
                if (res.data?.investerprofilePhoto) {
                    const SUPABASE_BUCKET_NAME = "Grow-up";
                    const { data } = await supabase.storage.from(SUPABASE_BUCKET_NAME).createSignedUrl(res.data.investerprofilePhoto, 60*60);
                    if (data?.signedUrl) {
                        setProfileImage(data.signedUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch sidebar profile", err);
                setProfileName("Investor");
            }
        };
        fetchProfile();
    }, [token, userId]);

    const icons = {
        profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        chat: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
        deal: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        connection: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        founder: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        watchlist: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        funding: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" /></svg>,
        appointment: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
        sector: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
        sun: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        moon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
        bell: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
        logout: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,

    };

    const menu = [
        { name: "Update Profile", icon: icons.profile, to: "/investor/profile" },
        { name: "Communication", icon: icons.chat, to: "/investor/communication" },
        { name: "Deals", icon: icons.deal, to: "/investor/deals" },
        { name: "Connections", icon: icons.connection, to: "/investor/connections" },
        { name: "Founders", icon: icons.founder, to: "/investor/founders" },
        { name: "Watchlist", icon: icons.watchlist, to: "/investor/watchlist" },
        { name: "Funding / Bonds", icon: icons.funding, to: "/investor/funding" },
        { name: "Appointments", icon: icons.appointment, to: "/investor/appointments" },
        { name: "Sector Growth", icon: icons.sector, to: "/investor/sectorgrowth" },
    ];

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 backdrop-blur-lg 
                border-r transform transition-transform lg:translate-x-0 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                bg-blue-950/60 border-blue-400/20 text-white`}
            >
                <div className="flex items-center justify-between p-4">
                    <span className="font-bold text-xl text-white">Investor</span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                setSidebarOpen(false);
                                if (typeof setHideNav === 'function') setHideNav(true);
                            }}
                            className="p-1.5 rounded-lg transition-colors hidden lg:block hover:bg-blue-800/40 text-blue-300"
                            title="Hide Sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden focus:outline-none p-1.5"
                        >
                            <svg className="w-6 h-6 text-gray-200" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Profile Picture */}
                <div className="px-4 pb-4 flex flex-col items-center overflow-hidden w-full">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover shadow-lg flex-shrink-0 border-4 border-blue-400/30"
                        />
                    ) : (
                        <div className="w-36 h-36 rounded-full shadow-lg flex items-center justify-center text-5xl font-black flex-shrink-0 border-4 bg-blue-900/40 text-blue-300 border-blue-400/30">
                            {getInitials(profileName)}
                        </div>
                    )}
                    <div className="w-full px-2 mt-4">
                        <p className="text-lg font-bold text-center truncate text-white" title={profileName}>
                            {profileName}
                        </p>
                    </div>
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
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-blue-200 hover:bg-blue-800/40"
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
