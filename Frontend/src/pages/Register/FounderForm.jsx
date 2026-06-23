import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/ThemeContext";
import { supabase } from "../../utils/supabaseClient";

const INDUSTRIES = [
    "FinTech", "HealthTech", "EdTech", "AgriTech", "CleanTech",
    "AI / ML", "SaaS", "E-Commerce", "LogiTech", "BioTech",
    "SpaceTech", "CyberSecurity", "GovTech", "LegalTech", "HRTech",
    "Real Estate", "FoodTech", "TravelTech", "Gaming", "Media & Entertainment"
];

export default function FounderForm({ formData, setFormData, nextStep, prevStep }) {
    const [subStep, setSubStep] = useState(1);
    const [errors, setErrors] = useState({});
    const { theme } = useContext(ThemeContext);

    const goNext = () => {
        if (validateStep(subStep)) {
            setSubStep((prev) => prev + 1);
        }
    };

    const goBack = () => setSubStep((prev) => prev - 1);

    const steps = ["Startup Info", "Financial Info", "Team & Legal"];
    const placeholders = {
        startupName: "Enter your startup name",
        tagline: "Short one-line description of your startup",
        foundedYear: "",
        industry: "e.g. FinTech, HealthTech, EdTech",
        startupLocation: "City, Country",
        startupDescription: "Brief description of your startup idea",
        problemStatement: "What problem are you solving?",
        solutionOverview: "How does your product solve the problem?",
        targetMarket: "Who are your target customers?",
        founderLinkedin: "https://linkedin.com/in/username",

        valuation: "Company valuation min ₹50,000",
        fundingRequirement: "Amount you want to raise (min ₹50,000)",
        equityOffer: "Equity offered (%) min 1",
        businessModel: "Explain your revenue model",
        useOfFunds: "How will you use the raised funds?",

        pitchVideoUrl: "YouTube / Vimeo link",
        teamSize: "Total team members",
        coFounders: "Names & roles of co-founders",
        experienceBackground: "Founder & team experience",
        gstNumber: "Enter GST number",
    };

    /* ---------------------------------------------------
       VALIDATION FOR EACH STEP
    --------------------------------------------------- */
    const validateStep = (step) => {
        let newErrors = {};

        if (step === 1) {
            if (!formData.startupName) newErrors.startupName = "Startup name is required";
            if (!formData.startupImage) newErrors.startupImage = "Startup image required";
            if (!formData.industry) newErrors.industry = "Industry required";
            if (!formData.foundedYear) newErrors.foundedYear = "Founded date required";
            if (!formData.startupLocation) newErrors.startupLocation = "Location required";
            if (!formData.startupDescription) newErrors.startupDescription = "Description required";
            if (!formData.problemStatement) newErrors.problemStatement = "Problem statement required";
            if (!formData.solutionOverview) newErrors.solutionOverview = "Solution overview required";
            if (!formData.targetMarket) newErrors.targetMarket = "Target market required";
        }

        if (step === 2) {
            if (!formData.valuation) newErrors.valuation = "Valuation is required";
            if (!formData.fundingRequirement) newErrors.fundingRequirement = "Funding requirement required";
            if (!formData.equityOffer) newErrors.equityOffer = "Equity offer required";
            if (!formData.fundingType || formData.fundingType.length === 0)
                newErrors.fundingType = "Select at least one funding type";
            if (!formData.existingInvestors) newErrors.existingInvestors = "Select Yes or No";
            if (!formData.businessModel) newErrors.businessModel = "Business model required";
        }
        if (step === 2) {
            if (!formData.valuation)
                newErrors.valuation = "Valuation is required";
            else if (Number(formData.valuation) < 50000)
                newErrors.valuation = "Valuation cannot be less than 50,000";

            if (!formData.fundingRequirement)
                newErrors.fundingRequirement = "Funding requirement required";
            else if (Number(formData.fundingRequirement) < 50000)
                newErrors.fundingRequirement = "Funding requirement cannot be less than 50,000";

            if (!formData.equityOffer)
                newErrors.equityOffer = "Equity offer required";
            else if (
                Number(formData.equityOffer) < 1 ||
                Number(formData.equityOffer) > 100
            )
                newErrors.equityOffer = "Equity must be between 1 and 100";
        }


        if (step === 3) {
            if (!formData.pitchDeckUrl) newErrors.pitchDeckUrl = "Pitch deck PDF required";
            if (!formData.productImageUrl) newErrors.productImageUrl = "Product image required";
            if (!formData.teamSize) newErrors.teamSize = "Team size required";
            if (!formData.coFounders) newErrors.coFounders = "Co-founder details needed";
            if (!formData.experienceBackground) newErrors.experienceBackground = "Experience required";
            if (!formData.gstNumber) newErrors.gstNumber = "GST number required";
            if (!formData.firmRegistration) newErrors.firmRegistration = "Registration PDF required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------------------------------------------
       GENERIC FILE UPLOAD
    --------------------------------------------------- */
    const uploadFile = async (e, fieldName, folder) => {
        const file = e.target.files[0];
        if (!file) return;

        const isPDF = file.type === "application/pdf";
        const isImage = file.type.startsWith("image/");

        if (!isPDF && !isImage) {
            toast.error("Only PDF or Image files allowed!");
            return;
        }

        const filePath = `${folder}/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from("Grow-up").upload(filePath, file);
        if (error) {
            console.error(error);
            toast.error("Upload failed!");
            return;
        }

        const { data: signedUrl } = await supabase.storage
            .from("Grow-up")
            .createSignedUrl(filePath, 60 * 60 * 24);

        setFormData({
            ...formData,
            [fieldName]: filePath,
            [fieldName + "Url"]: signedUrl.signedUrl,
        });
    };

    /* ---------------------------------------------------
       STARTUP IMAGE UPLOAD
    --------------------------------------------------- */
    const uploadStartupImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            toast.error("Only PNG/JPG allowed!");
            return;
        }

        const filePath = `startup-images/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from("Grow-up").upload(filePath, file);
        if (error) {
            console.error(error);
            toast.error("Upload failed");
            return;
        }

        const { data: signedUrl } = await supabase.storage
            .from("Grow-up")
            .createSignedUrl(filePath, 60 * 60 * 24);

        setFormData({
            ...formData,
            startupImage: filePath,
            startupImageUrl: signedUrl.signedUrl,
        });
    };

    /* ---------------------------------------------------
       RENDER UI
    --------------------------------------------------- */
    const errorText = (msg) => (
        <p className="text-red-500 text-sm mt-1">{msg}</p>
    );

    return (
        <div className="max-w-3xl mx-auto p-8 rounded-xl shadow-lg transition-all text-white" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>
            <h2 className="text-2xl font-bold mb-6">Founder Registration</h2>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8">
                {steps.map((label, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                        <div className={`w-full h-1 rounded 
                            ${subStep >= index + 1 ? "bg-blue-400" : "bg-blue-900/30"}`} />
                        <span className={`mt-2 text-sm font-medium 
                            ${subStep === index + 1 ? "text-blue-300" : "text-gray-400"}`}>
                            Step {index + 1}
                        </span>
                        <p className="text-xs text-gray-500">{label}</p>
                    </div>
                ))}
            </div>

            {/* ###########################################################
               STEP 1 — STARTUP INFO
            ########################################################### */}
            {subStep === 1 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Startup Information</h3>

                    {/* Startup Name */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Startup Name</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.startupName}
                            value={formData.startupName}
                            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                        />

                        {errors.startupName && errorText(errors.startupName)}
                    </div>

                    {/* Startup Image */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Startup Logo</label>
                        <input type="file" accept="image/*" 
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:border-blue-400/50 transition-all"
                            onChange={uploadStartupImage} />
                        {errors.startupImage && errorText(errors.startupImage)}

                        {formData.startupImageUrl && (
                            <img src={formData.startupImageUrl} className="w-32 h-32 mt-3 rounded-lg border border-blue-400/30 object-cover" />
                        )}
                    </div>

                    {/* Tagline */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Tagline</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.tagline}
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        />
                    </div>

                    {/* Founded Date */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Founded (Date)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            value={formData.foundedYear}
                            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                        />
                        {errors.foundedYear && errorText(errors.foundedYear)}
                    </div>

                    {/* Industry */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Industry</label>
                        <p className="text-xs text-gray-400 mb-2">Click to select your startup's industry</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {INDUSTRIES.map((ind) => {
                                const isSelected = (formData.industry || "")
                                    .split(",").map(s => s.trim()).filter(Boolean).includes(ind);
                                return (
                                    <button
                                        type="button"
                                        key={ind}
                                        onClick={() => {
                                            const current = (formData.industry || "")
                                                .split(",").map(s => s.trim()).filter(Boolean);
                                            const updated = isSelected
                                                ? current.filter(i => i !== ind)
                                                : [...current, ind];
                                            setFormData({ ...formData, industry: updated.join(", ") });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            isSelected
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
                                        }`}
                                    >
                                        {isSelected ? "✓ " : ""}{ind}
                                    </button>
                                );
                            })}
                        </div>
                        {formData.industry && (
                            <p className="text-xs text-blue-300 mt-2">Selected: {formData.industry}</p>
                        )}
                        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Startup Location</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.startupLocation}
                            value={formData.startupLocation}
                            onChange={(e) => setFormData({ ...formData, startupLocation: e.target.value })}
                        />
                        {errors.startupLocation && errorText(errors.startupLocation)}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Pre Startup Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.startupDescription}
                            value={formData.startupDescription}
                            onChange={(e) => setFormData({ ...formData, startupDescription: e.target.value })}
                        />
                        {errors.startupDescription && errorText(errors.startupDescription)}
                    </div>

                    {/* Problem Statement */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Problem Statement</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.problemStatement}
                            value={formData.problemStatement}
                            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        />
                        {errors.problemStatement && errorText(errors.problemStatement)}
                    </div>

                    {/* Solution Overview */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Solution Overview</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.solutionOverview}
                            value={formData.solutionOverview}
                            onChange={(e) => setFormData({ ...formData, solutionOverview: e.target.value })}
                        />
                        {errors.solutionOverview && errorText(errors.solutionOverview)}
                    </div>

                    {/* Target Market */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Target Market</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.targetMarket}
                            value={formData.targetMarket}
                            onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                        />
                        {errors.targetMarket && errorText(errors.targetMarket)}
                    </div>

                    {/* {Founder Linkedin} */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Founder Linkedin</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.founderLinkedin}
                            value={formData.founderLinkedin}
                            onChange={(e) => setFormData({ ...formData, founderLinkedin: e.target.value })}
                        />
                        {errors.targetMarket && errorText(errors.founderLinkedin)}
                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="btn-outline" onClick={prevStep}>Back</button>
                        <button className="btn" onClick={goNext}>Continue →</button>
                    </div>
                </div>
            )}

            {/* ###########################################################
               STEP 2 — FINANCIAL INFO
            ########################################################### */}
            {subStep === 2 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Financial Information</h3>

                    {/* Valuation */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Valuation</label>
                        <input
                            type="number"
                            min="50000"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.valuation}
                            value={formData.valuation}
                            onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                        />
                        {errors.valuation && errorText(errors.valuation)}
                    </div>

                    {/* Funding Requirement */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Funding Requirement</label>
                        <input
                            type="number"
                            min="50000"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.fundingRequirement}
                            value={formData.fundingRequirement}
                            onChange={(e) => setFormData({ ...formData, fundingRequirement: e.target.value })}
                        />
                        {errors.fundingRequirement && errorText(errors.fundingRequirement)}
                    </div>

                    {/* Equity Offer */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Equity Offer (%)</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.equityOffer}
                            value={formData.equityOffer}
                            onChange={(e) => setFormData({ ...formData, equityOffer: e.target.value })}
                        />
                        {errors.equityOffer && errorText(errors.equityOffer)}
                    </div>

                    {/* Funding Type */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Funding Type</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {["Equity", "Debt", "Both"].map((type) => {
                                const isSelected = formData.fundingType?.includes(type);
                                return (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => {
                                            let updated = formData.fundingType || [];
                                            let final = isSelected
                                                ? updated.filter((t) => t !== type)
                                                : [...updated, type];
                                            setFormData({ ...formData, fundingType: final });
                                        }}
                                        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                                            isSelected
                                                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-blue-900/20 border-blue-400/30 text-blue-300 hover:border-blue-400/50"
                                        }`}
                                    >
                                        {isSelected ? "✓ " : ""}{type}
                                    </button>
                                );
                            })}
                        </div>
                        {errors.fundingType && errorText(errors.fundingType)}
                    </div>

                    {/* Existing Investors */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Raised Capital Before?</label>
                        <div className="flex gap-6 mt-1 ml-1">
                            {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="existingInvestors"
                                        className="w-5 h-5 border-2 transition-all cursor-pointer bg-blue-900/20 border-blue-400/30 text-blue-400"
                                        checked={formData.existingInvestors === opt}
                                        onChange={() => setFormData({ ...formData, existingInvestors: opt })}
                                    />
                                    <span className="text-sm text-blue-300 group-hover:text-blue-200">{opt}</span>
                                </label>
                            ))}
                        </div>
                        {errors.existingInvestors && errorText(errors.existingInvestors)}
                    </div>

                    {/* Business Model */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Business Model</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.businessModel}
                            value={formData.businessModel}
                            onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                        />
                        {errors.businessModel && errorText(errors.businessModel)}
                    </div>

                    {/* Use of Funds */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Use of Funds</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.useOfFunds}
                            value={formData.useOfFunds}
                            onChange={(e) => setFormData({ ...formData, useOfFunds: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="btn-outline" onClick={goBack}>Back</button>
                        <button className="btn" onClick={goNext}>Continue →</button>
                    </div>
                </div>
            )}

            {/* ###########################################################
               STEP 3 — LEGAL & FILES
            ########################################################### */}
            {subStep === 3 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Legal & Pitch Documentation</h3>

                    {/* Pitch Deck */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Pitch Deck (PDF)</label>
                        <input type="file" accept="application/pdf"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:border-blue-400/50 transition-all"
                            onChange={(e) => uploadFile(e, "pitchDeckUrl", "pitch-decks")}
                        />
                        {errors.pitchDeckUrl && errorText(errors.pitchDeckUrl)}

                        {formData.pitchDeckUrlUrl && (
                            <a href={formData.pitchDeckUrlUrl} target="_blank" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                                View Pitch Deck
                            </a>
                        )}
                    </div>

                    {/* Pitch Video */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Pitch Video URL</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.pitchVideoUrl}
                            value={formData.pitchVideoUrl}
                            onChange={(e) => setFormData({ ...formData, pitchVideoUrl: e.target.value })}
                        />
                    </div>

                    {/* Product Image */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Product Image</label>
                        <input type="file" accept="image/*"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:border-blue-400/50 transition-all"
                            onChange={(e) => uploadFile(e, "productImageUrl", "product-images")}
                        />
                        {errors.productImageUrl && errorText(errors.productImageUrl)}

                        {formData.productImageUrlUrl && (
                            <img src={formData.productImageUrlUrl} className="w-32 rounded-lg mt-3 border border-blue-400/30" />
                        )}
                    </div>

                    {/* Team Size */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Team Size</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.teamSize}
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        />
                        {errors.teamSize && errorText(errors.teamSize)}
                    </div>

                    {/* Co-founders */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Co-founder Details</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.coFounders}
                            value={formData.coFounders}
                            onChange={(e) => setFormData({ ...formData, coFounders: e.target.value })}
                        />
                        {errors.coFounders && errorText(errors.coFounders)}
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Experience Background</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none min-h-[100px]"
                            placeholder={placeholders.experienceBackground}
                            value={formData.experienceBackground}
                            onChange={(e) => setFormData({ ...formData, experienceBackground: e.target.value })}
                        />
                        {errors.experienceBackground && errorText(errors.experienceBackground)}
                    </div>

                    {/* GST */}
                    <div className="mb-4">
                        <label className="text-xs mb-1.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">GST Number</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            placeholder={placeholders.gstNumber}
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        />
                        {errors.gstNumber && errorText(errors.gstNumber)}
                    </div>

                    {/* Registration PDF */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Firm Registration (PDF)</label>
                        <input type="file" accept="application/pdf"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:border-blue-400/50 transition-all"
                            onChange={(e) => uploadFile(e, "firmRegistration", "registration-docs")}
                        />
                        {errors.firmRegistration && errorText(errors.firmRegistration)}

                        {formData.firmRegistrationUrl && (
                            <a href={formData.firmRegistrationUrl} target="_blank" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                                View Registration Document
                            </a>
                        )}
                    </div>

                    {/* Patent PDF */}
                    <div className="mb-4">
                        <label className="text-xs mb-2.5 block ml-1 font-bold uppercase tracking-wider text-blue-300">Patent Details (PDF) — Optional</label>
                        <input type="file" accept="application/pdf"
                            className="w-full px-4 py-2 rounded-lg border bg-blue-900/30 border-blue-400/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:cursor-pointer hover:border-blue-400/50 transition-all"
                            onChange={(e) => uploadFile(e, "patentDetails", "patent-docs")}
                        />
                        {errors.patentDetails && errorText(errors.patentDetails)}

                        {formData.patentDetails && (
                            <a
                                href={formData.patentDetails}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                            >
                                View Patent Document
                            </a>
                        )}

                    </div>

                    <div className="flex justify-between mt-6">
                        <button className="btn-outline" onClick={goBack}>Back</button>
                        <button className="btn" onClick={nextStep}>Continue →</button>
                    </div>
                </div>
            )}
        </div>
    );
}
