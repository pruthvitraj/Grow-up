import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { supabase } from "../../utils/supabaseClient";

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
            alert("Only PDF or Image files allowed!");
            return;
        }

        const filePath = `${folder}/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from("Grow-up").upload(filePath, file);
        if (error) {
            console.error(error);
            alert("Upload failed!");
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
            alert("Only PNG/JPG allowed!");
            return;
        }

        const filePath = `startup-images/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from("Grow-up").upload(filePath, file);
        if (error) {
            console.error(error);
            alert("Upload failed");
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
        <div
            className={`max-w-3xl mx-auto p-8 rounded-xl shadow-lg transition-all 
            ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}
        >
            <h2 className="text-2xl font-bold mb-6">Founder Registration</h2>

            {/* Progress Bar */}
            <div className="flex justify-between mb-8">
                {steps.map((label, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                        <div className={`w-full h-1 rounded 
                            ${subStep >= index + 1 ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-700"}`} />
                        <span className={`mt-2 text-sm font-medium 
                            ${subStep === index + 1 ? "text-indigo-500" : "text-gray-500"}`}>
                            Step {index + 1}
                        </span>
                        <p className="text-xs">{label}</p>
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
                        <label>Startup Name</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.startupName}
                            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                        />
                        {errors.startupName && errorText(errors.startupName)}
                    </div>

                    {/* Startup Image */}
                    <div className="mb-4">
                        <label>Startup Logo</label>
                        <input type="file" accept="image/*" onChange={uploadStartupImage} />
                        {errors.startupImage && errorText(errors.startupImage)}

                        {formData.startupImageUrl && (
                            <img src={formData.startupImageUrl} className="w-32 h-32 mt-3 rounded-lg" />
                        )}
                    </div>

                    {/* Tagline */}
                    <div className="mb-4">
                        <label>Tagline</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border  "
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        />
                    </div>

                    {/* Founded Date */}
                    <div className="mb-4">
                        <label>Founded (Date)</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.foundedYear}
                            onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                        />
                        {errors.foundedYear && errorText(errors.foundedYear)}
                    </div>

                    {/* Industry */}
                    <div className="mb-4">
                        <label>Industry</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        />
                        {errors.industry && errorText(errors.industry)}
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label>Startup Location</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.startupLocation}
                            onChange={(e) => setFormData({ ...formData, startupLocation: e.target.value })}
                        />
                        {errors.startupLocation && errorText(errors.startupLocation)}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label>Pre Startup Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.startupDescription}
                            onChange={(e) => setFormData({ ...formData, startupDescription: e.target.value })}
                        />
                        {errors.startupDescription && errorText(errors.startupDescription)}
                    </div>

                    {/* Problem Statement */}
                    <div className="mb-4">
                        <label>Problem Statement</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border  "
                            value={formData.problemStatement}
                            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        />
                        {errors.problemStatement && errorText(errors.problemStatement)}
                    </div>

                    {/* Solution Overview */}
                    <div className="mb-4">
                        <label>Solution Overview</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border  "
                            value={formData.solutionOverview}
                            onChange={(e) => setFormData({ ...formData, solutionOverview: e.target.value })}
                        />
                        {errors.solutionOverview && errorText(errors.solutionOverview)}
                    </div>

                    {/* Target Market */}
                    <div className="mb-4">
                        <label>Target Market</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.targetMarket}
                            onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                        />
                        {errors.targetMarket && errorText(errors.targetMarket)}
                    </div>

                    {/* {Founder Linkedin} */}
                    <div className="mb-4">
                        <label>Founder Linkedin</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border "
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
                        <label>Valuation</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.valuation}
                            onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                        />
                        {errors.valuation && errorText(errors.valuation)}
                    </div>

                    {/* Funding Requirement */}
                    <div className="mb-4">
                        <label>Funding Requirement</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border  "
                            value={formData.fundingRequirement}
                            onChange={(e) => setFormData({ ...formData, fundingRequirement: e.target.value })}
                        />
                        {errors.fundingRequirement && errorText(errors.fundingRequirement)}
                    </div>

                    {/* Equity Offer */}
                    <div className="mb-4">
                        <label>Equity Offer (%)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border  "
                            value={formData.equityOffer}
                            onChange={(e) => setFormData({ ...formData, equityOffer: e.target.value })}
                        />
                        {errors.equityOffer && errorText(errors.equityOffer)}
                    </div>

                    {/* Funding Type */}
                    <div className="mb-4">
                        <label className="block mb-2">Funding Type</label>
                        {["Equity", "Debt", "Both"].map((type) => (
                            <div key={type} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.fundingType?.includes(type)}
                                    onChange={(e) => {
                                        let updated = formData.fundingType || [];
                                        let final = e.target.checked
                                            ? [...updated, type]
                                            : updated.filter((t) => t !== type);

                                        setFormData({ ...formData, fundingType: final });
                                    }}
                                />
                                <label>{type}</label>
                            </div>
                        ))}
                        {errors.fundingType && errorText(errors.fundingType)}
                    </div>

                    {/* Existing Investors */}
                    <div className="mb-4">
                        <label>Existing Investors</label>
                        <div>
                            {["Yes", "No"].map((opt) => (
                                <label key={opt} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="existingInvestors"
                                        checked={formData.existingInvestors === opt}
                                        onChange={() => setFormData({ ...formData, existingInvestors: opt })}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        {errors.existingInvestors && errorText(errors.existingInvestors)}
                    </div>

                    {/* Business Model */}
                    <div className="mb-4">
                        <label>Business Model</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border "
                            value={formData.businessModel}
                            onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                        />
                        {errors.businessModel && errorText(errors.businessModel)}
                    </div>

                    {/* Use of Funds */}
                    <div className="mb-4">
                        <label>Use of Funds</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border "
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
                        <label>Pitch Deck (PDF)</label>
                        <input type="file" accept="application/pdf"
                            onChange={(e) => uploadFile(e, "pitchDeckUrl", "pitch-decks")}
                        />
                        {errors.pitchDeckUrl && errorText(errors.pitchDeckUrl)}

                        {formData.pitchDeckUrlUrl && (
                            <a href={formData.pitchDeckUrlUrl} target="_blank" className="text-blue-500">
                                View Pitch Deck
                            </a>
                        )}
                    </div>

                    {/* Pitch Video */}
                    <div className="mb-4">
                        <label>Pitch Video URL</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.pitchVideoUrl}
                            onChange={(e) => setFormData({ ...formData, pitchVideoUrl: e.target.value })}
                        />
                    </div>

                    {/* Product Image */}
                    <div className="mb-4">
                        <label>Product Image</label>
                        <input type="file" accept="image/*"
                            onChange={(e) => uploadFile(e, "productImageUrl", "product-images")}
                        />
                        {errors.productImageUrl && errorText(errors.productImageUrl)}

                        {formData.productImageUrlUrl && (
                            <img src={formData.productImageUrlUrl} className="w-32 rounded mt-2" />
                        )}
                    </div>

                    {/* Team Size */}
                    <div className="mb-4">
                        <label>Team Size</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        />
                        {errors.teamSize && errorText(errors.teamSize)}
                    </div>

                    {/* Co-founders */}
                    <div className="mb-4">
                        <label>Co-founder Details</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border min-h-[100px]"
                            value={formData.coFounders}
                            onChange={(e) => setFormData({ ...formData, coFounders: e.target.value })}
                        />
                        {errors.coFounders && errorText(errors.coFounders)}
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                        <label>Experience Background</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border min-h-[100px]"
                            value={formData.experienceBackground}
                            onChange={(e) => setFormData({ ...formData, experienceBackground: e.target.value })}
                        />
                        {errors.experienceBackground && errorText(errors.experienceBackground)}
                    </div>

                    {/* GST */}
                    <div className="mb-4">
                        <label>GST Number</label>
                        <input
                            className="w-full px-4 py-2 rounded-lg border"
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        />
                        {errors.gstNumber && errorText(errors.gstNumber)}
                    </div>

                    {/* Registration PDF */}
                    <div className="mb-4">
                        <label>Firm Registration (PDF)</label>
                        <input type="file" accept="application/pdf"
                            onChange={(e) => uploadFile(e, "firmRegistration", "registration-docs")}
                        />
                        {errors.firmRegistration && errorText(errors.firmRegistration)}

                        {formData.firmRegistrationUrl && (
                            <a href={formData.firmRegistrationUrl} target="_blank" className="text-blue-500">
                                View Registration Document
                            </a>
                        )}
                    </div>

                    {/* Patent PDF */}
                    <div className="mb-4">
                        <label>Patent Details (PDF) — Optional</label>
                        <input type="file" accept="application/pdf"
                            onChange={(e) => uploadFile(e, "patentDetails", "patent-docs")}
                        />
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
