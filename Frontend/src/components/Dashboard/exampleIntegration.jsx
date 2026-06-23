/**
 * Complete Example: Using the Investor Dashboard with Real API Integration
 * 
 * This file demonstrates how to fully integrate the dashboard with your backend
 * Follow the patterns shown here to connect your actual API endpoints
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * EXAMPLE 1: Simple API Wrapper
 * Create this in your utils/api.js or services/api.js
 */
export const apiService = {
  // Fetch founder's investors
  fetchInvestors: async (founderId) => {
    try {
      const response = await fetch(`/api/founder/${founderId}/investors`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch investors');
      return await response.json();
    } catch (error) {
      console.error('Error fetching investors:', error);
      throw error;
    }
  },

  // Fetch metrics
  fetchMetrics: async (founderId) => {
    try {
      const response = await fetch(`/api/founder/${founderId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  // Search chats/investors
  searchChats: async (query) => {
    try {
      const response = await fetch(
        `/api/chats/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to search');
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },
};

/**
 * EXAMPLE 2: Enhanced Analytics Section with Real Data
 */
export function EnhancedAnalyticsSection() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        setLoading(true);
        const founderId = localStorage.getItem('founderId');
        const data = await apiService.fetchInvestors(founderId);
        setInvestors(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInvestors();
  }, []);

  if (loading) return <div className={isDark ? 'text-white' : 'text-slate-900'}>Loading investors...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className={`rounded-2xl p-8 backdrop-blur-xl ${
      isDark
        ? 'bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-blue-500/5 border border-blue-500/20'
        : 'bg-gradient-to-br from-white/50 via-blue-50/30 to-white/30 border border-blue-200/30'
    }`}>
      <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        My Analytics
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {investors.map((investor) => (
          <div
            key={investor.id}
            className={`flex-shrink-0 w-40 p-4 rounded-xl transition-all hover:scale-105 ${
              isDark
                ? 'bg-slate-800/40 border border-blue-500/20 hover:border-blue-500/50'
                : 'bg-white/60 border border-blue-200 hover:border-blue-400'
            }`}
          >
            {/* Investor profile content */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                {investor.name[0]}
              </div>
              <p className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-slate-900'}`}>
                {investor.name}
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Invested: ${investor.totalInvested}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * EXAMPLE 3: Enhanced Metrics with Real Data
 */
export function EnhancedMetricsCards() {
  const [metrics, setMetrics] = useState({
    totalRaised: '$0',
    currentValuation: '$0',
    totalInvestors: 0,
  });
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const founderId = localStorage.getItem('founderId');
        const data = await apiService.fetchMetrics(founderId);
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();

    // Poll for updates every 10 seconds
    const interval = setInterval(loadMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      id: 1,
      label: 'Total Raised',
      value: metrics.totalRaised,
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 2,
      label: 'Current Valuation',
      value: metrics.currentValuation,
      icon: '📈',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 3,
      label: 'Total Investors',
      value: metrics.totalInvestors,
      icon: '👥',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metricsData.map((metric) => (
        <div
          key={metric.id}
          className={`group rounded-2xl p-6 backdrop-blur-xl transition-all hover:scale-105 ${
            isDark
              ? 'bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-blue-500/5 border border-blue-500/20'
              : 'bg-gradient-to-br from-white/50 via-blue-50/30 to-white/30 border border-blue-200/30'
          }`}
        >
          <div className={`text-2xl mb-2`}>{metric.icon}</div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metric.value}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * EXAMPLE 4: Enhanced Search with Results
 */
export function EnhancedSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const searchResults = await apiService.searchChats(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      <div className={`relative rounded-xl ${
        isDark
          ? 'bg-slate-900/40 border border-blue-500/30'
          : 'bg-white/60 border border-blue-200'
      }`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className={`w-full px-12 py-4 bg-transparent outline-none ${
            isDark ? 'text-gray-100' : 'text-slate-900'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className={`mt-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
          {results.map((result) => (
            <div
              key={result.id}
              className={`p-3 border-b cursor-pointer hover:opacity-80 ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              }`}
            >
              <p className={isDark ? 'text-gray-100' : 'text-slate-900'}>
                {result.name}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {result.preview}
              </p>
            </div>
          ))}
        </div>
      )}

      {isSearching && <p className="mt-2 text-gray-500">Searching...</p>}
    </div>
  );
}

/**
 * EXAMPLE 5: Complete Dashboard with Real Data
 */
export function CompleteDashboardWithAPI() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="p-8 space-y-8">
        {/* Search Section */}
        <div className={`rounded-2xl p-8 backdrop-blur-xl ${
          isDark
            ? 'bg-gradient-to-br from-blue-500/10 via-slate-800/20 to-blue-500/5 border border-blue-500/20'
            : 'bg-gradient-to-br from-white/50 via-blue-50/30 to-white/30 border border-blue-200/30'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Top Investors
          </h2>
          <EnhancedSearchBar />
        </div>

        {/* Analytics */}
        <EnhancedAnalyticsSection />

        {/* Metrics */}
        <EnhancedMetricsCards />
      </div>
    </div>
  );
}

/**
 * EXAMPLE 6: Using in App.jsx
 */
export function AppIntegrationExample() {
  return (
    <>
      {/* In your App.jsx routes: */}
      {/* <Route path="/founder-dashboard" element={<CompleteDashboardWithAPI />} /> */}
    </>
  );
}

/**
 * EXAMPLE 7: Real-time Updates with WebSocket
 */
export class DashboardWithWebSocket {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.socket = null;
  }

  connect() {
    // Example with Socket.io
    // import io from 'socket.io-client';
    // this.socket = io(this.serverUrl);
    // this.socket.on('metrics_update', (data) => {
    //   // Update metrics in state
    // });
  }

  disconnect() {
    // if (this.socket) this.socket.disconnect();
  }
}

export default {
  apiService,
  EnhancedAnalyticsSection,
  EnhancedMetricsCards,
  EnhancedSearchBar,
  CompleteDashboardWithAPI,
};
