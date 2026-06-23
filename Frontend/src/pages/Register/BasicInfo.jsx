import React, { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";

export default function BasicInfo({ formData, setFormData, nextStep }) {
    const { theme } = useContext(ThemeContext);

    const [errors, setErrors] = useState({}); // ❗ error state

    /* ------------------------------------------
       VALIDATION FUNCTION
    -------------------------------------------*/
    const validateFields = () => {
        let newErrors = {};

        if (!formData.role) newErrors.role = "Please select a role";

        if (!formData.fullName.trim())
            newErrors.fullName = "Full name is required";

        if (!formData.email)
            newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Enter a valid email";

        if (!formData.phone)
            newErrors.phone = "Phone number is required";
        else if (formData.phone.length !== 10)
            newErrors.phone = "Phone must be exactly 10 digits";

        if (!formData.password)
            newErrors.password = "Password is required";
        else if (formData.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // valid if no errors
    };

    /* ------------------------------------------
       HANDLE NEXT STEP
    -------------------------------------------*/
    const handleNext = () => {
        if (validateFields()) {
            nextStep();
        }
    };
    const placeholders = {
        fullName: "Enter your full name",
        email: "Enter your email address",
        phone: "Enter 10-digit phone number",
        password: "Create a password",
    };


    return (
        <div
            className={`
                max-w-xl mx-auto p-8 rounded-xl shadow-lg transition-all duration-300
                ${theme === "light"
                    ? "bg-white text-gray-800"
                    : "bg-[#0b1320] text-gray-200 border border-gray-700"}
            `}
        >
            <h2 className="text-3xl font-extrabold mb-6 text-center">
                Basic Information
            </h2>

            {/* Role */}
            <label className="block mb-1 font-medium">Register As</label>
            <select
                name="role"
                className={`
                    w-full p-3 rounded-lg mb-1 outline-none
                    ${theme === "light"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-[#152238] text-white border border-gray-600"}
                `}
                value={formData.role}
                onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                }
            >
                <option value="">Select role</option>
                <option value="investor">Investor</option>
                <option value="founder">Founder</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}

            {/* Input Fields */}
            {["fullName", "email", "phone", "password"].map((field, i) => (
                <div key={i} className="mb-4">
                    <label className="block mb-1 font-medium capitalize">
                        {field}
                    </label>

                    <input
                        type={
                            field === "password"
                                ? "password"
                                : field === "phone"
                                    ? "text"
                                    : "text"
                        }
                        maxLength={field === "phone" ? 10 : undefined}
                        placeholder={placeholders[field]}   // ✅ ADD THIS LINE
                        className={`
        w-full p-3 rounded-lg outline-none
        placeholder-gray-400
        ${theme === "light"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-[#152238] text-white border border-gray-600 placeholder-gray-500"}
    `}
                        value={formData[field] || ""}
                        onChange={(e) => {
                            if (field === "phone") {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                return setFormData({ ...formData, phone: val });
                            }
                            setFormData({ ...formData, [field]: e.target.value });
                        }}
                    />


                    {/* Error Message */}
                    {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                    )}
                </div>
            ))}

            {/* Next Button */}
            <button
                onClick={handleNext}
                className={`
                    w-full mt-4 py-3 text-lg rounded-full font-semibold transition-all
                    ${theme === "light"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-green-400 text-black hover:bg-green-300"}
                `}
            >
                Save & Continue →
            </button>
        </div>
    );
}
