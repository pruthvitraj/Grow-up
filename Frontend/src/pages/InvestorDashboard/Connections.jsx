import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import {

  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  X,
  Search,
  ChevronLeft
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ================= COMPONENT ================= */
export default function ConnectionsSection() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("all");

  const [connections, setConnections] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [connectionsRes, sentRes, receivedRes] = await Promise.all([
        api.get("/connections"),
        api.get("/requests/sent"),
        api.get("/requests"),
      ]);

      setConnections(connectionsRes.data);
      setSentRequests(sentRes.data);
      setReceivedRequests(receivedRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ================= ACTIONS ================= */
  const handleAccept = async (senderId) => {
    await api.post(`/request/${senderId}/accept`);
    fetchAll();
  };

  const handleReject = async (senderId) => {
    await api.post(`/request/${senderId}/reject`);
    fetchAll();
  };

  const handleWithdraw = async (targetUserId) => {
    await api.post(`/request/${targetUserId}/withdraw`);
    fetchAll();
  };

  const handleRemoveConnection = async (targetUserId) => {
    try {
      await api.post(`/connection/${targetUserId}/remove`);
      fetchAll();
    } catch (err) {
      console.error(
        "Remove connection failed",
        err.response?.data || err.message
      );
    }
  };

  const handleBack = () => window.history.back();

  /* ================= SEARCH FILTER ================= */
  const filterBySearch = (list) =>
    list.filter(item =>
      item.userId?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }


  return (
    <div className="p-8 min-h-screen transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>


      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-3 rounded-xl border transition-all bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
        >
          <ChevronLeft size={20} />
        </button>

        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Network <span className="text-blue-400">&</span> Requests</h1>
          <p className="text-xs text-gray-400 uppercase font-black tracking-widest mt-1">
            Build and manage your professional ecosystem
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Stat
          title="My Connections"
          count={connections.length}
          icon={<Users size={24} />}
          onClick={() => setActiveTab("all")}
          active={activeTab === "all"}
        />
        <Stat
          title="Sent Requests"
          count={sentRequests.length}
          icon={<ArrowUpRight size={24} />}
          onClick={() => setActiveTab("sent")}
          active={activeTab === "sent"}
        />
        <Stat
          title="Incoming Requests"
          count={receivedRequests.length}
          icon={<ArrowDownLeft size={24} />}
          onClick={() => setActiveTab("received")}
          active={activeTab === "received"}
        />
      </div>


      {/* SEARCH */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by name..."
          className="rounded-xl py-4 pl-12 pr-6 text-sm w-full md:w-80 outline-none transition-all border bg-slate-900/30 border-blue-400/20 text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>


      {/* LIST */}
      <div className="grid gap-4">

        {/* CONNECTIONS */}
        {activeTab === "all" &&
          filterBySearch(connections).map(c => (
            <ConnectionCard
              key={c.userId._id}
              conn={c}
              onRemove={handleRemoveConnection}
            />

          ))}

        {/* SENT REQUESTS */}
        {activeTab === "sent" &&
          filterBySearch(sentRequests).map(r => (
            <SentCard
              key={r._id}
              req={r}
              onWithdraw={handleWithdraw}
            />

          ))}

        {/* RECEIVED REQUESTS */}
        {activeTab === "received" &&
          filterBySearch(receivedRequests).map(r => (
            <ReceivedCard
              key={r._id}
              req={r}
              onAccept={handleAccept}
              onReject={handleReject}
            />

          ))}
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const Stat = ({ title, count, icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-8 rounded-2xl border flex justify-between items-center transition-all ${
        active 
          ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/5 ring-4 ring-blue-500/5" 
          : 'bg-blue-900/20 border-blue-400/30 text-white hover:border-blue-400/50'
    }`}
  >
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-4xl font-black text-white">{count}</h3>
    </div>
    <div className={active ? "text-blue-400" : "text-blue-400/60"}>{icon}</div>
  </div>
);

const ConnectionCard = ({ conn, onRemove }) => (
  <div className="flex items-center justify-between p-6 border rounded-2xl transition-all shadow-sm bg-blue-900/20 border-blue-400/30 hover:border-blue-400/50">
    <div>
      <h4 className="text-lg font-black tracking-tight text-white">
        {conn.userId.name}
      </h4>
      <p className="text-xs font-black uppercase tracking-widest text-blue-400/80 mt-0.5">
        {conn.userId.role}
      </p>
    </div>

    <button
      onClick={() => onRemove(conn.userId._id)}
      className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all bg-red-900/20 text-red-300 border border-red-900/30 hover:bg-red-900/40"
    >
      Disconnect
    </button>
  </div>
);

const SentCard = ({ req, onWithdraw }) => (
  <div className="border p-6 rounded-2xl flex justify-between items-center shadow-sm transition-all bg-blue-900/20 border-blue-400/30 hover:border-blue-400/50">
    <div>
      <h4 className="text-lg font-black tracking-tight text-white">{req.userId.name}</h4>
      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">Pending Approval</p>
    </div>
    <button
      onClick={() => onWithdraw(req.userId._id)}
      className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all border bg-gray-900/20 border-gray-400/30 text-gray-300 hover:text-red-400"
    >
      Withdraw
    </button>
  </div>
);

const ReceivedCard = ({ req, onAccept, onReject }) => (
  <div className="border p-6 rounded-2xl flex justify-between items-center shadow-sm transition-all bg-blue-900/20 border-emerald-500/20 shadow-emerald-500/5 hover:border-emerald-500/40">
    <div>
      <h4 className="text-lg font-black tracking-tight text-white">{req.userId.name}</h4>
      <p className="text-xs font-medium text-gray-400">{req.userId.email}</p>
    </div>
    <div className="flex gap-3">
      <button
        onClick={() => onAccept(req.userId._id)}
        className="bg-emerald-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5 hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
      >
        <Check size={14} /> Accept
      </button>
      <button
        onClick={() => onReject(req.userId._id)}
        className="p-2.5 rounded-xl transition-all border bg-red-900/20 border-red-400/30 text-red-300 hover:bg-red-900/40"
      >
        <X size={18} />
      </button>
    </div>
  </div>
);