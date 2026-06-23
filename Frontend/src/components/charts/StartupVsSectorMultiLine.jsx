import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const data = [
  { month: "Jan", Startup: 20, SectorAvg: 15 },
  { month: "Feb", Startup: 30, SectorAvg: 22 },
  { month: "Mar", Startup: 45, SectorAvg: 35 },
  { month: "Apr", Startup: 60, SectorAvg: 50 }
];

const StartupVsSectorMultiLine = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-sm border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <h3 className={`text-xl font-black mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
        Market Benchmarking
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: isDark ? '#111827' : '#ffffff', border: isDark ? 'none' : '1px solid #e5e7eb', borderRadius: '12px', color: isDark ? '#fff' : '#111827' }}
            itemStyle={{ color: isDark ? '#fff' : '#111827' }}
          />
          <Legend
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span style={{ color: isDark ? '#9ca3af' : '#4b5563', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
          />

          <Line type="monotone" name="Startup Growth" dataKey="Startup" stroke="#22c55e" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" name="Sector Average" dataKey="SectorAvg" stroke="#6366f1" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StartupVsSectorMultiLine;
