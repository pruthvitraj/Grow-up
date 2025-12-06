import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

export default function Login() {

    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/login", {
                email,
                password
            });

            const data = res.data;

            console.log("LOGIN RESPONSE:", data);

            // Save token + user in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("role", data.user.role);



            alert("Login successful!");

            // Redirect based on role
            if (data.user.role === "investor") {
                navigate("/invester");
            } else if (data.user.role === "founder") {
                navigate("/founder");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.error(err);

            if (err.response?.status === 404) {
                alert("No account found with this email.");
            } else if (err.response?.status === 401) {
                alert("Incorrect password.");
            } else {
                alert("Login failed. Try again later.");
            }
        }

        setLoading(false);
    };


    const wrapperBg = theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900"
        : "bg-gradient-to-br from-[#001528] via-[#00214d] to-[#031b36] text-white";

    const cardBg = theme === "light"
        ? "bg-white border border-gray-200 shadow-xl"
        : "bg-[#062042]/70 border border-blue-800/20 shadow-xl shadow-blue-900/40";

    const inputClasses = theme === "light"
        ? "w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800"
        : "w-full px-4 py-2 rounded-lg bg-blue-900/40 border border-blue-700/40 text-gray-200";

    const mutedText = theme === "light" ? "text-gray-600" : "text-gray-300";

    return (
        <div className={`min-h-screen w-full flex items-center justify-center px-6 py-16 ${wrapperBg}`}>
            <div className={`w-full max-w-md backdrop-blur-xl rounded-2xl p-8 ${cardBg}`}>

                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className={`${mutedText} text-center mb-6`}>Login to your account</p>

                <label className={`block mb-1 mt-3 ${mutedText}`}>Email</label>
                <input
                    type="email"
                    className={inputClasses}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className={`block mb-1 mt-3 ${mutedText}`}>Password</label>
                <input
                    type="password"
                    className={inputClasses}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex justify-end mt-2">
                    <button className="text-teal-500 text-sm hover:underline">
                        Forgot Password?
                    </button>
                </div>

                <button
                    className="w-full mt-6 px-6 py-2 rounded-full font-semibold text-white 
                    bg-gradient-to-r from-blue-500 to-teal-400 
                    hover:shadow-lg hover:shadow-teal-500/40 transition-all"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-[1px] bg-gray-400/60"></div>
                    <span className={`${mutedText} text-sm`}>or</span>
                    <div className="flex-1 h-[1px] bg-gray-400/60"></div>
                </div>

                <button
                    className="w-full px-6 py-2 rounded-full font-semibold text-gray-900 
                    bg-white hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                    <img
                        src="https://www.gstatic.com/images/branding/product/1x/googlelogo_light_color_24dp.png"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Continue with Google
                </button>

                <p className={`text-center mt-6 text-sm ${mutedText}`}>
                    Don't have an account?{" "}
                    <a className="text-teal-500 hover:underline cursor-pointer" href="/register">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}
