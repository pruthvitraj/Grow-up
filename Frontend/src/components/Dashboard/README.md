# Investor Dashboard - Documentation

This is a modern, dark-themed investor dashboard built with React and Tailwind CSS, designed for startup founders to track their investor relationships and funding metrics.

## 📁 File Structure

```
Frontend/src/
├── components/Dashboard/
│   ├── InvestorDashboard.jsx      # Main dashboard container
│   ├── Sidebar.jsx                 # Left navigation sidebar
│   ├── TopInvestorsSection.jsx    # Top investors search card
│   ├── AnalyticsSection.jsx       # Investor profiles carousel
│   └── MetricsCards.jsx            # Metrics display cards
├── hooks/
│   └── useTheme.js                 # Theme hook (light/dark mode)
└── pages/
    └── FounderInvestorDashboard.jsx # Demo page
```

## 🎨 Features

### 1. **Sidebar Navigation**
- Collapsible left sidebar with smooth animations
- User avatar with initial "U"
- 9 menu items with icons
- Active state highlighting (Communication selected by default)
- Dark/Light theme support
- Hover effects and transitions

### 2. **Top Investors Section**
- Glassmorphism card design
- Search bar for filtering chats/investors
- Real-time search functionality
- Clear button when typing

### 3. **Analytics Section**
- Horizontal scrollable investor profiles
- 6 mock investor cards with avatars
- Investment amount display
- Hover scale effects
- Navigation arrows for scrolling
- Gradient colored avatars

### 4. **Metrics Cards**
- 3 responsive metric cards in a grid
- Icons for Total Raised, Current Valuation, Total Investors
- Animated hover effects
- Decorative gradient lines
- Ready for real-time data updates

## 🚀 Quick Start

### Option 1: Use the Demo Page
```jsx
import FounderInvestorDashboard from './pages/FounderInvestorDashboard';

// In your App.jsx routes:
<Route path="/founder/dashboard" element={<FounderInvestorDashboard />} />
```

### Option 2: Use Individual Components
```jsx
import InvestorDashboard from './components/Dashboard/InvestorDashboard';
import Sidebar from './components/Dashboard/Sidebar';
import TopInvestorsSection from './components/Dashboard/TopInvestorsSection';
import AnalyticsSection from './components/Dashboard/AnalyticsSection';
import MetricsCards from './components/Dashboard/MetricsCards';

// All components require ThemeProvider in the app root
```

### Option 3: Integrate into Existing Dashboard
Replace the main content area of your FounderDashboard with:
```jsx
<TopInvestorsSection />
<AnalyticsSection />
<MetricsCards />
```

## 🎯 Customization

### Update Investor Data
Edit `AnalyticsSection.jsx`:
```jsx
const mockInvestors = [
  { id: 1, name: 'Alice Patel', amount: '$250K', initial: 'A' },
  // Add more investors...
];
```

### Modify Metric Values
Edit `MetricsCards.jsx`:
```jsx
const metricsData = [
  {
    id: 1,
    label: 'Total Raised',
    value: '$0', // Update this value
    icon: 'money',
    // ...
  },
  // ...
];
```

### Update Menu Items
Edit `Sidebar.jsx`:
```jsx
const menuItems = [
  { id: 1, label: 'Update Profile', icon: 'profile' },
  // Add/remove menu items...
];
```

### Customize Colors
All components use Tailwind CSS classes with theme support:
- Dark mode: `bg-slate-950`, `text-gray-100`
- Light mode: `bg-slate-50`, `text-slate-900`
- Accent colors: Blue/cyan gradients

## 🔌 API Integration

### Connect Real Data Sources

#### For Investors (AnalyticsSection)
```jsx
useEffect(() => {
  const fetchInvestors = async () => {
    const response = await fetch('/api/investors');
    const data = await response.json();
    setInvestors(data);
  };
  fetchInvestors();
}, []);
```

#### For Metrics (MetricsCards)
```jsx
useEffect(() => {
  const fetchMetrics = async () => {
    const response = await fetch('/api/founder/metrics');
    const data = await response.json();
    setMetrics(data.map((metric, idx) => ({
      ...metricsData[idx],
      value: metric.value
    })));
  };
  fetchMetrics();
}, []);
```

#### For Search (TopInvestorsSection)
```jsx
const handleSearch = async (query) => {
  if (query.trim()) {
    const response = await fetch(`/api/chats/search?q=${query}`);
    const results = await response.json();
    // Handle results
  }
};
```

## 📱 Responsive Design

- **Desktop**: Full sidebar + 3-column metrics grid
- **Tablet**: Collapsible sidebar + 2-column metrics grid
- **Mobile**: Hidden sidebar + 1-column metrics grid

Breakpoints:
- `md:` - 768px and up (tablet)
- `lg:` - 1024px and up (desktop)

## 🎭 Theme Support

The dashboard automatically adapts to light/dark mode using the ThemeContext:

```jsx
import { useTheme } from './hooks/useTheme';

const { theme } = useTheme();
const isDark = theme === 'dark';
```

Toggle theme in your app header/navbar:
```jsx
const { toggleTheme } = useTheme();
<button onClick={toggleTheme}>🌓 Toggle Theme</button>
```

## 🛠️ Styling Details

### Glassmorphism Effects
```css
backdrop-blur-xl                  /* Blur effect */
bg-blue-500/10                   /* Transparent background */
border border-blue-500/20        /* Subtle borders */
shadow-xl shadow-blue-900/20     /* Soft glowing shadows */
```

### Interactive Effects
```css
hover:scale-105                  /* Zoom on hover */
hover:shadow-lg                  /* Enhanced shadow */
transition-all duration-300      /* Smooth transitions */
group-hover:opacity-100          /* Group hover states */
```

## 📊 Component Props

All components are self-contained and don't require props, but can be extended:

```jsx
// Example: Pass investor data to AnalyticsSection
<AnalyticsSection investorData={customInvestors} />

// Example: Pass metrics data to MetricsCards
<MetricsCards metricsData={customMetrics} />
```

## 🔄 Real-time Updates

MetricsCards has built-in polling (every 5 seconds):
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    // Update metrics from API
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

Customize the interval by modifying the 5000 milliseconds value.

## 🎨 Color Palette

The dashboard uses a carefully selected color palette:

| Element | Dark Mode | Light Mode |
|---------|-----------|-----------|
| Background | `from-slate-950` | `from-slate-50` |
| Cards | `from-blue-500/10` | `from-white/50` |
| Primary Text | `text-white` | `text-slate-900` |
| Secondary Text | `text-gray-400` | `text-slate-600` |
| Accent | `from-blue-500 to-cyan-600` | `from-blue-400 to-cyan-500` |

## 🚀 Performance Tips

1. **Lazy load investor images** for AnalyticsSection
2. **Memoize** components to prevent re-renders:
   ```jsx
   export default React.memo(MetricsCards);
   ```
3. **Use SWR or React Query** for efficient data fetching
4. **Virtualize** long investor lists if needed

## 🐛 Troubleshooting

### Theme not working
- Ensure `ThemeProvider` wraps your app in `main.jsx`
- Check that `ThemeContext` is properly exported

### Sidebar not collapsing
- Verify `sidebarOpen` state is being updated
- Check if CSS transitions are being applied

### Scroll arrows not showing
- Ensure container has sufficient content
- Check if scrollbar is visible

## 📦 Dependencies

- React 18+
- Tailwind CSS 3+
- React Router 6+ (optional, for routing)

## 💡 Next Steps

1. **Connect to backend API** for real data
2. **Add investor chat integration** to search bar
3. **Implement deal tracking** in Deals menu item
4. **Add real-time notifications** for investor updates
5. **Create investor profiles modal** on card click
6. **Add analytics charts** for funding trends

---

Built with ❤️ for modern startups
