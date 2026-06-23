import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import StartupValuationGrowthLine from "../../components/charts/StartupValuationGrowthLine";
import StartupSectorGrowthPie from "../../components/charts/StartupSectorGrowthPie";
import StartupVsSectorMultiLine from "../../components/charts/StartupVsSectorMultiLine";

const Sectorgrowth = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <div className="p-8 space-y-10 min-h-screen transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>
      <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Startup <span className="text-blue-400">Growth</span>
          </h1>
          <p className="text-lg uppercase font-bold tracking-widest text-[10px] text-gray-400">
              Performance & Benchmarking
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <StartupSectorGrowthPie />
        </div>
        <div className="lg:col-span-1">
          <StartupVsSectorMultiLine />
        </div>
        <div className="lg:col-span-2">
          <StartupValuationGrowthLine />
        </div>
      </div>

    </div>
  );
};

export default Sectorgrowth;
