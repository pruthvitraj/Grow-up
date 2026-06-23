import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";


const data = [
  { month: "Jan", FinTech: 42,  HealthTech: 30,  EdTech: 22,  CleanTech: 15 },
  { month: "Feb", FinTech: 65,  HealthTech: 48,  EdTech: 38,  CleanTech: 22 },
  { month: "Mar", FinTech: 98,  HealthTech: 72,  EdTech: 58,  CleanTech: 35 },
  { month: "Apr", FinTech: 130, HealthTech: 105, EdTech: 80,  CleanTech: 50 },
  { month: "May", FinTech: 158, HealthTech: 128, EdTech: 102, CleanTech: 68 },
  { month: "Jun", FinTech: 185, HealthTech: 150, EdTech: 122, CleanTech: 88 },
  { month: "Jul", FinTech: 210, HealthTech: 175, EdTech: 140, CleanTech: 110 },
];

const LINES = [
  { key: "FinTech",    color: "#6366f1" },
  { key: "HealthTech", color: "#22c55e" },
  { key: "EdTech",     color: "#f97316" },
  { key: "CleanTech",  color: "#14b8a6" },
];

const MultiLineGrowth = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 rounded-[2.5rem] border shadow-sm h-full transition-all ${
        isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100"
    }`}>
      <h3 className={`text-xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
        Market Comparison
      </h3>
      <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-semibold">Growth index by sector (Jan–Jul)</p>


      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} opacity={0.4} />
          <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                border: isDark ? 'none' : '1px solid #e5e7eb', 
                borderRadius: '14px', 
                color: isDark ? '#fff' : '#111827', 
                padding: '10px 16px',
                boxShadow: isDark ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ fontWeight: 700, color: isDark ? '#e5e7eb' : '#374151' }}
            formatter={(value, name) => [`${value} pts`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ color: isDark ? '#9ca3af' : '#4b5563', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
          />

          {LINES.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiLineGrowth;
