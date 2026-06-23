import React, { useEffect, useState, useMemo, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import NotificationDropdown from "../../components/NotificationDropdown";
import { supabase } from "../../utils/supabaseClient";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import growupLogo from "../../assets/icons/growup-logo.png";

import {
    Layers,
    Target,
    DollarSign,
    FileText,
    UploadCloud,
    CheckCircle,
    MapPin,
    Briefcase,
    Link as LinkIcon,
    PlayCircle,
    User,
    ShieldCheck,
    Info,
    ExternalLink,
    Loader2,
    Video,
    Sun,
    Moon,
    Zap
} from "lucide-react";

/* ---------- CONFIG ---------- */
const SUPABASE_BUCKET_NAME = "Grow-up";
const SIGNED_URL_EXPIRES = 3600;

const INDUSTRIES = [
    "FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech",
    "AI / ML", "SaaS", "E-Commerce", "LogiTech", "BioTech",
    "SpaceTech", "CyberSecurity", "GovTech", "LegalTech", "HRTech",
    "Real Estate", "FoodTech", "TravelTech", "Gaming", "Media & Entertainment"
];

const FUNDING_TYPES = ["loan", "equity", "share"];


/* ---------- REUSABLE SUB-COMPONENTS (Defined outside to prevent re-render bugs) ---------- */
function Block({ title, icon: Icon, children, isDark }) {
    return (
        <div className="rounded-xl border overflow-hidden transition-all bg-blue-900/20 border-blue-400/30">
            <div className="p-6 border-b flex items-center gap-2 bg-blue-900/30 border-blue-400/20">
                <Icon className="text-blue-400" size={20} />
                <h3 className="font-bold text-lg text-white">{title}</h3>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">{children}</div>
        </div>
    );
}


function Input({ label, value, onChange, name, type = "text", isDark }) {
    return (
        <div>
            <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">{label}</label>
            <input
                type={type}
                className="w-full p-4 rounded-2xl border transition-all focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-medium bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50"
                value={value || ""}
                onChange={(e) => onChange(name, e.target.value)}
            />
        </div>
    );
}


function Textarea({ label, value, onChange, name, isDark }) {
    return (
        <div className="md:col-span-2">
            <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">{label}</label>
            <textarea
                className="w-full p-4 rounded-2xl border transition-all focus:ring-4 focus:ring-blue-500/10 focus:outline-none h-32 resize-none font-medium bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50"
                value={value || ""}
                onChange={(e) => onChange(name, e.target.value)}
            />
        </div>
    );
}


function FileUploadField({ label, onUpload, signedUrl, isUploading, isDark }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs ml-1 font-bold uppercase tracking-wider text-blue-300">{label}</label>
            <div className={`relative border-2 border-dashed transition-all rounded-2xl p-6 ${signedUrl ? 'border-emerald-400/50 bg-emerald-900/20' : 'border-blue-400/20 bg-blue-900/10'}
                `}>
                <div className="flex flex-col items-center justify-center gap-2">
                    {isUploading ? (
                        <Loader2 className="animate-spin text-blue-400" />
                    ) : (
                        <UploadCloud className={signedUrl ? "text-emerald-400" : "text-blue-300"} />
                    )}

                    <div className="text-center">
                        <label className="cursor-pointer text-sm font-black text-blue-400 hover:text-blue-300">
                            {signedUrl ? "Replace File" : "Choose File"}
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => onUpload(e.target.files[0])}
                                disabled={isUploading}
                            />
                        </label>
                        <p className="text-[10px] text-gray-400 mt-1 font-bold">PDF, PNG, JPG up to 10MB</p>
                    </div>

                    {signedUrl && (
                        <a
                            href={signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl border transition-all font-bold bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
                        >
                            <ExternalLink size={12} /> View Document
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}


/* ---------- MAIN COMPONENT ---------- */
export default function FounderProfilePage() {
    const navigate = useNavigate();
    const token = useAuthStore((s) => s.token);
    const userId = useAuthStore((s) => s.userId);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);

    const [formData, setFormData] = useState({
        // startupName: "",
        startupImage: "",
        tagline: "",
        industry: "",
        startupDescription: "",
        problemStatement: "",
        solutionOverview: "",
        targetMarket: "",
        founderLinkedin: "",
        foundedYear: "",
        startupLocation: "",
        valuation: "",
        fundingRequirement: "",
        equityOffer: "",
        fundingType: [],
        existingInvestors: "",
        businessModel: "",
        useOfFunds: "",
        pitchDeckUrl: "",
        pitchVideoUrl: "",
        productImageUrl: "",
        teamSize: "",
        coFounders: "",
        experienceBackground: "",
        firmRegistration: "",
        patentDetails: "",
        acceptTerms: false,
    });

    const profileStrength = useMemo(() => {
        const fields = ["industry", "problemStatement", "solutionOverview", "fundingRequirement", "equityOffer", "pitchDeckUrl"];
        const filled = fields.filter((f) => !!formData[f]).length;
        return Math.round((filled / fields.length) * 100);
    }, [formData]);

    useEffect(() => {
        if (token && userId) loadProfile();
        else setLoading(false);
    }, [token, userId]);

    const loadProfile = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/founder/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const profile = res.data || {};
            const files = ["pitchDeckUrl", "productImageUrl", "firmRegistration", "patentDetails"];
            const signed = {};

            for (const f of files) {
                if (profile[f]) {
                    const { data } = await supabase.storage
                        .from(SUPABASE_BUCKET_NAME)
                        .createSignedUrl(profile[f], SIGNED_URL_EXPIRES);
                    signed[`${f}SignedUrl`] = data?.signedUrl;
                }
            }
            setFormData((prev) => ({ ...prev, ...profile, ...signed }));
        } catch (err) {
            console.error("Load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = async (file, field, folder) => {
        if (!file) return;
        setUploadingField(field);
        const path = `${folder}/${userId}-${Date.now()}-${file.name}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .upload(path, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = await supabase.storage
                .from(SUPABASE_BUCKET_NAME)
                .createSignedUrl(path, SIGNED_URL_EXPIRES);

            setFormData((prev) => ({
                ...prev,
                [field]: path,
                [`${field}SignedUrl`]: data.signedUrl,
            }));
        } catch (err) {
            console.error(err);
            toast.error("Upload failed. Please try again.");
        } finally {
            setUploadingField(null);
        }
    };

    const handleSave = async () => {
        if (!formData.acceptTerms) {
            toast.error("Please accept the terms and conditions");
            return;
        }
        setSaving(true);

        try {
            const payload = { ...formData };
            // Remove signed urls before sending to backend
            Object.keys(payload).forEach((k) => {
                if (k.endsWith("SignedUrl")) delete payload[k];
            });

            await axios.put("http://localhost:5000/api/founder/update", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Profile updated successfully!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Save failed. Please check your connection.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>

                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>
            <div className="border-b px-8 py-5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-lg transition-all bg-blue-900/20 border-blue-400/30">




                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <img src={growupLogo} className="h-6" alt="Logo" />
                        <span className="font-bold text-lg tracking-tight">
                            GrowUp <span className="text-blue-400">Founder</span>
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                    {saving && <Loader2 className="animate-spin" size={16} />}
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </div>


            <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8 px-6 py-10">
                {/* SIDEBAR */}
                <aside className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="rounded-[2.5rem] p-8 border text-center sticky top-28 transition-all bg-blue-900/20 border-blue-400/30">
                        <div className="group relative w-32 h-32 mx-auto rounded-[2.5rem] overflow-hidden flex items-center justify-center border transition-all bg-blue-900/40 border-blue-400/30 shadow-inner">
                            {formData.productImageUrlSignedUrl ? (
                                <img src={formData.productImageUrlSignedUrl} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <Layers className="w-10 h-10 text-gray-400" />
                            )}
                            {uploadingField === "productImageUrl" && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white" />
                                </div>
                            )}
                        </div>


                        <label className="block mt-4 text-sm font-semibold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
                            Change Startup Logo
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(e.target.files[0], "productImageUrl", "startup-branding")}
                            />
                        </label>

                        <h2 className="mt-6 text-2xl font-black truncate tracking-tight text-white">{formData.startupName || "Your Startup"}</h2>
                        <p className="text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mt-2 text-blue-300">
                            <MapPin size={14} className="text-blue-400" /> {formData.startupLocation || "Location not set"}
                        </p>

                        <div className="mt-10 pt-8 border-t border-blue-400/20">
                            <div className="flex justify-between text-[10px] mb-3 px-1">
                                <span className="text-blue-300 font-black uppercase tracking-widest">Profile Power</span>
                                <span className="text-blue-400 font-black">{profileStrength}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden bg-blue-900/30">
                                <div
                                    className="h-full bg-blue-400 transition-all duration-700 shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                                    style={{ width: `${profileStrength}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </aside>


                {/* FORM SECTIONS */}
                <section className="col-span-12 lg:col-span-9 space-y-8">
                    <Block title="Startup Identity" icon={Layers} isDark={isDark}>
                        <Input label="Startup Name" name="startupName" value={formData.startupName} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Tagline" name="tagline" value={formData.tagline} onChange={handleInputChange} isDark={isDark} />

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest ml-1 block text-blue-300">Industry Selection</label>
                            <p className="text-[10px] text-gray-400 -mt-1 ml-1 font-medium">Select industries that best define your venture.</p>
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRIES.map((ind) => {
                                    const selected = (formData.industry || "").split(",").map(s => s.trim()).filter(Boolean).includes(ind);
                                    return (
                                        <button
                                            type="button"
                                            key={ind}
                                            onClick={() => {
                                                const current = (formData.industry || "").split(",").map(s => s.trim()).filter(Boolean);
                                                const updated = selected
                                                    ? current.filter(i => i !== ind)
                                                    : [...current, ind];
                                                handleInputChange("industry", updated.join(", "));
                                            }}
                                            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all border ${selected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30"
                                                    : "bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
                                                }`}
                                        >
                                            {selected && <CheckCircle className="inline mr-1.5" size={12} />}{ind}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <Input label="Founded Year" name="foundedYear" type="date" value={formData.foundedYear} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Location" name="startupLocation" value={formData.startupLocation} onChange={handleInputChange} isDark={isDark} />
                        <Input label="LinkedIn URL" name="founderLinkedin" value={formData.founderLinkedin} onChange={handleInputChange} isDark={isDark} />
                        <Textarea label="Startup Mission" name="startupDescription" value={formData.startupDescription} onChange={handleInputChange} isDark={isDark} />
                    </Block>

                    <Block title="Problem & Solution" icon={Zap} isDark={isDark}>
                        <Textarea label="Problem Statement" name="problemStatement" value={formData.problemStatement} onChange={handleInputChange} isDark={isDark} />
                        <Textarea label="Solution Overview" name="solutionOverview" value={formData.solutionOverview} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Target Audience" name="targetMarket" value={formData.targetMarket} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Revenue Model" name="businessModel" value={formData.businessModel} onChange={handleInputChange} isDark={isDark} />
                    </Block>

                    <Block title="Investment & Funding" icon={DollarSign} isDark={isDark}>
                        <Input label="Current Valuation ($)" name="valuation" type="number" value={formData.valuation} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Capital Asked ($)" name="fundingRequirement" type="number" value={formData.fundingRequirement} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Equity Offer (%)" name="equityOffer" type="number" value={formData.equityOffer} onChange={handleInputChange} isDark={isDark} />

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest ml-1 block text-blue-300">Funding Instruments</label>
                            <div className="flex flex-wrap gap-3 mt-1">
                                {FUNDING_TYPES.map((type) => {
                                    const selected = formData.fundingType?.includes(type);
                                    return (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => {
                                                const current = formData.fundingType || [];
                                                const updated = selected
                                                    ? current.filter(t => t !== type)
                                                    : [...current, type];
                                                handleInputChange("fundingType", updated);
                                            }}
                                            className={`px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${selected
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30'
                                                    : "bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
                                                }`}
                                        >
                                            {selected && <CheckCircle className="inline mr-1.5" size={12} />}{type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest ml-1 block text-blue-300">Raised Capital Before?</label>
                            <div className="flex gap-8 ml-1">
                                {["Yes", "No"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="existingInvestors"
                                            className="w-5 h-5 border-2 transition-all cursor-pointer bg-blue-900/20 border-blue-400/30 text-blue-400"
                                            checked={formData.existingInvestors === opt}
                                            onChange={() => handleInputChange("existingInvestors", opt)}
                                        />
                                        <span className="text-sm font-black uppercase tracking-widest text-blue-300\">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Textarea label="Roadmap / Fund Utilization" name="useOfFunds" value={formData.useOfFunds} onChange={handleInputChange} isDark={isDark} />
                    </Block>


                    <Block title="Pitch Assets" icon={FileText} isDark={isDark}>
                        <FileUploadField
                            label="Deck (PDF Preferred)"
                            signedUrl={formData.pitchDeckUrlSignedUrl}
                            isUploading={uploadingField === "pitchDeckUrl"}
                            onUpload={(f) => handleUpload(f, "pitchDeckUrl", "founder-decks")}
                            isDark={isDark}
                        />
                        <Input label="Video Pitch Link" name="pitchVideoUrl" value={formData.pitchVideoUrl} onChange={handleInputChange} isDark={isDark} />
                    </Block>


                    <Block title="Leadership Team" icon={User} isDark={isDark}>
                        <Input label="Active Members" name="teamSize" type="number" value={formData.teamSize} onChange={handleInputChange} isDark={isDark} />
                        <Input label="Co-Founders" name="coFounders" value={formData.coFounders} onChange={handleInputChange} isDark={isDark} />
                        <Textarea label="Founding Journey" name="experienceBackground" value={formData.experienceBackground} onChange={handleInputChange} isDark={isDark} />
                    </Block>


                    <Block title="Compliance & IP" icon={ShieldCheck} isDark={isDark}>
                        <Input label="Tax Identification (e.g. GST)" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} isDark={isDark} />
                        <FileUploadField
                            label="Certificate Of Incorporation"
                            signedUrl={formData.firmRegistrationSignedUrl}
                            isUploading={uploadingField === "firmRegistration"}
                            onUpload={(f) => handleUpload(f, "firmRegistration", "legal-docs")}
                            isDark={isDark}
                        />
                        <FileUploadField
                            label="IP / Patent Proofs"
                            signedUrl={formData.patentDetailsSignedUrl}
                            isUploading={uploadingField === "patentDetails"}
                            onUpload={(f) => handleUpload(f, "patentDetails", "legal-docs")}
                            isDark={isDark}
                        />
                    </Block>


                    <div className="p-10 rounded-[3rem] border transition-all bg-blue-900/20 border-blue-400/30">
                        <label className="flex gap-6 items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-8 h-8 rounded-xl transition-all border-2 cursor-pointer bg-blue-900/20 border-blue-400/30 text-blue-400"
                                checked={formData.acceptTerms}
                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                            />
                            <span className="font-medium transition-colors text-blue-200 group-hover:text-white">
                                I confirm that all provided details and documents are accurate and represent my startup truthfully.
                                <span className="text-rose-500 ml-1 font-bold">*</span>
                            </span>
                        </label>
                    </div>


                </section>
            </main>
        </div>
    );
}