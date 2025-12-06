import React, { useState } from "react";
import axios from "axios";

import BasicInfo from "./BasicInfo";
import InvestorForm from "./InvestorForm";
import FounderForm from "./FounderForm";
import Review from "./Review";

export default function MultiStepRegister() {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        role: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        // Investor fields...
        jobStatus: "",
        investmentRange: "",
        investmentActiveness: "",
        investmentInterest: "",
        investorLocation: "",
        investmentType: "",
        pan: "",
        investorLinkedin: "",
        proofOfFunds: "",
        kycId: "",
        notificationPreference: "",
        communicationPreference: "",
        investmentGoal: "",
        investorBio: "",
        acceptTerms: false,
        // Founder fields...
        startupName: "",
        startupImage: "",
        tagline: "",
        industry: "",
        businessStage: "",
        startupDescription: "",
        problemStatement: "",
        solutionOverview: "",
        usp: "",
        targetMarket: "",
        founderLinkedin: "",
        foundedYear: "",
        startupLocation: "",
        valuation: "",
        fundingRequirement: "",
        equityOffer: "",
        fundingType: "",
        existingInvestors: "",
        businessModel: "",
        useOfFunds: "",
        pitchDeckUrl: "",
        pitchVideoUrl: "",
        productImageUrl: "",
        coFounders: "",
        teamSize: "",
        experienceBackground: "",
        advisors: "",
        businessRegType: "",
        gstNumber: "",
        firmRegistration: "",
        patentDetails: "",
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    /* ------------------------------------------------------------
       FINAL SUBMIT (ONLY RUNS AT STEP 5)
    ------------------------------------------------------------ */
    const handleSubmit = async () => {
        try {
            // 1️⃣ Register basic info
            const registerRes = await axios.post(
                "http://localhost:5000/api/register",
                {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                }
            );

            const token = registerRes.data.token;
            localStorage.setItem("token", token);

            // Set token to axios for all further requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // 2️⃣ Save role
            await axios.post(
                "http://localhost:5000/api/register/select-role",
                { role: formData.role }
            );

            // 3️⃣ Save INVESTOR profile
            if (formData.role === "investor") {
                await axios.post(
                    "http://localhost:5000/api/profile/investor",
                    {
                        jobStatus: formData.jobStatus,
                        investmentRange: formData.investmentRange,
                        investmentActiveness: formData.investmentActiveness,
                        investmentInterest: formData.investmentInterest,
                        investorLocation: formData.investorLocation,
                        investmentType: formData.investmentType,
                        pan: formData.pan,
                        investorLinkedin: formData.investorLinkedin,
                        proofOfFunds: formData.proofOfFunds,
                        kycId: formData.kycId,
                        notificationPreference: formData.notificationPreference,
                        communicationPreference: formData.communicationPreference,
                        investmentGoal: formData.investmentGoal,
                        investorBio: formData.investorBio,
                        acceptTerms: formData.acceptTerms,
                    }
                );
            }

            // 4️⃣ Save FOUNDER profile
            if (formData.role === "founder") {
                await axios.post(
                    "http://localhost:5000/api/profile/founder",
                    {
                        startupName: formData.startupName,
                        startupImage: formData.startupImage,
                        tagline: formData.tagline,
                        industry: formData.industry,
                        businessStage: formData.businessStage,
                        startupDescription: formData.startupDescription,
                        problemStatement: formData.problemStatement,
                        solutionOverview: formData.solutionOverview,
                        usp: formData.usp,
                        targetMarket: formData.targetMarket,
                        founderLinkedin: formData.founderLinkedin,
                        foundedYear: formData.foundedYear,
                        startupLocation: formData.startupLocation,
                        valuation: formData.valuation,
                        fundingRequirement: formData.fundingRequirement,
                        equityOffer: formData.equityOffer,
                        fundingType: formData.fundingType,
                        existingInvestors: formData.existingInvestors,
                        businessModel: formData.businessModel,
                        useOfFunds: formData.useOfFunds,
                        pitchDeckUrl: formData.pitchDeckUrl,
                        pitchVideoUrl: formData.pitchVideoUrl,
                        productImageUrl: formData.productImageUrl,
                        coFounders: formData.coFounders,
                        teamSize: formData.teamSize,
                        experienceBackground: formData.experienceBackground,
                        advisors: formData.advisors,
                        businessRegType: formData.businessRegType,
                        gstNumber: formData.gstNumber,
                        firmRegistration: formData.firmRegistration,
                        patentDetails: formData.patentDetails,
                    }
                );
            }

            alert("Registration complete! Your profile is under review.");
            window.location.href = "/";

        } catch (err) {
            console.error(err);
            alert("Submission failed. Check backend console.");
        }
    };

    return (
        <div className="register-container p-6 w-full">
            {/* STEP 1 */}
            {step === 1 && (
                <BasicInfo
                    formData={formData}
                    setFormData={setFormData}
                    nextStep={nextStep}
                />
            )}

            {/* STEP 2 - Investor */}
            {step === 2 && formData.role === "investor" && (
                <InvestorForm
                    formData={formData}
                    setFormData={setFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            )}

            {/* STEP 2 - Founder */}
            {step === 2 && formData.role === "founder" && (
                <FounderForm
                    formData={formData}
                    setFormData={setFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                />
            )}

            {/* STEP 3 - Review */}
            {step === 3 && (
                <Review
                    formData={formData}
                    prevStep={prevStep}
                    handleSubmit={handleSubmit}   // ✅ pass function here
                />
            )}

        </div>
    );
}
