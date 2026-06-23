/* BestInvestorsSection.jsx */
import React from 'react';

const DEF = [
  { id:1, name:'Alice Patel',   role:'Angel Investor', invested:'$250K', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face' },
  { id:2, name:'David Wong',    role:'Venture Capital',invested:'$180K', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face' },
  { id:3, name:'Sarah Collins', role:'Seed Investor',  invested:'$300K', img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face' },
  { id:4, name:'Michael R.',    role:'Growth Fund',    invested:'$150K', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face' },
  { id:5, name:'Priya Nair',    role:'Angel Investor', invested:'$200K', img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face' },
  { id:6, name:'James Liu',     role:'PE Firm',        invested:'$500K', img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face' },
];

const scroll = (dir) =>
  document.getElementById('best-inv-scroll')?.scrollBy({ left: dir * 280, behavior: 'smooth' });

const getCardGradient = (index) => {
  const gradients = [
    'from-amber-600/60 to-amber-400/40 hover:to-amber-500/60',
    'from-indigo-700/60 to-indigo-500/40 hover:to-indigo-600/60',
    'from-blue-700/60 to-blue-500/40 hover:to-blue-600/60',
    'from-slate-800/80 to-slate-700/60 hover:to-slate-700/80',
  ];
  return gradients[index % gradients.length];
};

export default function BestInvestorsSection({ investorsList = [] }) {
  const investors = (investorsList.length > 0
    ? investorsList.map((inv, i) => ({ id:i, name:inv.name||'Investor', role:inv.role||'Investor', invested:inv.amount||'$0', img:inv.img||null }))
    : DEF);

  return (
    <div
      className="rounded-[20px] flex-shrink-0 flex flex-col gap-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: '0 0 50px rgba(59,130,246,0.25), inset 0 1px 1px rgba(255,255,255,0.08)',
        padding: '24px 28px',
      }}
    >
      {/* Top highlight shine overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h3 style={{ color: '#ffffff', fontWeight: 700, fontSize: 17, margin: 0 }}>Best Investors</h3>
        <div className="flex gap-2">
          {['←','→'].map((arrow, i) => (
            <button
              key={arrow}
              onClick={() => scroll(i === 0 ? -1 : 1)}
              className="flex items-center justify-center rounded-lg transition hover:brightness-125"
              style={{
                width: 32, height: 32,
                background: 'rgba(59,130,246,0.3)',
                border: '1px solid rgba(59,130,246,0.5)',
                color: '#dbeafe',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={i === 0 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable cards */}
      <div id="best-inv-scroll" className="flex gap-3 overflow-x-auto pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {investors.map((inv, index) => (
          <div
            key={inv.id}
            className={`min-w-[150px] md:min-w-[180px] flex-shrink-0 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer bg-gradient-to-b ${getCardGradient(index)}`}
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Hover glow hotspot */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.2) 0%, transparent 60%)',
              }}
            />
            {inv.img ? (
              <img src={inv.img} alt={inv.name}
                className="w-16 h-16 rounded-full object-cover mt-2 relative z-10"
                style={{ border: '2px solid rgba(255,255,255,0.4)' }} />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mt-2 relative z-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl shadow-lg"
                style={{ boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}>
                {inv.name[0]}
              </div>
            )}
            <p className="truncate w-full font-bold text-center text-white relative z-10" style={{ fontSize: 16, margin: '8px 0 2px' }}>
              {inv.name}
            </p>
            <p className="truncate w-full text-center text-white/70 relative z-10" style={{ fontSize: 13, margin: 0 }}>
              {inv.role}
            </p>{inv.invested !== '$0' && (
              <span className="rounded-full px-3 py-1 text-[11px] font-bold mt-2 mb-1 flex items-center justify-center relative z-10 bg-white/20 text-white border border-white/30 backdrop-blur-sm"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                {inv.invested}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
