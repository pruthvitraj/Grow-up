/**
 * Mock Data Configuration for Investor Dashboard
 * This file contains all mock data used across dashboard components
 * Update these values to match your actual data structure
 */

// Investor Profile Data
export const mockInvestors = [
  {
    id: 1,
    name: 'Alice Patel',
    amount: '$250K',
    initial: 'A',
    email: 'alice@example.com',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'David Wong',
    amount: '$180K',
    initial: 'D',
    email: 'david@example.com',
    status: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: 3,
    name: 'Sarah Collins',
    amount: '$300K',
    initial: 'S',
    email: 'sarah@example.com',
    status: 'active',
    joinDate: '2024-01-10',
  },
  {
    id: 4,
    name: 'Michael R.',
    amount: '$150K',
    initial: 'M',
    email: 'michael@example.com',
    status: 'active',
    joinDate: '2024-03-05',
  },
  {
    id: 5,
    name: 'Emma Johnson',
    amount: '$220K',
    initial: 'E',
    email: 'emma@example.com',
    status: 'active',
    joinDate: '2024-02-01',
  },
  {
    id: 6,
    name: 'James Lee',
    amount: '$280K',
    initial: 'J',
    email: 'james@example.com',
    status: 'active',
    joinDate: '2024-01-25',
  },
];

// Avatar Color Gradients (matched with investor count)
export const avatarGradients = [
  'bg-gradient-to-br from-pink-500 to-rose-600',
  'bg-gradient-to-br from-blue-500 to-cyan-600',
  'bg-gradient-to-br from-purple-500 to-pink-600',
  'bg-gradient-to-br from-green-500 to-emerald-600',
  'bg-gradient-to-br from-yellow-500 to-orange-600',
  'bg-gradient-to-br from-indigo-500 to-blue-600',
];

// Metrics Configuration
export const metricsConfig = [
  {
    id: 1,
    label: 'Total Raised',
    value: '$0',
    icon: 'money',
    description: 'Total funding raised across all rounds',
    color: 'from-green-500 to-emerald-600',
    lightColor: 'from-green-400 to-emerald-500',
    apiEndpoint: '/api/founder/metrics/total-raised',
  },
  {
    id: 2,
    label: 'Current Valuation',
    value: '$0',
    icon: 'arrow',
    description: 'Current company valuation',
    color: 'from-blue-500 to-cyan-600',
    lightColor: 'from-blue-400 to-cyan-500',
    apiEndpoint: '/api/founder/metrics/valuation',
  },
  {
    id: 3,
    label: 'Total Investors',
    value: '0',
    icon: 'users',
    description: 'Total number of active investors',
    color: 'from-purple-500 to-pink-600',
    lightColor: 'from-purple-400 to-pink-500',
    apiEndpoint: '/api/founder/metrics/investor-count',
  },
];

// Sidebar Menu Configuration
export const sidebarMenuItems = [
  {
    id: 1,
    label: 'Update Profile',
    icon: 'profile',
    path: '/founder/profile',
  },
  {
    id: 2,
    label: 'Communication',
    icon: 'message',
    path: '/founder/communication',
    active: true,
  },
  {
    id: 3,
    label: 'Deals',
    icon: 'briefcase',
    path: '/founder/deals',
  },
  {
    id: 4,
    label: 'Connections',
    icon: 'users',
    path: '/founder/connections',
  },
  {
    id: 5,
    label: 'Investors',
    icon: 'trending',
    path: '/founder/investors',
  },
  {
    id: 6,
    label: 'Watchlist',
    icon: 'bookmark',
    path: '/founder/watchlist',
  },
  {
    id: 7,
    label: 'Funding / Bonds',
    icon: 'coins',
    path: '/founder/funding',
  },
  {
    id: 8,
    label: 'Appointments',
    icon: 'calendar',
    path: '/founder/appointments',
  },
  {
    id: 9,
    label: 'Sector Growth',
    icon: 'chart',
    path: '/founder/sector-growth',
  },
];

// User Profile
export const userProfile = {
  id: 'founder-001',
  name: 'John Doe',
  email: 'founder@startup.com',
  avatar: 'U',
  role: 'Founder',
  company: 'TechStartup Inc.',
  bio: 'Building the future of technology',
  joinedDate: '2023-06-15',
};

// Recent Activity
export const recentActivity = [
  {
    id: 1,
    type: 'investment',
    investor: 'Alice Patel',
    amount: '$50K',
    date: '2024-04-15',
    status: 'completed',
  },
  {
    id: 2,
    type: 'meeting',
    investor: 'David Wong',
    date: '2024-04-14',
    time: '2:00 PM',
    status: 'scheduled',
  },
  {
    id: 3,
    type: 'message',
    investor: 'Sarah Collins',
    date: '2024-04-13',
    preview: 'Great pitch! I\'d like to discuss further...',
  },
];

// Theme Configuration
export const themeConfig = {
  colors: {
    dark: {
      bg: {
        primary: '#030711',
        secondary: '#0f172a',
        tertiary: '#1e293b',
      },
      text: {
        primary: '#ffffff',
        secondary: '#e2e8f0',
        tertiary: '#94a3b8',
      },
      accent: {
        primary: '#3b82f6',
        secondary: '#06b6d4',
      },
    },
    light: {
      bg: {
        primary: '#ffffff',
        secondary: '#f1f5f9',
        tertiary: '#e2e8f0',
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        tertiary: '#64748b',
      },
      accent: {
        primary: '#2563eb',
        secondary: '#0891b2',
      },
    },
  },
};

// Animation Configuration
export const animationConfig = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Placeholder Data Generator
export const generateMockInvestors = (count = 6) => {
  const firstNames = ['Alice', 'David', 'Sarah', 'Michael', 'Emma', 'James', 'Lisa', 'Robert'];
  const lastNames = ['Patel', 'Wong', 'Collins', 'Johnson', 'Lee', 'Smith', 'Taylor', 'Brown'];

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      amount: `$${Math.floor(Math.random() * 450 + 50)}K`,
      initial: firstName[0],
      email: `${firstName.toLowerCase()}@example.com`,
      status: 'active',
    };
  });
};

export const generateMockMetrics = () => {
  return {
    totalRaised: `$${Math.floor(Math.random() * 500 + 100)}K`,
    currentValuation: `$${Math.floor(Math.random() * 10 + 1)}M`,
    totalInvestors: Math.floor(Math.random() * 20 + 5),
  };
};
