import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import InvestorDashboard from '../components/Dashboard/InvestorDashboard';

export default function FounderInvestorDashboard() {
  return (
    <ThemeProvider>
      <InvestorDashboard />
    </ThemeProvider>
  );
}
