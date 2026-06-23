import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopInvestorsSection from './TopInvestorsSection';
import AnalyticsSection from './AnalyticsSection';
import MetricsCards from './MetricsCards';
import { useTheme } from '../../hooks/useTheme';

export default function InvestorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <div className="p-8 space-y-8">
            {/* Top Investors Section */}
            <TopInvestorsSection />

            {/* Analytics Section */}
            <AnalyticsSection />

            {/* Metrics Cards */}
            <MetricsCards />
          </div>
        </div>
      </div>
    </div>
  );
}
