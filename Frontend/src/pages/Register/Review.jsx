import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function Review({ formData, prevStep, handleSubmit }) {
    const { theme } = useContext(ThemeContext);

    // Reusable field rows
    const Row = ({ label, value }) =>
        value ? (
            <div className={`flex justify-between py-2 border-b 
                ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium`}>
                    {label}
                </span>
                <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} font-semibold`}>
                    {value}
                </span>
            </div>
        ) : null;

    const FileRow = ({ label, url }) =>
        url ? (
            <div className={`flex justify-between py-2 border-b 
                ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium`}>
                    {label}
                </span>
                <a
                    href={url}
                    target="_blank"
                    className="text-blue-500 underline font-semibold"
                >
                    View
                </a>
            </div>
        ) : null;

    const ImageRow = ({ label, url }) =>
        url ? (
            <div className={`py-4 border-b 
                ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
                <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-medium`}>
                    {label}
                </span>
                <img
                    src={url}
                    className="w-32 h-32 mt-2 rounded-lg object-cover border"
                />
            </div>
        ) : null;

    return (
        <div
            className={`max-w-3xl mx-auto p-8 rounded-xl shadow-xl transition-all duration-300
                ${theme === "dark"
                    ? "bg-[#0b1220] text-white shadow-gray-900"
                    : "bg-white text-gray-900 shadow-gray-300"
                }`}
        >
            <h2 className="text-3xl font-bold mb-6 text-center">Review Your Details</h2>

            {/* ------------------------------------------------------
                  COMMON USER INFO
            ------------------------------------------------------ */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Basic Information</h3>

                <div
                    className={`p-5 rounded-lg shadow-inner transition
                        ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
                >
                    <Row label="Full Name" value={formData.fullName} />
                    <Row label="Email" value={formData.email} />
                    <Row label="Phone" value={formData.phone} />
                    <Row label="Role" value={formData.role?.toUpperCase()} />
                </div>
            </section>

            {/* ------------------------------------------------------
                  INVESTOR REVIEW
            ------------------------------------------------------ */}
            {formData.role === "investor" && (
                <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Investor Information</h3>

                    <div
                        className={`p-5 rounded-lg shadow-inner transition
                            ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
                    >
                        <Row label="Job Status" value={formData.jobStatus} />
                        <Row label="Investment Range" value={formData.investmentRange} />
                        <Row label="Activeness" value={formData.investmentActiveness} />
                        <Row label="Interest" value={formData.investmentInterest} />
                        <Row label="Location" value={formData.investorLocation} />
                        <Row
                            label="Investment Type"
                            value={
                                Array.isArray(formData.investmentType)
                                    ? formData.investmentType.join(", ")
                                    : formData.investmentType
                            }
                        />
                        <FileRow label="PAN Card" url={formData.panUrl} />
                        <FileRow label="KYC Document" url={formData.kycIdUrl} />
                        <FileRow label="Proof of Funds" url={formData.proofOfFundsUrl} />
                        <Row label="Notification" value={formData.notificationPreference} />
                        <Row label="Communication" value={formData.communicationPreference} />
                    </div>
                </section>
            )}

            {/* ------------------------------------------------------
                  FOUNDER REVIEW
            ------------------------------------------------------ */}
            {formData.role === "founder" && (
                <section>
                    <h3 className="text-xl font-semibold mb-3">Founder / Startup Details</h3>

                    <div
                        className={`p-5 rounded-lg shadow-inner transition
                            ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
                    >
                        <Row label="Startup Name" value={formData.startupName} />
                        <ImageRow label="Startup Logo" url={formData.startupImageUrl} />
                        <Row label="Tagline" value={formData.tagline} />
                        <Row label="Founded Year" value={formData.foundedYear} />
                        <Row label="Industry" value={formData.industry} />
                        <Row label="Location" value={formData.startupLocation} />
                        <Row label="Description" value={formData.startupDescription} />
                        <Row label="Problem" value={formData.problemStatement} />
                        <Row label="Solution" value={formData.solutionOverview} />
                        <Row label="Target Market" value={formData.targetMarket} />

                        <h4 className="text-lg font-semibold mt-5">Funding</h4>
                        <Row label="Valuation" value={formData.valuation} />
                        <Row label="Funding Need" value={formData.fundingRequirement} />
                        <Row label="Equity Offer" value={formData.equityOffer} />
                        <Row
                            label="Funding Type"
                            value={
                                Array.isArray(formData.fundingType)
                                    ? formData.fundingType.join(", ")
                                    : formData.fundingType
                            }
                        />
                        <Row label="Existing Investors" value={formData.existingInvestors} />
                        <Row label="Business Model" value={formData.businessModel} />
                        <Row label="Use of Funds" value={formData.useOfFunds} />

                        <h4 className="text-lg font-semibold mt-5">Documents</h4>
                        <FileRow label="Pitch Deck" url={formData.pitchDeckUrlUrl} />
                        <ImageRow label="Product Image" url={formData.productImageUrlUrl} />
                        <FileRow label="Firm Registration" url={formData.firmRegistrationUrl} />
                        <FileRow label="Patent Document" url={formData.patentDetailsUrl} />

                        <h4 className="text-lg font-semibold mt-5">Team</h4>
                        <Row label="Team Size" value={formData.teamSize} />
                        <Row label="Co-founders" value={formData.coFounders} />
                        <Row label="Experience" value={formData.experienceBackground} />
                        <Row label="Founder LinkedIn" value={formData.founderLinkedin} />

                        <Row label="GST Number" value={formData.gstNumber} />
                    </div>
                </section>
            )}

            {/* ------------------------------------------------------
                  BUTTONS
            ------------------------------------------------------ */}
            <div className="flex justify-between mt-10">
                <button
                    className={`px-6 py-2 rounded-full font-semibold transition-all 
                    ${theme === "dark"
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-300 hover:bg-gray-400 text-black"
                        }`}
                    onClick={prevStep}
                >
                    ← Back
                </button>

                <button
                    className={`px-6 py-2 rounded-full font-semibold text-white transition-all
                    bg-gradient-to-r from-blue-500 to-teal-400 
                    hover:shadow-xl hover:shadow-teal-500/40`}
                    onClick={handleSubmit}
                >
                    Submit & Finish ✓
                </button>
            </div>
        </div>
    );
}
