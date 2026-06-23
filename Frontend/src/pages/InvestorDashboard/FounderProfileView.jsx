import {
    ArrowLeft, MapPin, Linkedin, Globe, Mail,
    Share2, Download, PlayCircle, DollarSign,
    Users, TrendingUp, Layers, CheckCircle2, Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabaseClient";
import { useAuthStore } from "../../store/useAuthStore";

const SUPABASE_BUCKET = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

export default function FounderProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((s) => s.token);
    const [startup, setStartup] = useState(null);
    const [bgImage, setBgImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [actionLoading, setActionLoading] = useState(null);
    /* ---------------- FETCH STARTUP & CHECK STATUS ---------------- */
    useEffect(() => {

        const fetchStartup = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/profile/founder/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStartup(res.data);
                if (res.data?.productImageUrl) {
                    const { data } = await supabase.storage
                        .from(SUPABASE_BUCKET)
                        .createSignedUrl(res.data.productImageUrl, SIGNED_URL_EXPIRES);
                    setBgImage(data?.signedUrl || null);
                }

                // Check if already sent request and in watchlist
                if (token) {
                    try {
                        const sentRes = await axios.get(
                            `http://localhost:5000/api/requests/sent`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const founderId = res.data?.user?._id;
                        const alreadySent = sentRes.data.some(req => req.userId._id === founderId);
                        setRequestSent(alreadySent);
                    } catch (err) {
                        console.error("Failed to check sent requests:", err);
                    }

                    try {
                        const watchRes = await axios.get(
                            `http://localhost:5000/api/watchlist`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const founderId = res.data?.user?._id;
                        const isInWatchlist = watchRes.data.some(item => item === founderId || item._id === founderId);
                        setInWatchlist(isInWatchlist);
                    } catch (err) {
                        console.error("Failed to check watchlist:", err);
                    }
                }
            } catch (err) {
                console.error("Failed to load startup:", err);
                toast.error("Failed to load startup profile");
            } finally {
                setLoading(false);
            }
        };
        fetchStartup();
    }, [id, token]);
    const fid = startup?.user?._id;
    console.log("Fetching startup with ID:", fid);

    const connectWithFounder = async (fid) => {
        if (!token) {
            console.error("No token found");
            toast.error("Authentication token not found");
            return;
        }
        if (!fid) {
            toast.error("Invalid founder ID");
            return;
        }

        setActionLoading(true);
        try {
            const res = await axios.post(
                `http://localhost:5000/api/request/${fid}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Connection request response:", res.data);
            toast.success("Connection request sent!");
            setRequestSent(true);

        } catch (err) {
            console.error(
                "Failed to send connection request:",
                err.response?.data || err.message
            );
            toast.error(err.response?.data?.message || "Failed to send connection request");
        } finally {
            setActionLoading(false);
        }
    };

    const addtowatchlist = async (fid) => {
        if (!token) {
            console.error("No token found");
            toast.error("Authentication token not found");
            return;
        }
        if (!fid) {
            toast.error("Invalid founder ID");
            return;
        }

        setActionLoading(true);
        try {
            const res = await axios.post(
                `http://localhost:5000/api/watchlist/${fid}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Added to watchlist response:", res.data);
            toast.success("Added to watchlist!");
            setInWatchlist(true);
        } catch (err) {
            console.error(
                "Failed to add to watchlist:",
                err.response?.data || err.message
            );
            toast.error(err.response?.data?.message || "Failed to add to watchlist");
        } finally {
            setActionLoading(false);
        }
    };
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-indigo-600 animate-pulse transition-colors duration-300">Loading Startup Profile...</div>;

    if (!startup) return <div className="p-10 text-center text-red-500">Startup not found</div>;

    const defaultCover = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="min-h-screen bg-white dark:bg-[#0b1120] text-gray-800 dark:text-gray-200 font-sans pb-20 transition-colors duration-300">


            {/* --- HERO SECTION --- */}
            <div className="relative h-[400px] lg:h-[480px] w-full group">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${bgImage || defaultCover}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/60 to-transparent" />

                {/* Top Navigation Overlay */}
                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                    >
                        <ArrowLeft size={18} /> <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 w-full p-6 lg:p-12 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-sm">
                                    {startup.industry}
                                </span>
                                <span className="flex items-center gap-1 text-gray-300 text-sm">
                                    <MapPin size={14} className="text-indigo-400" /> {startup.startupLocation}
                                </span>
                                <span className="text-gray-300 text-sm">• Est. {startup.foundedYear}</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2">
                                {startup.startupName}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                                {startup.tagline}
                            </p>
                        </div>

                        {/* Hero Actions */}
                        <div className="flex gap-3">
                            {startup.pitchDeckUrl && (
                                <a href={startup.pitchDeckUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                                    <Download size={18} /> Pitch Deck
                                </a>
                            )}
                            <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT LAYOUT --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Tabs & Detail Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tab Navigation */}
                        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 inline-flex w-full overflow-x-auto">
                            {['Overview', 'Business', 'Financials', 'Team'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.toLowerCase()
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* TAB CONTENT */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 min-h-[400px]">

                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<Layers />} title="Executive Summary" />
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                        Description: {startup.startupDescription}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InfoCard title="Problem Statement" content={startup.problemStatement} type="danger" />
                                        <InfoCard title="Our Solution" content={startup.solutionOverview} type="success" />
                                    </div>

                                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                        <h3 className="text-indigo-900 dark:text-indigo-300 font-bold mb-2 flex items-center gap-2">
                                            <CheckCircle2 size={18} /> Unique Selling Proposition (USP)
                                        </h3>
                                        <p className="text-indigo-800 dark:text-indigo-200">{startup.usp}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<TrendingUp />} title="Business & Market" />

                                    <div className="space-y-6">
                                        <DetailRow label="Business Model" value={startup.businessModel} />
                                        <DetailRow label="Target Market" value={startup.targetMarket} />
                                        <DetailRow label="Current Stage" value={startup.businessStage} />
                                    </div>

                                    <div className="mt-6 pt-6 border-t dark:border-slate-700">
                                        <h4 className="font-semibold mb-3">Links & Resources</h4>
                                        <div className="flex gap-4">
                                            {startup.pitchVideoUrl && (
                                                <a href={startup.pitchVideoUrl} target="_blank" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                                                    <PlayCircle size={20} /> Watch Pitch Video
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'financials' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<DollarSign />} title="Funding & Equity" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <StatBox label="Valuation" value={startup.valuation} />
                                        <StatBox label="Asking" value={startup.fundingRequirement} />
                                        <StatBox label="Equity Offered" value={startup.equityOffer} />
                                        <StatBox label="Type" value={startup.fundingType} />
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-bold text-lg mb-3">Use of Funds</h4>
                                        <p className="text-gray-600 dark:text-gray-300 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                                            {startup.useOfFunds}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-bold text-sm text-gray-500 uppercase">Existing Investors</h4>
                                        <p className="mt-1">{startup.existingInvestors || "Bootstrapped / None"}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'team' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<Users />} title="The Team" />

                                    <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700/30">

                                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {startup.coFounders?.charAt(0) || "F"}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{startup.coFounders}</h3>
                                            <p className="text-sm text-gray-500">Founder</p>
                                            {startup.founderLinkedin && (
                                                <a href={startup.founderLinkedin} target="_blank" className="text-indigo-500 text-sm flex items-center gap-1 mt-1 hover:underline">
                                                    <Linkedin size={14} /> LinkedIn Profile
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Team Size</span>
                                            <p className="text-xl font-semibold mt-1">{startup.teamSize} Members</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Advisors</span>
                                            <p className="text-xl font-semibold mt-1">{startup.advisors || "None"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold mb-2">Team Background</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{startup.experienceBackground}</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action Card & Key Metrics */}
                    <div className="space-y-6">
                        {/* Investment Card */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-indigo-100 dark:border-indigo-900/30 sticky top-6">
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-500">Total Ask</span>
                                <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                                    {startup.fundingRequirement}
                                </div>
                                <div className="text-sm text-green-500 font-medium mt-1 flex items-center gap-1">
                                    <TrendingUp size={14} /> for {startup.equityOffer} Equity
                                </div>
                            </div>

                            <button
                                onClick={() => connectWithFounder(fid)}
                                disabled={actionLoading || requestSent}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all mb-3 flex items-center justify-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                                {requestSent ? "Request Sent ✓" : "Connect with Founder"}
                            </button>

                            <button
                                onClick={() => addtowatchlist(fid)}
                                disabled={actionLoading || inWatchlist}
                                className="w-full py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                                {inWatchlist ? "Added to Watchlist ✓" : "Save for Later"}
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 space-y-3">

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Valuation</span>
                                    <span className="font-semibold">{startup.valuation}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-semibold">{startup.fundingType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Quick Links */}
                        <div className="bg-gray-100 dark:bg-slate-800/50 p-6 rounded-xl">
                            <h4 className="font-bold mb-4">Contact Info</h4>
                            <div className="space-y-3">
                                <ContactRow icon={<Mail size={16} />} text="Send Email" />
                                <ContactRow icon={<Globe size={16} />} text="Visit Website" />
                                {startup.founderLinkedin && (
                                    <a href={startup.founderLinkedin} target="_blank" className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-xl text-sm font-medium hover:text-indigo-500 transition-colors cursor-pointer">
                                        <Linkedin size={16} /> LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* --- SUB COMPONENTS --- */

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 pb-4 border-b dark:border-slate-700">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
    </div>
);

const InfoCard = ({ title, content, type }) => {
    const isDanger = type === "danger";
    return (
        <div className={`p-5 rounded-2xl border ${isDanger ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'}`}>
            <h4 className={`font-bold mb-2 ${isDanger ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                {title}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</h4>
        <p className="text-lg font-medium dark:text-gray-200">{value}</p>
    </div>
);

const StatBox = ({ label, value }) => (
    <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-800">

        <span className="text-xs text-gray-500 block mb-1">{label}</span>
        <span className="text-lg font-bold text-gray-800 dark:text-white block truncate" title={value}>{value}</span>
    </div>
);

const ContactRow = ({ icon, text }) => (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
        {icon} <span>{text}</span>
    </div>
);