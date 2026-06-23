# 🌱 Grow-Up: Founder-Investor Matching & Deal Management Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth--Storage-emerald.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-4-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black.svg?logo=socketdotio&logoColor=white)](https://socket.io/)

**Grow-Up** is a premium, full-stack digital ecosystem designed to bridge the gap between ambitious startup founders and strategic investors. The platform streamlines the entire fundraising lifecycle—from discovery and match filtering to deal negotiation, real-time communication, and meeting scheduling.

---

## 🚀 Key Features

### 👔 Founder Experience
* **Multi-Step Onboarding:** Clear, guided setup to input startup details, problem statements, solutions, target markets, and financial metrics.
* **Pitch Showcase:** Upload and display pitch decks, product images, registration proofs, and pitch videos.
* **Investor Discovery & Watchlist:** Search and filter investors based on ticket size, sector interests, and active status.
* **Deal Pipeline & Negotiations:** Initiate funding deals, propose equity/debt splits, receive counteroffers, and manage deal stages.
* **Calendar Sync:** Schedule pitch meetings directly via Google Calendar integration.
* **Real-time Chat:** Instant messaging with connected investors to answer questions and refine terms.

### 💼 Investor Experience
* **Verified Investor Profile:** High-trust profile setup with PAN verification, KYC validation, and proof of funds uploading.
* **Advanced Startup Filtering:** Explore, filter, and search through verified startups by industry, valuation, and funding type.
* **Watchlist Management:** Keep track of high-potential startups by bookmarking them.
* **Analytical Dashboards:** Beautiful interactive visualizations of sector growth trends and metrics built with Recharts.
* **Deal Workflow:** Review submitted deal proposals, send counteroffers, sign off, or reject opportunities.
* **Real-time Chat:** Message founders instantly to request more information.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Ant Design (`antd`), Framer Motion, Recharts, React Router DOM v7, Zustand, Axios, React Bootstrap, Lucide Icons |
| **Backend** | Node.js, Express, Mongoose (MongoDB), Socket.io (WebSockets), Google APIs (Calendar Sync), Multer + Cloudinary Storage |
| **Auth & Storage** | Supabase (Authentication verification, database/storage trigger sync) |
| **Database** | MongoDB (for application data/collections), Supabase PostgreSQL (for auth) |

---

## 📁 Repository Structure

```tree
Grow_up/
├── Backend/                 # Express Node.js Server
│   ├── controllers/         # Request handling logic
│   ├── middleware/          # JWT and role authorization middleware
│   ├── models/              # Mongoose schemas (User, Profiles, Deals, Chat)
│   ├── routes/              # Express API endpoints
│   ├── services/            # Google Calendar, external API services
│   ├── utils/               # File upload (Cloudinary) setup, helpers
│   ├── .env.example         # Template for environment configurations
│   └── server.js            # Entrypoint for Express & Socket.io server
├── Frontend/                # React Vite SPA Client
│   ├── src/
│   │   ├── api/             # Axios instance and API service requests
│   │   ├── components/      # Common UI elements (Login, Navbars, Layouts)
│   │   ├── context/         # React Context stores
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Pages & Dashboards (Founder, Investor, Home)
│   │   ├── store/           # Zustand global state management
│   │   └── main.jsx         # App bootstrapping
│   ├── .env.example         # Template for client-side API keys
│   └── index.html           # Main HTML entry
├── docs/                    # Additional project documentation
└── ML_ANALYSIS.md           # Machine learning integration blueprint for matching models
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local database or MongoDB Atlas account)
* [Supabase Account](https://supabase.com/) (For Auth keys)
* [Cloudinary Account](https://cloudinary.com/) (For file/image hosting)

### Step 1: Clone the Repository
```bash
git clone https://github.com/pruthvitraj/Grow-up.git
cd Grow-up
```

### Step 2: Configure Backend Environment Variables
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your actual credentials:
   ```env
   MONGO_URI=mongodb://localhost:27017/Growup
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CALENDAR_ID=your_google_calendar_email@gmail.com
   ```

### Step 3: Install Backend Dependencies & Start Server
```bash
npm install
# Start server in production mode
npm start
# Or start in development mode if nodemon is configured
npx nodemon server.js
```
The server will start running on `http://localhost:5000`.

### Step 4: Configure Frontend Environment Variables
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in your Supabase configurations:
   ```env
   VITE_SUPABASE_URL=https://your_supabase_project_ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```

### Step 5: Install Frontend Dependencies & Start App
```bash
npm install
npm run dev
```
The frontend client will start running on `http://localhost:5173`.

---

## 🤖 Future Roadmap: Machine Learning Matching
We have documented a complete ML pipeline strategy in [ML_ANALYSIS.md](file:///d:/MajorProjectDiksha/Grow_up/ML_ANALYSIS.md). Future implementations include:
* **Predictive Matching:** Scoring and ranking compatible founders and investors using TF-IDF embedding similarities and Gradient Boosting models (XGBoost).
* **Deal Success Predictor:** Classification models predicting deal outcomes based on negotiation velocities, counteroffer counts, and historic matching patterns.

---

## 🔒 Security Practices
Please note that all sensitive configuration files (`.env`) are excluded from the repository. When deploying to production:
* Ensure environment variables are configured securely on your server hosting provider (e.g., Vercel, Render, AWS).
* Do not commit `.env` configurations to public repositories.
