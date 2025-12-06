import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const BackIcon = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M19 12H5" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default function InvestorProfilePage() {
    const { theme } = useContext(ThemeContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    /* Fetch profile */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/profile/investor/${userId}`,
                    // `http://localhost:5000/api/profile/founder/list`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log(res.data);
                setProfile(res.data);
            } catch (err) {
                console.error("Profile load failed:", err);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.put(
                "http://localhost:5000/api/profile/investor/update",
                { ...profile, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Profile submitted for review. Your account is now under review.");
            setShowConfirm(false);

            user.user.status = "pending";
            localStorage.setItem("user", JSON.stringify(user));

        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
    if (!profile) return <div className="text-center py-20 text-xl">No profile found.</div>;

    const inputClass =
        "w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600";

    const selectClass =
        "w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600";

    const checkboxClass = "mr-2";

    const investmentTypes = ["Equity", "Debt", "SAFE", "Convertible Note"];

    return (
        <div
            className={`min-h-screen p-6 ${theme === "dark" ? "bg-[#071025] text-white" : "bg-gray-100 text-gray-900"
                }`}
        >
            {/* HEADER */}
            <div className="max-w-4xl mx-auto flex items-center justify-between mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 rounded-lg shadow bg-white dark:bg-gray-800 flex items-center gap-2"
                >
                    <BackIcon /> Back
                </button>
                <h1 className="text-3xl font-bold">Edit Investor Profile</h1>
            </div>

            {/* FORM */}
            <div className="max-w-4xl mx-auto space-y-8">

                {/* BASIC INFO */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                    <label>Full Name</label>
                    <input
                        className={inputClass}
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    />

                    <label className="mt-3 block">Email</label>
                    <input
                        className={inputClass}
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />

                    <label className="mt-3 block">Phone</label>
                    <input
                        className={inputClass}
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                </div>

                {/* PROFESSIONAL */}

                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
                    <h2 className="text-xl font-semibold mb-4">Professional Details</h2>

                    <label>Job Status</label>
                    <input
                        className={inputClass}
                        value={profile.jobStatus}
                        onChange={(e) => setProfile({ ...profile, jobStatus: e.target.value })}
                    />

                    <label className="mt-3 block">Investment Range</label>
                    <input
                        className={inputClass}
                        value={profile.investmentRange}
                        onChange={(e) => setProfile({ ...profile, investmentRange: e.target.value })}
                    />

                    <label className="mt-3 block">Activeness</label>
                    <input
                        className={inputClass}
                        value={profile.investmentActiveness}
                        onChange={(e) =>
                            setProfile({ ...profile, investmentActiveness: e.target.value })
                        }
                    />

                    <label className="mt-3 block">Investment Interest</label>
                    <input
                        className={inputClass}
                        value={profile.investmentInterest}
                        onChange={(e) =>
                            setProfile({ ...profile, investmentInterest: e.target.value })
                        }
                    />

                    <label className="mt-3 block">Location</label>
                    <input
                        className={inputClass}
                        value={profile.investorLocation}
                        onChange={(e) =>
                            setProfile({ ...profile, investorLocation: e.target.value })
                        }
                    />
                    <label className="mt-3 block">LinkedIn</label>
                    <input
                        className={inputClass}
                        value={profile.investorLinkedin}
                        onChange={(e) => setProfile({ ...profile, investorLinkedin: e.target.value })}
                    />
                    {/* MULTI SELECT: Investment Type */}
                    <label className="mt-3 block">Investment Type</label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {investmentTypes.map((type) => (
                            <label key={type} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className={checkboxClass}
                                    checked={profile.investmentType.includes(type)}
                                    onChange={(e) => {
                                        const newTypes = e.target.checked
                                            ? [...profile.investmentType, type]
                                            : profile.investmentType.filter((t) => t !== type);

                                        setProfile({ ...profile, investmentType: newTypes });
                                    }}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {/* FINANCIAL SECTION */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
                    <h2 className="text-xl font-semibold mb-4">Financial Verification</h2>

                    <label>PAN</label>
                    <input
                        className={inputClass}
                        value={profile.pan}
                        onChange={(e) => setProfile({ ...profile, pan: e.target.value })}
                    />



                    <label className="mt-3 block">Proof of Funds</label>
                    <input
                        className={inputClass}
                        value={profile.proofOfFunds}
                        onChange={(e) => setProfile({ ...profile, proofOfFunds: e.target.value })}
                    />

                    <label className="mt-3 block">KYC ID</label>
                    <input
                        className={inputClass}
                        value={profile.kycId}
                        onChange={(e) => setProfile({ ...profile, kycId: e.target.value })}
                    />
                </div>

                {/* PREFERENCES */}
                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
                    <h2 className="text-xl font-semibold mb-4">Preferences</h2>

                    <label>Notification Preference</label>
                    <select
                        className={selectClass}
                        value={profile.notificationPreference}
                        onChange={(e) =>
                            setProfile({ ...profile, notificationPreference: e.target.value })
                        }
                    >
                        <option value="sms">SMS</option>
                        <option value="email">Email</option>
                    </select>

                    <label className="mt-3 block">Communication Preference</label>
                    <select
                        className={selectClass}
                        value={profile.communicationPreference}
                        onChange={(e) =>
                            setProfile({ ...profile, communicationPreference: e.target.value })
                        }
                    >
                        <option value="webMeeting">Web Meeting</option>
                        <option value="chatbox">Chatbox</option>
                    </select>

                    <label className="mt-3 block flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={profile.acceptTerms}
                            onChange={(e) => setProfile({ ...profile, acceptTerms: e.target.checked })}
                        />
                        Accept Terms & Conditions
                    </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-lg font-semibold"
                >
                    Save Changes
                </button>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow max-w-md w-full">
                        <h2 className="text-xl font-bold mb-3">Submit for Review?</h2>
                        <p className="mb-6">
                            Your profile changes will be reviewed by admin.
                            Your account status will change to <b>Pending</b>.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded bg-indigo-600 text-white"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
