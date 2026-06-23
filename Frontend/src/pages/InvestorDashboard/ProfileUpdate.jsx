import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import NotificationDropdown from "../../components/NotificationDropdown";
import { supabase } from "../../utils/supabaseClient";
import { useAuthStore } from "../../store/useAuthStore";
import growupLogo from "../../assets/icons/growup-logo.png";
import {
    User, Mail, MapPin, Briefcase, Link as LinkIcon,
    ShieldCheck, Bell, MessageSquare, CheckCircle,
    UploadCloud, FileText, ChevronRight, ChevronDown, Info, Video
} from "lucide-react";

import { useNavigate } from "react-router-dom";
/* ---------- CONFIG ---------- */
const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 3600;

const INVESTMENT_TYPES = ["loan", "equity", "share"];

const INDUSTRIES = [
    "FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech",
    "AI / ML", "SaaS", "E-Commerce", "LogiTech", "BioTech",
    "SpaceTech", "CyberSecurity", "GovTech", "LegalTech", "HRTech",
    "Real Estate", "FoodTech", "TravelTech", "Gaming", "Media & Entertainment"
];

const INVESTMENT_ACTIVENESS_OPTIONS = [
    { value: "Active", label: "Active — 5+ deals / year" },
    { value: "Occasional", label: "Occasional — 1–4 deals / year" },
    { value: "Passive", label: "Passive — evaluating only" },
];

const INVESTMENT_RANGES = [
    "₹1L – ₹5L",
    "₹5L – ₹25L",
    "₹25L – ₹50L",
    "₹50L – ₹1Cr",
    "₹1Cr – ₹5Cr",
    "₹5Cr – ₹10Cr",
    "₹10Cr+",
];

export default function InvestorProfilePage() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const token = useAuthStore((s) => s.token);

    const userId = useAuthStore((s) => s.userId);

    const [formData, setFormData] = useState({
        // -------- Basic Info --------
        // -------- Professional Details --------
        investerprofilePhoto: "",
        jobStatus: "",
        investmentRange: "",
        investmentActiveness: "",
        investmentInterest: "",
        investorLocation: "",
        investmentType: [],

        // -------- Financial Verification --------
        pan: "",
        investorLinkedin: "",
        proofOfFunds: "",
        kycId: "",

        // -------- Preferences --------
        notificationPreference: "email",
        communicationPreference: "webMeeting",
        acceptTerms: false,
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    /* ---------- CALCULATE PROFILE STRENGTH ---------- */
    const profileStrength = useMemo(() => {
        const fields = [
            "jobStatus",
            "investmentRange",
            "investmentActiveness",
            "investmentInterest",
            "investorLocation",
            "investorLinkedin",
            "pan",
            "kycId",
            "proofOfFunds",
        ];

        const filled = fields.filter((f) => !!formData[f]).length;
        return Math.round((filled / fields.length) * 100);
    }, [formData]);


    useEffect(() => {
        if (token && userId) loadProfile();

        else setLoading(false);

    }, [userId, token]);

    const loadProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/profile/investor/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const profile = res.data || {};
            console.log(profile.status);
            if (profile.status === "pending") {

                toast.error(`Your profile status is: ${profile.status}`);
                console.log("Status exists:", profile.status);
                navigate("/");
                return;
            }
            // Generate Signed URLs for existing files
            const files = ["pan", "kycId", "proofOfFunds", "investerprofilePhoto"];
            const updates = {};

            for (const field of files) {
                if (profile[field]) {
                    const { data } = await supabase.storage
                        .from(SUPABASE_BUCKET_NAME)
                        .createSignedUrl(profile[field], SIGNED_URL_EXPIRES);

                    updates[`${field}Url`] = data?.signedUrl;
                }
            }

            setFormData((prev) => ({ ...prev, ...profile, ...updates }));

        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file, fieldName, folder) => {
        if (!file) return;

        const path = `${folder}/${userId}-${Date.now()}`;

        try {
            await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .upload(path, file, { upsert: true });

            const { data } = await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .createSignedUrl(path, SIGNED_URL_EXPIRES);

            setFormData((prev) => ({
                ...prev,
                [fieldName]: path,                    // saved to DB
                [`${fieldName}Url`]: data.signedUrl,  // used for UI
            }));
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        }
    };

    const handleSave = async () => {
        if (!formData.acceptTerms) {
            toast.error("Please accept the terms to continue.");
            return;
        }
        setSaving(true);
        try {
            const payload = { ...formData };
            console.log("Saving payload:", payload);
            // Remove signed URLs from payload before sending to MongoDB
            Object.keys(payload).forEach(key => { if (key.endsWith('Url')) delete payload[key]; });

            await axios.put("http://localhost:5000/api/profile/investor/update", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Profile successfully synchronized.");

            // ✅ Redirect to home page
            navigate("/");
        } catch (err) {
            toast.error("Error saving profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617] transition-colors duration-300">

            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Securing session...</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#030711] text-gray-100" : "bg-white text-gray-900"}`}>


            {/* SUB PROFILE HEADER */}
            <div className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl transition-colors ${isDark ? "bg-[#030711]/80 border-gray-800 text-white" : "bg-white/80 border-gray-200 text-gray-900"
                }`}>


                <div className="flex items-center gap-3">
                    <img src={growupLogo} alt="GrowUp Logo" className="h-6" />
                    <span className="font-bold text-lg tracking-tight">GrowUp <span className="text-indigo-600">Investor</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-sm"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </div>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 grid grid-cols-12 gap-6 lg:gap-8">



                {/* LEFT SIDEBAR: PROFILE SUMMARY */}
                <aside className="col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-24 self-start h-fit">
                    <div className={`rounded-xl p-6 border shadow-sm overflow-hidden relative transition-colors ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                        }`}>


                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                        {/* <a href={formData.investerprofilePhotoUrl} target="_blank" rel="noopener noreferrer">{formData.investerprofilePhotoUrl}</a> */}
                        <div className="relative flex flex-col items-center text-center">
                            <div className="relative group cursor-pointer">
                                <div className={`w-28 h-28 rounded-xl border-4 shadow-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 ${isDark ? "bg-gray-800 border-gray-900" : "bg-gray-50 border-white"
                                    }`}>


                                    {formData.investerprofilePhotoUrl ? (
                                        <img
                                            src={formData.investerprofilePhotoUrl}
                                            className="w-full h-full object-cover"
                                            alt="Profile"
                                        />
                                        // <a href={formData.investerprofilePhotoUrl} target="_blank" rel="noopener noreferrer">image</a>
                                    ) : (
                                        <User className="w-12 h-12 text-slate-400" />
                                    )}


                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                                    <UploadCloud size={18} />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleUpload(
                                                e.target.files[0],
                                                "investerprofilePhoto",
                                                "avatars"
                                            )
                                        }
                                    />

                                </label>
                            </div>

                            <h2 className="mt-5 text-xl font-bold">{formData.fullName || "Your Name"}</h2>
                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                <MapPin size={14} /> {formData.investorLocation || "Location not set"}
                            </p>
                        </div>

                        <div className={`mt-8 pt-8 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>


                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Strength</span>
                                <span className="text-xs font-bold text-indigo-500">{profileStrength}%</span>
                            </div>
                            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>

                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${profileStrength}%` }}></div>
                            </div>

                            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                                Complete profiles are <span className="text-indigo-500 font-bold">3.5x more likely</span> to get high-quality founder matches.
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-500/20">
                        <Info className="mb-3 opacity-80" />
                        <h4 className="font-bold mb-1">Investor Privacy</h4>
                        <p className="text-xs text-indigo-100 leading-relaxed opacity-90">
                            Your financial documents (PAN, KYC, Proof of Funds) are encrypted and only visible to authorized compliance officers.
                        </p>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div className="col-span-12 lg:col-span-9 space-y-8">

                    {/* SECTION 1: PROFESSIONAL IDENTITY */}
                    <div className={`rounded-xl border shadow-sm transition-colors ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                        }`}>


                        <div className={`p-8 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>


                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Briefcase className="text-indigo-500" size={20} /> Professional Identity
                            </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className={`w-full pl-12 pr-4 py-3 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none ${isDark ? "bg-gray-800 text-white focus:bg-gray-800" : "bg-gray-50 text-gray-900 focus:bg-white"
                                            }`}


                                        placeholder="As per PAN card"
                                        value={formData.fullName}
                                        // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        readOnly
                                    />

                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">LinkedIn Profile</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className={`w-full pl-12 pr-4 py-3 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                                            }`}


                                        placeholder="linkedin.com/in/username"
                                        value={formData.investorLinkedin}
                                        onChange={(e) => setFormData({ ...formData, investorLinkedin: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current Job Status</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900 font-medium"
                                        }`}
                                    placeholder="e.g. Angel Investor, Venture Partner"
                                    value={formData.jobStatus}
                                    onChange={(e) => setFormData({ ...formData, jobStatus: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Primary Location</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-3 border-transparent focus:border-indigo-500 rounded-2xl transition-all outline-none ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900 font-medium"
                                        }`}
                                    placeholder="City, Country"
                                    value={formData.investorLocation}
                                    onChange={(e) => setFormData({ ...formData, investorLocation: e.target.value })}
                                />
                            </div>


                        </div>
                    </div>

                    {/* SECTION 2: INVESTMENT THESIS */}
                    <div className={`rounded-xl border shadow-sm transition-colors ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                        }`}>


                        <div className={`p-8 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>


                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <CheckCircle className="text-indigo-500" size={20} /> Investment Thesis
                            </h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Investment Range</label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-3 pr-10 border hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-2xl transition-all outline-none font-medium cursor-pointer appearance-none ${isDark ? "bg-gray-800 border-gray-700 text-slate-200" : "bg-gray-50 border-gray-200 text-slate-700"
                                                }`}


                                            value={formData.investmentRange}
                                            onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                                        >
                                            <option value="">Select a range…</option>
                                            {INVESTMENT_RANGES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Investment Activeness</label>
                                    <div className="relative">
                                        <select
                                            className={`w-full px-4 py-3 pr-10 border hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 rounded-2xl transition-all outline-none font-medium cursor-pointer appearance-none ${isDark ? "bg-gray-800 border-gray-700 text-slate-200" : "bg-gray-50 border-gray-200 text-slate-700"
                                                }`}
                                            value={formData.investmentActiveness}
                                            onChange={(e) => setFormData({ ...formData, investmentActiveness: e.target.value })}
                                        >

                                            <option value="">Select activeness…</option>
                                            {INVESTMENT_ACTIVENESS_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-3 block">Preferred Asset Classes</label>
                                <div className="flex flex-wrap gap-3">
                                    {INVESTMENT_TYPES.map((type) => {
                                        const isSelected = formData.investmentType.includes(type);

                                        return (

                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        investmentType: isSelected
                                                            ? prev.investmentType.filter(t => t !== type)
                                                            : [...prev.investmentType, type]
                                                    }))
                                                }
                                                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${isSelected
                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                                        : `${isDark ? "bg-gray-800 border-transparent text-gray-400 hover:bg-gray-700" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}`
                                                    }`}



                                            >
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>

                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block">Sectors of Interest</label>
                                <p className="text-xs text-slate-400 -mt-1 ml-1">Click to select all industries you are interested in investing in.</p>
                                <div className="flex flex-wrap gap-2">
                                    {INDUSTRIES.map((industry) => {
                                        const selected = (formData.investmentInterest || "").split(",").map(s => s.trim()).filter(Boolean).includes(industry);
                                        return (
                                            <button
                                                type="button"
                                                key={industry}
                                                onClick={() => {
                                                    const current = (formData.investmentInterest || "").split(",").map(s => s.trim()).filter(Boolean);
                                                    const updated = selected
                                                        ? current.filter(i => i !== industry)
                                                        : [...current, industry];
                                                    setFormData({ ...formData, investmentInterest: updated.join(", ") });
                                                }}
                                                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${selected
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/30"
                                                        : `${isDark ? "bg-gray-800 border-transparent text-gray-400 hover:bg-gray-700" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"}`
                                                    }`}



                                            >
                                                {selected && <span className="mr-1">✓</span>}{industry}
                                            </button>
                                        );
                                    })}
                                </div>
                                {formData.investmentInterest && (
                                    <p className="text-[11px] text-indigo-400 ml-1">
                                        Selected: {formData.investmentInterest}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: DOCUMENT VAULT */}
                    <div className={`rounded-xl border shadow-sm overflow-hidden transition-colors ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                        }`}>


                        <div className={`p-8 border-b flex justify-between items-center ${isDark ? "border-gray-800" : "border-gray-100"}`}>


                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <FileText className="text-indigo-500" size={20} /> Verification Vault
                            </h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: "PAN Card", key: "pan", folder: "investor-docs" },
                                { label: "KYC ID", key: "kycId", folder: "investor-docs" },
                                { label: "Proof of Funds", key: "proofOfFunds", folder: "investor-docs" }
                            ].map((doc) => (
                                <div key={doc.key} className={`relative group p-6 rounded-xl border-2 border-dashed flex flex-col items-center text-center hover:border-indigo-500 transition-all ${isDark ? "border-gray-800" : "border-gray-100"
                                    }`}>

                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${formData[doc.key]
                                            ? 'bg-emerald-500 text-white'
                                            : isDark ? 'bg-gray-800 text-slate-500' : 'bg-gray-50 text-slate-400'
                                        }`}>


                                        {formData[doc.key] ? <CheckCircle size={24} /> : <UploadCloud size={24} />}
                                    </div>
                                    <span className="text-sm font-bold mb-1">{doc.label}</span>

                                    {/* PREVIEW LINK: Uses fresh signed URL from state */}
                                    {formData[doc.key + 'Url'] ? (
                                        <a
                                            href={formData[doc.key + 'Url']}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline cursor-pointer z-10 relative"
                                        >
                                            View PDF
                                        </a>
                                    ) : (
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Required</span>
                                    )}

                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf,image/*"
                                        onChange={(e) => handleUpload(e.target.files[0], doc.key, doc.folder)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: PREFERENCES */}
                    <div className={`rounded-xl border shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center justify-between transition-colors ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                        }`}>



                        <div className="flex gap-8 w-full">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <Bell size={14} /> Notifications
                                </label>
                                <select
                                    className={`w-full px-4 py-3 rounded-2xl border-none font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                                        }`}


                                    value={formData.notificationPreference}
                                    onChange={(e) => setFormData({ ...formData, notificationPreference: e.target.value })}
                                >
                                    <option value="email">Email Digest</option>
                                    <option value="sms">SMS Alerts</option>
                                </select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <MessageSquare size={14} /> Communication
                                </label>
                                <select
                                    className={`w-full px-4 py-3 rounded-2xl border-none font-bold text-sm outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-900"
                                        }`}


                                    value={formData.communicationPreference}
                                    onChange={(e) => setFormData({ ...formData, communicationPreference: e.target.value })}
                                >
                                    <option value="webMeeting">Video Meeting</option>
                                    <option value="chatbox">Real-time Chat</option>
                                </select>
                            </div>
                        </div>

                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            <label className="flex items-start sm:items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 rounded-md sm:rounded-lg
                                 border-2 text-indigo-600
                                 focus:ring-indigo-500 transition-all ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}


                                    checked={formData.acceptTerms}
                                    onChange={(e) =>
                                        setFormData({ ...formData, acceptTerms: e.target.checked })
                                    }
                                />
                                <span className="text-xs sm:text-sm font-medium text-slate-500
                                     leading-snug sm:leading-normal
                                     group-hover:text-slate-900 dark:group-hover:text-white
                                     transition-colors">
                                    I agree to the{" "}
                                    <span className="text-indigo-500 underline">
                                        Platform Terms
                                    </span>
                                </span>
                            </label>
                        </div>

                    </div>
                </div>
            </main>

            {/* FLOATING ACTION BUTTON FOR MOBILE */}
            <div className="md:hidden fixed bottom-6 right-6">
                <button onClick={handleSave} className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl animate-bounce">
                    <CheckCircle />
                </button>
            </div>
        </div>
    );
}