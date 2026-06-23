import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import axios from "axios";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare, Trash2, ExternalLink } from "lucide-react";

const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

const WatchlistCard = ({ item, onConnect, onRemove, isDark }) => {

  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      if (!item.profileImagePath) return;
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .createSignedUrl(item.profileImagePath, SIGNED_URL_EXPIRES);
      if (!error) setImageUrl(data.signedUrl);
    };
    loadImage();
  }, [item.profileImagePath]);

  return (
<div className={`rounded-[2rem] overflow-hidden shadow-sm border transition-all hover:shadow-xl hover:-translate-y-1 group bg-blue-900/20 border-blue-400/30`}>

      <div className="h-48 overflow-hidden relative">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            {item.tag || "Investor"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black capitalize text-white">{item.name}</h3>

          <button
            onClick={() => navigate(`/founder/investor-profile/${item._id}`)}
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ExternalLink size={18} />
          </button>
        </div>

        <p className="text-sm font-medium mb-4 text-gray-400">{item.snapshot}</p>
        <p className="text-sm italic line-clamp-2 text-gray-300">"{item.tagline}"</p>


        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onConnect(item._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Connect
          </button>

          <button
            onClick={() => onRemove(item._id)}
            className="p-3 rounded-xl transition-all bg-red-900/20 text-red-300 hover:bg-red-900/40"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default function FounderWatchlist() {
  const [items, setItems] = useState([]);
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
          profileImagePath: user.profileImagePath,
          snapshot: "Verified Investor",
          tagline: "Supporting the next generation of innovators",
          tag: user.role,
        }));
        setItems(formatted);
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
      toast.error(err.response?.data?.message || "Failed to send connection request");
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/watchlist/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(prev => prev.filter(s => s._id !== id));
      toast.success("Removed from watchlist");
    } catch (err) {
      toast.error("Failed to remove from watchlist");
    }
  };

  if (loading) return <div className="p-20 flex justify-center h-screen" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}><div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="p-8 space-y-10 min-h-screen" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>


      <div className="flex flex-col gap-2">
        <h1 className="text-5xl font-black tracking-tight text-white">
          Saved <span className="text-blue-400">Investors</span>
        </h1>
        <p className="text-gray-400 text-lg uppercase font-bold tracking-widest text-[10px]">
          {items.length} potential partners
        </p>
      </div>


      {!items.length ? (
        <div className="rounded-[2.5rem] p-20 text-center border shadow-sm transition-all bg-blue-900/20 border-blue-400/30">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 bg-blue-900/20 text-blue-400">
            <Trash2 size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-white">Watchlist is Empty</h3>
          <p className="text-gray-300 mb-8 font-medium">Your watchlist is currently empty.</p>
          <button onClick={() => navigate('/founder/investors')} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Find Investors</button>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <WatchlistCard
              key={item._id}
              item={item}
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
