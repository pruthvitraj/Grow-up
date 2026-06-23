import React, { useState, useEffect } from 'react';

/* Animated number counter */
function AnimatedNumber({ target = 0, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

const CARD_CONFIG = [
  {
    id: 1,
    key: 'totalRaised',
    label: 'Total Raised',
    prefix: '$',
    iconColor: '#00d084',           // green
    glowColor: 'rgba(0,208,132,0.15)',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v3m-4.5-6.5H6v4h1.5m6.5-4H18v4h-1.5" />
      </svg>
    ),
  },
  {
    id: 2,
    key: 'currentValuation',
    label: 'Current Valuation',
    prefix: '$',
    iconColor: '#3b9eff',           // blue
    glowColor: 'rgba(59,158,255,0.15)',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 3,
    key: 'totalInvestors',
    label: 'Total Investors',
    prefix: '',
    iconColor: '#b07aff',           // purple
    glowColor: 'rgba(176,122,255,0.15)',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function MetricsCards({ metricsData = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {CARD_CONFIG.map((card) => {
        const rawVal = metricsData[card.key] ?? 0;
        const numVal = typeof rawVal === 'number' ? rawVal : parseInt(rawVal) || 0;

        const gradients = [
          'from-amber-600/60 to-amber-400/40 hover:to-amber-500/60',
          'from-indigo-700/60 to-indigo-500/40 hover:to-indigo-600/60',
          'from-blue-700/60 to-blue-500/40 hover:to-blue-600/60',
        ];

        return (
          <div
            key={card.id}
            className={`relative rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] cursor-pointer bg-gradient-to-b ${gradients[card.id - 1]}`}
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none\"
              style={{ background: 'radial-gradient(circle at 50% -20%, rgba(255,255,255,0.2) 0%, transparent 60%)' }}
            />

            {/* Icon */}
            <div style={{ color: '#ffffff', position: 'relative', zIndex: 10 }}>
              {card.icon}
            </div>

            {/* Value */}
            <p className=\"text-3xl font-extrabold text-white tracking-tight relative z-10\">
              <AnimatedNumber target={numVal} prefix={card.prefix} />
            </p>

            {/* Label */}
            <p className=\"text-sm text-white/70 font-medium relative z-10\">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
