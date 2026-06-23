import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MultiStepRegister from "./pages/Register/MultiStepRegister";
import Home from "./pages/Home";
import Login from "./components/registration/Login";
import "./index.css";
import InvestorDashboard from "./pages/InvestorDashboard/InvestorDashboard";
import InvestorHome from "./pages/InvestorDashboard/InvestorHome";
import ProfileUpdate from "./pages/InvestorDashboard/ProfileUpdate";
import Founders from "./pages/InvestorDashboard/Founders";
import Watchlist from "./pages/InvestorDashboard/Watchlist";
import Connections from "./pages/InvestorDashboard/Connections";
import Funding from "./pages/Shared/Funding";
import Appointments from "./pages/InvestorDashboard/Appointments";
import Deals1 from "./pages/InvestorDashboard/Deals1";
import FounderProfileView from "./pages/InvestorDashboard/FounderProfileView";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/FounderDashboard/FounderDashBoard";
import FounderHome from "./pages/FounderDashboard/FounderHome";
import FAppointments from "./pages/FounderDashboard/Appointments";
import Connection from "./pages/FounderDashboard/Connection";
import Investor from "./pages/FounderDashboard/Investor";
import InvestorProfileView from "./pages/FounderDashboard/InvestorProfileView";
import FounderProfileUpdate from "./pages/FounderDashboard/FounderProfileUpdate";
import FounderWatchlist from "./pages/FounderDashboard/Watchlist";
import DealsSection from "./pages/FounderDashboard/Deals";
import SectorGrowth from "./pages/InvestorDashboard/SectorGrowth";
import FounderSectorgrowth from "./pages/FounderDashboard/FounderSectorgrowth";
import Communication from "./pages/Communication";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>

          {/* ✅ PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<MultiStepRegister />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            
            {/* ✅ INVESTOR DASHBOARD SYSTEM */}
            <Route path="/investor" element={<InvestorDashboard />}>
              <Route index element={<InvestorHome />} />
              <Route path="profile" element={<ProfileUpdate />} />
              <Route path="founders" element={<Founders />} />
              <Route path="watchlist" element={<Watchlist />} />
              <Route path="connections" element={<Connections />} />
              <Route path="funding" element={<Funding />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="deals" element={<Deals1 />} />
              <Route path="sectorgrowth" element={<SectorGrowth />} />
              <Route path="communication" element={<Communication />} />
              <Route path="startup/:id" element={<FounderProfileView />} />
            </Route>

            {/* ✅ FOUNDER DASHBOARD SYSTEM */}
            <Route path="/founder" element={<Dashboard />}>
              <Route index element={<FounderHome />} />
              <Route path="connections" element={<Connection />} />
              <Route path="investors" element={<Investor />} />
              <Route path="profile" element={<FounderProfileUpdate />} />
              <Route path="watchlist" element={<FounderWatchlist />} />
              <Route path="deals" element={<DealsSection />} />
              <Route path="appointments" element={<FAppointments />} />
              <Route path="sector" element={<FounderSectorgrowth />} />
              <Route path="funding" element={<Funding />} />
              <Route path="communication" element={<Communication />} />
              <Route path="investor/:id" element={<InvestorProfileView />} />
            </Route>

          </Route>

        </Routes >
      </Router >
    </>
  );
}

export default App;
