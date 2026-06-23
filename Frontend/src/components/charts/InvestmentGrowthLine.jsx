import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";


const data = [
  { period: "Jan", amount: 500000  },
  { period: "Feb", amount: 750000  },
  { period: "Mar", amount: 1200000 },
  { period: "Apr", amount: 1800000 },
  { period: "May", amount: 2600000 },
  { period: "Jun", amount: 3100000 },
  { period: "Jul", amount: 4200000 },
];

const formatINR = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000)   return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000)     return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const InvestmentGrowthLine = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${
        isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100"
    }`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className={`text-xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            Investment Performance
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Cumulative portfolio value over time</p>
        </div>

        <div className={`px-4 py-2 rounded-2xl ${isDark ? "bg-indigo-900/30" : "bg-indigo-50"}`}>
          <span className={`font-black text-sm ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>+740% YTD</span>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} opacity={0.4} />
          <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatINR} width={60} />
          <Tooltip
            contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                border: isDark ? 'none' : '1px solid #e5e7eb', 
                borderRadius: '14px', 
                color: isDark ? '#fff' : '#111827', 
                padding: '10px 16px',
                boxShadow: isDark ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: isDark ? '#e5e7eb' : '#374151', fontWeight: 700 }}
            formatter={(value) => [formatINR(value), "Portfolio Value"]}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6366f1"
            strokeWidth={4}
            fill="url(#colorAmount)"
            dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentGrowthLine;
