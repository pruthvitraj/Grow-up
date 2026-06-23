import {
    ArrowLeft, MapPin, Linkedin, Globe, Mail,
    Share2, Bookmark, Zap, DollarSign,
    Target, Briefcase, Award, CheckCircle2, Phone, MessageSquare, FileText, Loader2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../../utils/supabaseClient";
import { useAuthStore } from "../../store/useAuthStore";

const SUPABASE_BUCKET = "Grow-up";
const SIGNED_URL_EXPIRES = 60 * 5;

export default function InvestorProfileView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useAuthStore((s) => s.token);

    const [investor, setInvestor] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [requestSent, setRequestSent] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        const fetchInvestor = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/founder/investor/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setInvestor(res.data);

                if (res.data?.investorprofilePhoto) {
                    const { data } = await supabase.storage
                        .from(SUPABASE_BUCKET)
                        .createSignedUrl(res.data.investorprofilePhoto, SIGNED_URL_EXPIRES);
                    setProfileImg(data?.signedUrl || null);
                }

                // Check if already sent request and in watchlist
                if (token) {
                    try {
                        const sentRes = await axios.get(
                            `http://localhost:5000/api/requests/sent`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const investorId = res.data?.user?._id || res.data?._id;
                        const alreadySent = sentRes.data.some(req => req.userId._id === investorId);
                        setRequestSent(alreadySent);
                    } catch (err) {
                        console.error("Failed to check sent requests:", err);
                    }

                    try {
                        const watchRes = await axios.get(
                            `http://localhost:5000/api/watchlist`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        const investorId = res.data?.user?._id || res.data?._id;
                        const isInWatchlist = watchRes.data.some(item => item === investorId || item._id === investorId);
                        setInWatchlist(isInWatchlist);
                    } catch (err) {
                        console.error("Failed to check watchlist:", err);
                    }
                }
            } catch (err) {
                console.error("Failed to load investor profile:", err);
                toast.error("Failed to load investor profile");
            } finally {
                setLoading(false);
            }
        };
        fetchInvestor();
    }, [id, token]);

    // --- NEW FUNCTION TO SHOW PDF ---
    const handleViewPDF = async (path) => {
        if (!path) return;
        try {
            const { data, error } = await supabase.storage
                .from(SUPABASE_BUCKET)
                .createSignedUrl(path, SIGNED_URL_EXPIRES);

            if (error) throw error;
            if (data?.signedUrl) {
                window.open(data.signedUrl, '_blank'); // Opens PDF in a new tab
            }
        } catch (err) {
            console.error("Error opening PDF:", err);
            toast.error("Could not open the document.");
        }
    };

    const connectWithinvestor = async (id) => {
        if (!token) {
            console.error("No token found");
            toast.error("Authentication token not found");
            return;
        }
        if (!id) {
            toast.error("Invalid investor ID");
            return;
        }

        setActionLoading(true);
        try {
            const res = await axios.post(
                `http://localhost:5000/api/request/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Connection request response:", res.data);
            setRequestSent(true);
            toast.success("Connection request sent!");

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
            toast.error("Invalid investor ID");
            return;
        }

        setActionLoading(true);
        try {
            const res = await axios.post(
                `http://localhost:5000/api/founder/watchlist/${fid}`,
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b1120] text-amber-500 animate-pulse transition-colors duration-300">Loading Investor Profile...</div>;

    if (!investor) return <div className="p-10 text-center text-red-500">Investor not found</div>;

    const defaultCover = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="min-h-screen bg-white dark:bg-[#0b1120] text-gray-800 dark:text-gray-200 font-sans pb-20 transition-colors duration-300">


            {/* --- HERO SECTION --- */}
            <div className="relative h-[350px] lg:h-[400px] w-full group">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${defaultCover}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/70 to-transparent" />

                <div className="absolute top-6 left-6 z-20">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all">
                        <ArrowLeft size={18} /> <span className="text-sm font-medium">Back</span>
                    </button>
                </div>

                <div className="absolute bottom-0 w-full p-6 lg:p-12 z-20">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative">
                                <img
                                    src={profileImg || "https://www.gravatar.com/avatar/?d=mp&s=150"}
                                    className="w-32 h-32 rounded-xl border-4 border-[#0b1120] object-cover shadow-2xl bg-slate-800"
                                    alt="Investor"
                                />
                                {investor.status === 'approved' && (
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-xl border-4 border-[#0b1120]" title="Verified Investor">
                                        <CheckCircle2 size={18} className="text-white" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-3 justify-center md:justify-start">
                                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        {investor.investmentType?.join(', ') || "Investor"}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-300 text-sm">
                                        <MapPin size={14} className="text-amber-400" /> {investor.investorLocation}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 text-center md:text-left capitalize">
                                    {investor.fullName}
                                </h1>
                                <p className="text-lg text-amber-500 font-bold text-center md:text-left">
                                    Investment Activeness: <span className="uppercase">{investor.investmentActiveness}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            {/* UPDATED BUTTON */}
                            <button
                                onClick={() => handleViewPDF(investor.proofOfFunds)}
                                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-[#0b1120] rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1"
                            >
                                <Zap size={18} /> Proof Of Funds
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 inline-flex w-full">
                            {['Overview', 'Financials', 'Contact'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.toLowerCase()
                                        ? "bg-amber-500 text-[#0b1120] shadow-md"
                                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-xl border border-gray-100 dark:border-slate-700 min-h-[300px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<Briefcase />} title="Professional Summary" />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <InfoCard title="Job Status" content={investor.jobStatus} type="success" />
                                        <InfoCard title="Investment Interest" content={investor.investmentInterest} type="warning" />
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Location Details</h4>
                                        <p className="text-lg">{investor.investorLocation}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'financials' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<Target />} title="Investment Profile" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DetailRow label="Investment Range" value={investor.investmentRange} />
                                        <DetailRow label="Preferred Methods" value={investor.investmentType?.join(', ')} />
                                        <DetailRow label="Activeness" value={investor.investmentActiveness} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="space-y-8 animate-fadeIn">
                                    <SectionHeader icon={<Mail />} title="Communication Preferences" />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ContactRow icon={<Mail size={18} />} label="Email Address" value={investor.email} />
                                        <ContactRow icon={<Phone size={18} />} label="Phone Number" value={investor.phone} />
                                        <ContactRow icon={<MessageSquare size={18} />} label="Primary Channel" value={investor.communicationPreference} />
                                        {investor.investorLinkedin !== 'non' && (
                                            <a href={investor.investorLinkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-[#0a66c2]/10 text-[#0a66c2] rounded-2xl font-bold">
                                                <Linkedin /> LinkedIn Profile
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-amber-100 dark:border-amber-900/30 sticky top-6">
                            <div className="mb-6">
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Investment Capacity</span>
                                <div className="text-4xl font-black text-amber-500 mt-1">
                                    ₹{investor.investmentRange}
                                </div>
                                <div className="text-xs text-gray-400 mt-2 flex items-center gap-1 uppercase font-bold">
                                    <DollarSign size={12} /> Liquid Assets
                                </div>
                            </div>

                            <button
                                onClick={() => connectWithinvestor(id)}
                                disabled={actionLoading || requestSent}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-[#0b1120] rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500 flex items-center justify-center gap-2">
                                {actionLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                                {requestSent ? "Request Sent ✓" : `Connect with ${investor.fullName?.split(' ')[0]}`}
                            </button>
                            <button
                                onClick={() => addtowatchlist(id)}
                                disabled={actionLoading || inWatchlist}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-[#0b1120] rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all mb-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500 flex items-center justify-center gap-2">
                                {actionLoading ? <Loader2 size={20} className="animate-spin" /> : null}
                                {inWatchlist ? "Added to Watchlist ✓" : "Save for Later"}
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-bold text-green-500 uppercase">{investor.status}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Investment Interest</span>
                                    <span className="font-mono text-xs">{investor.investmentInterest}</span>
                                </div>
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
        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-lg">
            {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
    </div>
);

const InfoCard = ({ title, content, type }) => {
    const isWarning = type === "warning";
    return (
        <div className={`p-5 rounded-2xl border ${isWarning ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30' : 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'}`}>
            <h4 className={`text-xs font-bold mb-1 uppercase tracking-wider ${isWarning ? 'text-amber-700 dark:text-amber-400' : 'text-green-700 dark:text-green-400'}`}>
                {title}
            </h4>
            <p className="text-lg font-bold dark:text-gray-200 capitalize">{content || "Not specified"}</p>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-xl font-bold dark:text-gray-200 capitalize">{value || "Not Disclosed"}</p>
    </div>
);

const ContactRow = ({ icon, label, value }) => (
    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-800">

        <div className="flex items-center gap-2 text-gray-500 mb-1">
            {icon} <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
        </div>
        <p className="text-sm font-semibold truncate">{value}</p>
    </div>
);