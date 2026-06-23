/* TopInvestorsSection.jsx */
import React, { useState } from 'react';

export default function TopInvestorsSection() {
  const [query, setQuery] = useState('');

  return (
    <div
      className="rounded-[20px] px-7 py-6 flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(59,130,246,0.3)',
        boxShadow: '0 0 50px rgba(59,130,246,0.25), inset 0 1px 1px rgba(255,255,255,0.08)',
      }}
    >
      {/* Top highlight shine overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <h2 style={{ color: '#ffffff', fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
        Top Investors
      </h2>

      {/* Search */}
      <div
        className="flex items-center gap-2 rounded-xl px-4 py-2.5"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          maxWidth: 360,
        }}
      >
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#dbeafe' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: '#ffffff', caretColor: '#3b82f6' }}
        />
      </div>
    </div>
  );
}
