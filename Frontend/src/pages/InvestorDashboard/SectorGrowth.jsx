import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import SectorGrowthPie from "../../components/charts/SectorGrowthPie";

import InvestmentGrowthLine from "../../components/charts/InvestmentGrowthLine";
import MultiLineGrowth from "../../components/charts/MultiLineGrowth";

const SectorGrowth = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="p-8 space-y-10 min-h-screen transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>


      <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tight text-white">
            Sector <span className="text-blue-400">Growth</span>
          </h1>
          <p className="text-lg uppercase font-bold tracking-widest text-[10px] text-gray-400">
              Market Trends & Analytics
          </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <SectorGrowthPie />
        </div>
        <div className="lg:col-span-1">
          <MultiLineGrowth />
        </div>
        <div className="lg:col-span-2">
          <InvestmentGrowthLine />
        </div>
      </div>

    </div>
  );
};

export default SectorGrowth;
