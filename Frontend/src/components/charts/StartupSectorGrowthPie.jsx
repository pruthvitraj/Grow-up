import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const data = [
  { name: "Core Product", value: 55 },
  { name: "R&D", value: 20 },
  { name: "Marketing", value: 15 },
  { name: "Operations", value: 10 }
];

const COLORS = ["#4f46e5", "#22c55e", "#f97316", "#ec4899"];

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

const StartupSectorGrowthPie = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-sm border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <h3 className={`text-xl font-black mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
        Resource Allocation
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={8}
            stroke="none"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: isDark ? '#111827' : '#ffffff', border: isDark ? 'none' : '1px solid #e5e7eb', borderRadius: '12px', color: isDark ? '#fff' : '#111827' }}
            itemStyle={{ color: isDark ? '#fff' : '#111827' }}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ color: isDark ? '#9ca3af' : '#4b5563', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {data.map((item, i) => (
          <span key={item.name} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: COLORS[i] }}>
            {item.name} — {item.value}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default StartupSectorGrowthPie;
