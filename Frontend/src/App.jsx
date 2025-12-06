import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MultiStepRegister from "./pages/Register/MultiStepRegister";
import Home from "./pages/Home";
import Login from "./components/registration/Login";
import "./index.css"; // Tailwind CSS
import InvestorDashboard from "./pages/InvestorDashboard/InvestorDashboard";
import ProfileUpdate from "./pages/InvestorDashboard/ProfileUpdate";
import Founders from "./pages/InvestorDashboard/Founders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<MultiStepRegister />} />
        <Route path="/login" element={<Login />} />
        <Route path="invester/" element={<InvestorDashboard />} />
        <Route path="/invester/profile" element={<ProfileUpdate />} />
        <Route path="/invester/founders" element={<Founders />} />
      </Routes>
    </Router>
  );
}

export default App;
