import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const menuItems = [
  { id: 1, label: 'Update Profile', icon: 'profile' },
  { id: 2, label: 'Communication', icon: 'message', active: true },
  { id: 3, label: 'Deals', icon: 'briefcase' },
  { id: 4, label: 'Connections', icon: 'users' },
  { id: 5, label: 'Investors', icon: 'trending' },
  { id: 6, label: 'Watchlist', icon: 'bookmark' },
  { id: 7, label: 'Funding / Bonds', icon: 'coins' },
  { id: 8, label: 'Appointments', icon: 'calendar' },
  { id: 9, label: 'Sector Growth', icon: 'chart' },
];

const iconMap = {
  profile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  message: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m13 0a2.592 2.592 0 00-.1-1.744m0 0A2.25 2.25 0 0015 2H9a2.25 2.25 0 00-2.236 2.512m13.5 0a2.592 2.592 0 00-.1-1.744M9 15c0 .9.104 1.778.309 2.632m0 0c.133.413.393.775.771 1.042a2.591 2.591 0 002.91.588c.19-.13.39-.295.59-.479m0 0c.133.413.393.775.771 1.042a2.591 2.591 0 002.91.588c.19-.13.39-.295.59-.479m0 0a2.592 2.592 0 01-.11 1.662" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  trending: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  bookmark: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  coins: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-blue-800/30'
            : 'bg-gradient-to-b from-slate-100 to-blue-50 border-r border-slate-200'
        } transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-blue-800/20 flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/50 transition-all ${
                sidebarOpen ? 'ring-2 ring-blue-400/50' : ''
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              U
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Founder
                </p>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? isDark
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                    : isDark
                    ? 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-300'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
              >
                <span className="flex-shrink-0">{iconMap[item.icon]}</span>
                {sidebarOpen && <span className="ml-3 text-sm font-medium truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Settings at bottom */}
          <div className="p-4 border-t border-blue-800/20 space-y-2">
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                isDark
                  ? 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-300'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {sidebarOpen && <span className="ml-3 text-sm font-medium">Settings</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle button when sidebar is collapsed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed top-4 left-24 z-30 p-2 rounded-lg ${
            isDark ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          } transition-all`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
