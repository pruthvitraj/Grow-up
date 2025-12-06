import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { supabase } from "../../utils/supabaseClient";

export default function InvestorForm({ formData, setFormData, nextStep, prevStep }) {
    const [subStep, setSubStep] = useState(1);
    const [errors, setErrors] = useState({});
    const { theme } = useContext(ThemeContext);

    const goNext = () => setSubStep((prev) => prev + 1);
    const goBack = () => setSubStep((prev) => prev - 1);

    const steps = ["Professional", "Financial", "Preferences"];

    /* ======================================================
       VALIDATION HANDLERS FOR EACH STEP
    ====================================================== */
    const validateStep1 = () => {
        let err = {};

        if (!formData.jobStatus?.trim()) err.jobStatus = "Job status is required";
        if (!formData.investorLocation?.trim()) err.investorLocation = "Location is required";
        if (!formData.investmentRange?.trim()) err.investmentRange = "Investment range is required";

        if (!formData.investmentType || formData.investmentType.length === 0)
            err.investmentType = "Select at least one investment type";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateStep2 = () => {
        let err = {};

        if (!formData.pan) err.pan = "PAN PDF upload required";
        if (!formData.kycId) err.kycId = "KYC document required";

        // Proof of funds = optional

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const validateStep3 = () => {
        let err = {};

        if (!formData.acceptTerms) err.acceptTerms = "You must accept the terms.";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleNext = () => {
        if (subStep === 1 && !validateStep1()) return;
        if (subStep === 2 && !validateStep2()) return;
        if (subStep === 3 && !validateStep3()) return;

        nextStep();
    };

    /* ======================================================
       SUPABASE PDF UPLOAD
    ====================================================== */
    const uploadPdf = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files allowed!");
            return;
        }

        const filePath = `investor-docs/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("Grow-up")
            .upload(filePath, file);

        if (error) {
            console.error("UPLOAD ERROR:", error);
            alert("Upload failed!");
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

                    {[
                        "jobStatus",
                        "investorLocation",
                        "investmentInterest",
                        "investmentActiveness",
                        "investmentRange",
                        "investorLinkedin",
                    ].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block mb-1 font-medium capitalize">
                                {field.replace(/([A-Z])/g, " $1")}
                            </label>

                            <input
                                className={`w-full px-4 py-2 rounded-lg border ${theme === "dark"
                                    ? "bg-[#1e293b] border-gray-700 text-white"
                                    : "bg-gray-100 border-gray-300"
                                    }`}
                                value={formData[field] || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, [field]: e.target.value })
                                }
                            />

                            {errors[field] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                            )}
                        </div>
                    ))}

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
