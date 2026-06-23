import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const data = [
  { period: "Jan", valuation: 2 },
  { period: "Feb", valuation: 2.5 },
  { period: "Mar", valuation: 3.2 },
  { period: "Apr", valuation: 4.1 },
  { period: "May", valuation: 5 }
];

const StartupValuationGrowthLine = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-sm border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
      <h3 className={`text-xl font-black mb-8 ${isDark ? "text-white" : "text-gray-900"}`}>
        Valuation Trajectory (₹ Cr)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey="period" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: isDark ? '#111827' : '#ffffff', border: isDark ? 'none' : '1px solid #e5e7eb', borderRadius: '12px', color: isDark ? '#fff' : '#111827' }}
            itemStyle={{ color: isDark ? '#fff' : '#111827' }}
          />
          <Line
            type="monotone"
            dataKey="valuation"
            stroke="#10b981"
            strokeWidth={5}
            dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StartupValuationGrowthLine;
