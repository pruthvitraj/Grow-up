import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


const data = [
  { name: "FinTech",    value: 32 },
  { name: "HealthTech", value: 22 },
  { name: "EdTech",     value: 16 },
  { name: "AI / SaaS",  value: 18 },
  { name: "CleanTech",  value: 12 },
];

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ec4899", "#14b8a6"];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SectorGrowthPie = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`p-8 rounded-[2.5rem] border shadow-sm h-full transition-all ${
        isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100"
    }`}>
      <h3 className={`text-xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
        Sector Allocation
      </h3>
      <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest font-semibold">Portfolio breakdown by sector</p>


      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={115}
            paddingAngle={5}
            stroke="none"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#ffffff', 
                border: isDark ? 'none' : '1px solid #e5e7eb', 
                borderRadius: '12px', 
                color: isDark ? '#fff' : '#111827', 
                fontSize: '13px',
                boxShadow: isDark ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: isDark ? '#e5e7eb' : '#374151' }}
            formatter={(value) => [`${value}%`, "Share"]}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ color: isDark ? '#9ca3af' : '#4b5563', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
          />

        </PieChart>
      </ResponsiveContainer>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((item, i) => (
          <span key={item.name} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: COLORS[i] }}>
            {item.name} — {item.value}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default SectorGrowthPie;
