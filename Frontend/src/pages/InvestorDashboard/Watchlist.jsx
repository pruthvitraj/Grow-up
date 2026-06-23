import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare, Trash2, ExternalLink } from "lucide-react";

const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

const WatchlistCard = ({ startup, onConnect, onRemove, isDark }) => {

  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      if (!startup.productImageUrl) return;
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .createSignedUrl(startup.productImageUrl, SIGNED_URL_EXPIRES);
      if (!error) setImageUrl(data.signedUrl);
    };
    loadImage();
  }, [startup.productImageUrl]);

  return (
    <div className={`rounded-[2rem] overflow-hidden shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 group ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}>

      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"}
          alt={startup.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            {startup.tag || "Startup"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-black capitalize ${isDark ? "text-white" : "text-gray-900"}`}>{startup.name}</h3>

          <button
            onClick={() => navigate(`/investor/startup/${startup._id}`)}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <ExternalLink size={18} />
          </button>
        </div>

        <p className={`text-sm font-medium mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{startup.snapshot}</p>
        <p className={`text-sm italic line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>"{startup.tagline}"</p>


        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onConnect(startup._id)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Connect
          </button>

          <button
            onClick={() => onRemove(startup._id)}
            className={`p-3 rounded-xl transition-all ${isDark ? "bg-red-900/10 text-red-400" : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default function Watchlist() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data.watchlist.map(user => ({
          _id: user._id,
          name: user.name,
          productImageUrl: user.profileImagePath,
          snapshot: "Founder • Verified",
          tagline: user.tagline || "Innovating the future with technology",
          tag: "Startup",
        }));
        setStartups(formatted);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
        toast.error("Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWatchlist();
  }, [token]);

  const connect = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/request/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Connection request sent");
    } catch (err) {
      console.error("Connect error:", err);
      toast.error(err.response?.data?.message || "Failed to send connection request");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/watchlist/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStartups(prev => prev.filter(s => s._id !== id));
      toast.success("Removed from watchlist");
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove from watchlist");
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className={`p-8 space-y-10 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#030711] text-gray-100" : "bg-white text-gray-900"}`}>



      <div className="flex flex-col gap-2">
        <h1 className={`text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
          Your <span className="text-indigo-600">Watchlist</span>
        </h1>
        <p className="text-gray-500 text-lg uppercase font-bold tracking-widest text-[10px]">
          {startups.length} saved opportunities
        </p>
      </div>


      {!startups.length ? (
        <div className={`rounded-[2.5rem] p-20 text-center border shadow-sm transition-all ${isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100"
          }`}>
          <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-indigo-900/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"
            }`}>
            <Trash2 size={40} />
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Watchlist is Empty</h3>
          <p className="text-gray-500 mb-8 font-medium">Start exploring founders to build your pipeline.</p>

          <button
            onClick={() => navigate('/investor/founders')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            Explore Founders
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {startups.map(startup => (
            <WatchlistCard
              key={startup._id}
              startup={startup}
              onConnect={connect}
              onRemove={remove}
              isDark={isDark}
            />

          ))}
        </div>
      )}
    </div>
  );
}
