# Investor Dashboard - Integration Guide

## 🚀 Quick Integration Steps

### Step 1: Add Route to App.jsx

```jsx
import FounderInvestorDashboard from './pages/FounderInvestorDashboard';

// In your routes:
<Route path="/founder-dashboard" element={<FounderInvestorDashboard />} />
```

### Step 2: Update Navigation

Add link to your navbar or main navigation:
```jsx
<Link to="/founder-dashboard">Dashboard</Link>
```

### Step 3: Verify Theme Provider

Ensure your app has ThemeProvider wrapping everything in `main.jsx`:
```jsx
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
```

---

## 📦 Component Overview

### InvestorDashboard (Main Container)
- **Location**: `components/Dashboard/InvestorDashboard.jsx`
- **Purpose**: Main layout container with sidebar and content area
- **Props**: None required
- **Features**: 
  - Responsive layout
  - Sidebar toggle
  - Theme support

```jsx
import InvestorDashboard from './components/Dashboard/InvestorDashboard';

<InvestorDashboard />
```

### Sidebar
- **Location**: `components/Dashboard/Sidebar.jsx`
- **Props**: 
  - `sidebarOpen` (boolean): Sidebar open/close state
  - `setSidebarOpen` (function): Update sidebar state
- **Features**:
  - 9 navigation items
  - Collapsible design
  - User avatar
  - Hover effects

```jsx
const [sidebarOpen, setSidebarOpen] = useState(false);
<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
```

### TopInvestorsSection
- **Location**: `components/Dashboard/TopInvestorsSection.jsx`
- **Props**: None required
- **Features**:
  - Search bar for chats
  - Real-time filtering
  - Glassmorphism design

```jsx
<TopInvestorsSection />
```

### AnalyticsSection
- **Location**: `components/Dashboard/AnalyticsSection.jsx`
- **Props**: None (uses mockData internally)
- **Features**:
  - Horizontal scrollable investor cards
  - Avatar with gradient colors
  - Investment amounts
  - Navigation arrows

```jsx
<AnalyticsSection />
```

### MetricsCards
- **Location**: `components/Dashboard/MetricsCards.jsx`
- **Props**: None (uses mockData internally)
- **Features**:
  - 3 metric cards (Total Raised, Valuation, Investors)
  - Icon indicators
  - Responsive grid
  - Hover animations

```jsx
<MetricsCards />
```

---

## 🔗 API Integration Examples

### Fetch Investor List

Replace mockData in `AnalyticsSection.jsx`:

```jsx
import { useEffect, useState } from 'react';

function AnalyticsSection() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch('/api/founder/investors');
        const data = await response.json();
        setInvestors(data);
      } catch (error) {
        console.error('Failed to fetch investors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // Component JSX
  );
}
```

### Fetch Metrics Data

Update `MetricsCards.jsx`:

```jsx
useEffect(() => {
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/founder/metrics');
      const data = await response.json();
      
      setMetrics(prev => prev.map((metric, idx) => ({
        ...metric,
        value: data[idx].value
      })));
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  fetchMetrics();
  
  // Poll every 5 seconds
  const interval = setInterval(fetchMetrics, 5000);
  return () => clearInterval(interval);
}, []);
```

### Implement Search

Update `TopInvestorsSection.jsx`:

```jsx
const [results, setResults] = useState([]);

const handleSearch = async (query) => {
  if (!query.trim()) {
    setResults([]);
    return;
  }

  try {
    const response = await fetch(
      `/api/chats/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setResults(data);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

## 🎨 Customization Guide

### Change Colors

Edit Tailwind classes in any component. For example, in `Sidebar.jsx`:

```jsx
// Dark mode background
'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900'
// Change to:
'bg-gradient-to-b from-slate-800 via-indigo-800 to-slate-800'

// Accent color
'from-blue-500 to-cyan-500'
// Change to:
'from-purple-500 to-pink-500'
```

### Add/Remove Menu Items

Edit `Sidebar.jsx` or use `mockData.js`:

```jsx
const menuItems = [
  // Add new item:
  { id: 10, label: 'Reports', icon: 'chart', active: false },
  // Or remove an item by commenting it out
];
```

### Update Investor Data

Edit `mockData.js`:

```jsx
export const mockInvestors = [
  // Add your data:
  { id: 1, name: 'Your Investor', amount: '$XXX', initial: 'Y' },
];
```

### Modify Metrics

Edit `MetricsCards.jsx`:

```jsx
const metricsData = [
  {
    id: 1,
    label: 'Total Raised',
    value: '$5.2M', // Update value
    icon: 'money',
    // ... rest
  },
];
```

---

## 🔧 Advanced Customization

### Add Click Handlers to Investor Cards

```jsx
// In AnalyticsSection.jsx
const handleInvestorClick = (investor) => {
  // Navigate to investor profile
  navigate(`/investor/${investor.id}`);
};

// Update card:
<div
  onClick={() => handleInvestorClick(investor)}
  className="cursor-pointer..."
>
  {/* Card content */}
</div>
```

### Add Modal for Metrics Details

```jsx
// In MetricsCards.jsx
const [selectedMetric, setSelectedMetric] = useState(null);

const handleMetricClick = (metric) => {
  setSelectedMetric(metric);
  // Open modal
};

// Use with Modal component:
{selectedMetric && (
  <MetricModal metric={selectedMetric} onClose={() => setSelectedMetric(null)} />
)}
```

### Real-time Updates with WebSocket

```jsx
useEffect(() => {
  const socket = io('YOUR_SERVER_URL');

  socket.on('metrics_update', (data) => {
    setMetrics(prev => prev.map((m, idx) => ({
      ...m,
      value: data[idx].value
    })));
  });

  return () => socket.disconnect();
}, []);
```

---

## 📱 Mobile Optimization

The dashboard is already responsive, but you can further optimize:

### Hide Sidebar on Mobile

```jsx
// In InvestorDashboard.jsx
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

{isMobile && <MobileSidebar />}
```

### Stack Metrics Vertically on Small Screens

The grid already uses responsive classes:
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  // Already handles mobile (1 col) and desktop (3 col)
</div>
```

---

## 🧪 Testing Guide

### Test Theme Toggle

1. Open DevTools
2. In console: `localStorage.setItem('theme', 'dark')`
3. Refresh page
4. Dashboard should display in dark mode

### Test Responsive Layout

1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Resize to test breakpoints:
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

### Test Search Functionality

1. Click in search bar
2. Type text (should filter results)
3. Click clear button (X) to reset

### Test Sidebar Toggle

1. Click user avatar
2. Sidebar should collapse/expand smoothly

---

## 🐛 Common Issues & Solutions

### Theme Not Applying

**Problem**: Dashboard shows in light mode even when theme is dark

**Solution**:
```jsx
// Ensure ThemeProvider wraps App
import { ThemeProvider } from './context/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Scroll Arrows Not Showing

**Problem**: Navigation arrows don't appear in AnalyticsSection

**Solution**: Check if container has overflow
```jsx
<div className="overflow-x-auto"> {/* Add this */}
  {/* Content */}
</div>
```

### Mock Data Not Showing

**Problem**: Investor list is empty

**Solution**: Verify mockData is imported
```jsx
import { mockInvestors } from './mockData';
```

### Sidebar State Not Updating

**Problem**: Sidebar won't expand/collapse

**Solution**: Check state management
```jsx
const [sidebarOpen, setSidebarOpen] = useState(false);
// Pass both to Sidebar
<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
```

---

## 📊 Performance Optimization

### Memoize Components

```jsx
import { memo } from 'react';

export default memo(function MetricsCards() {
  // Component code
});
```

### Lazy Load Components

```jsx
import { lazy, Suspense } from 'react';

const MetricsCards = lazy(() => import('./MetricsCards'));

<Suspense fallback={<div>Loading...</div>}>
  <MetricsCards />
</Suspense>
```

### Optimize Images

```jsx
// Use next/image for optimization (if using Next.js)
import Image from 'next/image';

<Image
  src={investorImage}
  alt="Investor"
  width={48}
  height={48}
/>
```

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS Glassmorphism](https://tailwindcss.com/docs/backdrop-filter)

---

## 🎯 Next Steps

1. **Connect to Backend**: Integrate real API endpoints
2. **Add Authentication**: Ensure user is founder
3. **Implement WebSockets**: Real-time metric updates
4. **Add Analytics**: Track dashboard usage
5. **Create Notifications**: Alert on investor activity
6. **Build Reports**: Export funding analytics

---

For questions or issues, check the README.md or component comments.
