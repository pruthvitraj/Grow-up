/* AnalyticsSection.jsx — My Analytics card
   Contains: investor profile row (grid, fills full width) + 3 metric stat cards */
import React, { useState, useEffect } from 'react';

/* ── Animated counter ── */
function AnimCounter({ target = 0, prefix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    let cur = 0; const step = target / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{val.toLocaleString()}</>;
}

/* ── Default fallback data ── */
const DEF_INV = [
  { id: 1, name: 'Alice Patel', amount: '$250K', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  { id: 2, name: 'David Wong', amount: '$180K', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 3, name: 'Sarah Collins', amount: '$300K', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 4, name: 'Michael R.', amount: '$150K', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
];

const METRICS = [
  {
    key: 'totalRaised', label: 'Total Raised', prefix: '$', color: '#22c55e',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" /></svg>,
  },
  {
    key: 'currentValuation', label: 'Current Valuation', prefix: '$', color: '#3b82f6',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
  {
    key: 'totalInvestors', label: 'Total Investors', prefix: '', color: '#a855f7',
    icon: <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
];

export default function AnalyticsSection({ investorsList = [], metricsData = {} }) {
  const investors = (investorsList.length > 0 ? investorsList.slice(0, 4) : DEF_INV).map((inv, i) => ({
    id: i, name: inv.name || 'Investor', amount: inv.amount || '$0', img: inv.img || null,
  }));

  return (
    <div
      className="rounded-[20px] flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: '0 0 50px rgba(59,130,246,0.25), inset 0 1px 1px rgba(255,255,255,0.08)',
        padding: '24px 28px',
        gap: 20,
      }}
    >
      
      {/* Top highlight shine overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {/* Title */}
      <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: 17, margin: 0 }}>My Analytics</h3>
      {/* ── Investor row ── */}
      <div
  className="flex gap-4 justify-between w-full px-1 my-4 rounded-2xl"
  style={{
    background: 'linear-gradient(135deg, rgba(15,42,90,0.5) 0%, rgba(8,26,58,0.6) 50%, rgba(5,15,36,0.5) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(59,130,246,0.25)',
    boxShadow: `
      0 0 60px rgba(59,130,246,0.15),
      inset 0 1px 1px rgba(255,255,255,0.06),
      0 8px 32px rgba(2,6,23,0.6)
    `,
    padding: '18px 16px'
  }}
>
  {investors.map((inv) => (
    <div
      key={inv.id}
      className="relative flex items-center w-full group cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >

      {/* Rectangle Info Box */}
      <div className="
        w-full pl-[60px] pr-3 py-2.5 rounded-[16px]
        bg-white/[0.03] backdrop-blur-md
        border border-white/[0.08]
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        group-hover:border-blue-400/30
        transition-all duration-300
      ">
        <p className="text-white text-[14.5px] font-semibold truncate tracking-wide leading-tight">
          {inv.name}
        </p>
        <p className="text-[#94a3b8] text-[12.5px] truncate leading-tight">
          Invested: <span className="text-white font-bold">{inv.amount}</span>
        </p>
      </div>

      {/* Avatar */}
      {inv.img ? (
        <img
          src={inv.img}
          alt={inv.name}
          className="
            absolute left-[-12px] w-[56px] h-[56px]
            rounded-full object-cover
            ring-2 ring-blue-400/40
            shadow-[0_0_20px_rgba(59,130,246,0.35)]
            group-hover:scale-105
            transition-all duration-300
          "
        />
      ) : (
        <div
          className="
            absolute left-[-12px] w-[56px] h-[56px]
            rounded-full flex items-center justify-center
            ring-2 ring-blue-400/40
            shadow-[0_0_20px_rgba(59,130,246,0.35)]
          "
          style={{
            background: 'linear-gradient(135deg,#0e38a8,#1448c8)'
          }}
        >
          <span className="text-white font-bold text-lg">
            {inv.name[0]}
          </span>
        </div>
      )}

    </div>
  ))}
</div>



      {/* ── 3 metric cards ── */}
      <div className="grid grid-cols-3 gap-6">
        {METRICS.map((m, i) => {
          const num = typeof metricsData[m.key] === 'number' ? metricsData[m.key] : parseInt(metricsData[m.key]) || 0;
          return (
            <div
              key={m.key}
              className={`rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b ${i === 0 ? 'from-amber-600/60 to-amber-400/40 hover:to-amber-500/60' : i === 1 ? 'from-indigo-700/60 to-indigo-500/40 hover:to-indigo-600/60' : 'from-blue-700/60 to-blue-500/40 hover:to-blue-600/60'}`}
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '24px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.2) 0%, transparent 60%)',
                }}
              />

              <div style={{ color: '#ffffff', marginBottom: 12, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }}>{m.icon}</div>
              <p className="truncate w-full" style={{ color: '#ffffff', fontWeight: 800, fontSize: 32, margin: 0, lineHeight: 1 }}>
                <AnimCounter target={num} prefix={m.prefix} />
              </p>
              <p style={{ color: '#ffffff/70', fontSize: 14, marginTop: 8, letterSpacing: '0.05em' }}>{m.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
