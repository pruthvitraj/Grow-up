import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { supabase } from "../../utils/supabaseClient";

/* ---------- OPTIONS ---------- */
const INVESTMENT_ACTIVENESS_OPTIONS = [
    { value: "Active",     label: "Active — 5+ deals / year" },
    { value: "Occasional", label: "Occasional — 1–4 deals / year" },
    { value: "Passive",    label: "Passive — evaluating only" },
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

const INDUSTRIES = [
    "FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech",
    "AI / ML", "SaaS", "E-Commerce", "LogiTech", "BioTech",
    "SpaceTech", "CyberSecurity", "GovTech", "LegalTech", "HRTech",
    "Real Estate", "FoodTech", "TravelTech", "Gaming", "Media & Entertainment"
];

export default function InvestorForm({ formData, setFormData, nextStep, prevStep }) {
    const [subStep, setSubStep] = useState(1);
    const [errors, setErrors] = useState({});
    const { theme } = useContext(ThemeContext);

    const goNext = () => setSubStep((prev) => prev + 1);
    const goBack = () => setSubStep((prev) => prev - 1);

    const steps = ["Professional", "Financial", "Preferences"];

    const inputCls = `w-full px-4 py-2.5 rounded-xl border ${
        theme === "dark"
            ? "bg-[#1e293b] border-gray-600 text-white"
            : "bg-gray-50 border-gray-300 text-gray-900"
    } focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all`;

    /* ======================================================
       VALIDATION HANDLERS FOR EACH STEP
    ====================================================== */
    const validateStep1 = () => {
        let err = {};

        if (!formData.jobStatus?.trim()) err.jobStatus = "Job status is required";
        if (!formData.investorLocation?.trim()) err.investorLocation = "Location is required";
        if (!formData.investmentRange?.trim()) err.investmentRange = "Investment range is required";
        if (!formData.investmentActiveness?.trim()) err.investmentActiveness = "Investment activeness is required";

        if (!formData.investmentType || formData.investmentType.length === 0)
            err.investmentType = "Select at least one investment type";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateStep2 = () => {
        let err = {};

        if (!formData.pan) err.pan = "PAN PDF upload required";
        if (!formData.kycId) err.kycId = "KYC document required";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateStep3 = () => {
        let err = {};

        if (!formData.acceptTerms) err.acceptTerms = "You must accept the terms.";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    /* ======================================================
       SUPABASE PDF UPLOAD
    ====================================================== */
    const uploadPdf = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files allowed!");
            return;
        }

        const filePath = `investor-docs/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("Grow-up")
            .upload(filePath, file);

        if (error) {
            console.error("UPLOAD ERROR:", error);
            toast.error("Upload failed!");
            return;
        }

        const { data: signedUrlData } = await supabase.storage
            .from("Grow-up")
            .createSignedUrl(filePath, 60 * 60 * 24);

        setFormData({
            ...formData,
            [fieldName]: filePath,
            [fieldName + "Url"]: signedUrlData?.signedUrl,
        });
    };

    const PdfUploadField = ({ label, fieldName }) => (
        <div className="mb-5">
            <label className="block mb-1 font-medium">{label}</label>

            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => uploadPdf(e, fieldName)}
            />

            {errors[fieldName] && (
                <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
            )}

            {formData[fieldName + "Url"] && (
                <a
                    href={formData[fieldName + "Url"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 mt-2 block"
                >
                    View Uploaded PDF
                </a>
            )}
        </div>
    );

    /* ======================================================
       INDUSTRY TAG TOGGLE HELPER
    ====================================================== */
    const toggleIndustry = (industry) => {
        const current = (formData.investmentInterest || "")
            .split(",").map(s => s.trim()).filter(Boolean);
        const isSelected = current.includes(industry);
        const updated = isSelected
            ? current.filter(i => i !== industry)
            : [...current, industry];
        setFormData({ ...formData, investmentInterest: updated.join(", ") });
    };

    /* ======================================================
       MAIN JSX
    ====================================================== */
    return (
        <div
            className={`max-w-3xl mx-auto p-8 rounded-xl shadow-lg transition-all 
            ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-white text-gray-800"}`}
        >
            <h2 className="text-2xl font-bold mb-6">Investor Registration</h2>

            {/* Progress bar */}
            <div className="flex justify-between mb-8">
                {steps.map((label, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                        <div
                            className={`w-full h-1 rounded 
                                ${subStep >= index + 1 ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-700"}`}
                        ></div>

                        <span
                            className={`mt-2 text-sm font-medium 
                                ${subStep === index + 1 ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"}`}
                        >
                            Step {index + 1}
                        </span>
                        <p className="text-xs">{label}</p>
                    </div>
                ))}
            </div>

            {/* STEP 1 */}
            {subStep === 1 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Professional Details</h3>

                    {/* Job Status */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Job Status</label>
                        <input
                            className={inputCls}
                            placeholder="e.g. Working Professional, Business Owner"
                            value={formData.jobStatus || ""}
                            onChange={(e) => setFormData({ ...formData, jobStatus: e.target.value })}
                        />
                        {errors.jobStatus && <p className="text-red-500 text-sm mt-1">{errors.jobStatus}</p>}
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Investor Location</label>
                        <input
                            className={inputCls}
                            placeholder="City, Country"
                            value={formData.investorLocation || ""}
                            onChange={(e) => setFormData({ ...formData, investorLocation: e.target.value })}
                        />
                        {errors.investorLocation && <p className="text-red-500 text-sm mt-1">{errors.investorLocation}</p>}
                    </div>

                    {/* Investment Range — DROPDOWN */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Investment Range</label>
                        <div className="relative">
                            <select
                                className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                                value={formData.investmentRange || ""}
                                onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                            >
                                <option value="">-- Select Investment Range --</option>
                                {INVESTMENT_RANGES.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">▾</span>
                        </div>
                        {errors.investmentRange && <p className="text-red-500 text-sm mt-1">{errors.investmentRange}</p>}
                    </div>

                    {/* Investment Activeness — DROPDOWN */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Investment Activeness</label>
                        <div className="relative">
                            <select
                                className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                                value={formData.investmentActiveness || ""}
                                onChange={(e) => setFormData({ ...formData, investmentActiveness: e.target.value })}
                            >
                                <option value="">-- Select Activeness --</option>
                                {INVESTMENT_ACTIVENESS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">▾</span>
                        </div>
                        {errors.investmentActiveness && <p className="text-red-500 text-sm mt-1">{errors.investmentActiveness}</p>}
                    </div>

                    {/* Investment Interest — TAG PICKER */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Investment Interest (Sectors)</label>
                        <p className="text-xs text-gray-400 mb-2">Click to select the industries you're interested in</p>
                        <div className="flex flex-wrap gap-2">
                            {INDUSTRIES.map((industry) => {
                                const isSelected = (formData.investmentInterest || "")
                                    .split(",").map(s => s.trim()).filter(Boolean).includes(industry);
                                return (
                                    <button
                                        type="button"
                                        key={industry}
                                        onClick={() => toggleIndustry(industry)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            isSelected
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                                                : theme === "dark"
                                                    ? "bg-slate-800 border-slate-600 text-slate-300 hover:border-indigo-400"
                                                    : "bg-gray-100 border-gray-300 text-gray-700 hover:border-indigo-400"
                                        }`}
                                    >
                                        {isSelected ? "✓ " : ""}{industry}
                                    </button>
                                );
                            })}
                        </div>
                        {formData.investmentInterest && (
                            <p className="text-xs text-indigo-400 mt-2">Selected: {formData.investmentInterest}</p>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Investor LinkedIn</label>
                        <input
                            className={inputCls}
                            placeholder="https://linkedin.com/in/username"
                            value={formData.investorLinkedin || ""}
                            onChange={(e) => setFormData({ ...formData, investorLinkedin: e.target.value })}
                        />
                    </div>

                    {/* Checkbox Investment Type */}
                    <div className="mb-4 mt-6">
                        <label className="block mb-2 font-medium">Investment Type</label>

                        {["loan", "equity", "share"].map((type) => (
                            <div key={type} className="flex items-center gap-3 mb-2">
                                <input
                                    type="checkbox"
                                    checked={formData.investmentType?.includes(type)}
                                    onChange={(e) => {
                                        const updated = formData.investmentType || [];
                                        let final = e.target.checked
                                            ? [...updated, type]
                                            : updated.filter((t) => t !== type);

                                        setFormData({ ...formData, investmentType: final });
                                    }}
                                />
                                <label className="capitalize">{type}</label>
                            </div>
                        ))}

                        {errors.investmentType && (
                            <p className="text-red-500 text-sm">{errors.investmentType}</p>
                        )}
                    </div>

                    <div className="flex justify-between mt-8">
                        <button className="btn-outline" onClick={prevStep}>
                            Back
                        </button>
                        <button className="btn" onClick={() => validateStep1() && goNext()}>
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2 */}
            {subStep === 2 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Financial Verification</h3>

                    <PdfUploadField label="PAN Card" fieldName="pan" />
                    <PdfUploadField label="KYC Document" fieldName="kycId" />
                    <PdfUploadField label="Proof of Funds" fieldName="proofOfFunds" />

                    <div className="flex justify-between mt-8">
                        <button className="btn-outline" onClick={goBack}>
                            Back
                        </button>
                        <button className="btn" onClick={() => validateStep2() && goNext()}>
                            Continue →
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3 */}
            {subStep === 3 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Preferences</h3>

                    <label className="block mb-1 font-medium">Notification</label>
                    {["sms", "email"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 mb-2">
                            <input
                                type="radio"
                                name="notify"
                                checked={formData.notificationPreference === opt}
                                onChange={() =>
                                    setFormData({ ...formData, notificationPreference: opt })
                                }
                            />
                            {opt.toUpperCase()}
                        </label>
                    ))}

                    <label className="block mt-4 mb-2 font-medium">Communication</label>
                    {["webMeeting", "chatbox"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 mb-2">
                            <input
                                type="radio"
                                name="communicationPreference"
                                checked={formData.communicationPreference === opt}
                                onChange={() =>
                                    setFormData({ ...formData, communicationPreference: opt })
                                }
                            />
                            {opt === "webMeeting" ? "Web Meeting" : "Chatbox"}
                        </label>
                    ))}

                    {/* Terms */}
                    <label className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={(e) =>
                                setFormData({ ...formData, acceptTerms: e.target.checked })
                            }
                        />
                        Accept terms & conditions
                    </label>

                    {errors.acceptTerms && (
                        <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
                    )}

                    <div className="flex justify-between mt-8">
                        <button className="btn-outline" onClick={goBack}>
                            Back
                        </button>
                        <button className="btn" onClick={() => validateStep3() && nextStep()}>
                            Continue →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
