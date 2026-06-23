import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export function NewsCard({ img, title, excerpt, likes, comments }) {
    const [liked, setLiked] = useState(false);
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";

    return (
        <div className={`rounded-2xl shadow-lg border overflow-hidden flex flex-col transition-colors ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}>
            <img src={img} alt="" className="h-48 w-full object-cover" />

            <div className="p-4 flex flex-col justify-between flex-1">

                <div>
                    <h4 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{title}</h4>
                    <p className={`text-sm mt-2 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
                        {excerpt}
                    </p>
                </div>

                <div className={`mt-4 flex items-center justify-between ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-1 transition-colors ${liked ? "text-rose-500 hover:text-rose-600" : "hover:text-rose-400"}`}
                    >
                        ❤️ <span className="text-sm font-bold">{likes + (liked ? 1 : 0)}</span>
                    </button>

                    <span className="text-sm flex items-center gap-1 font-bold">
                        💬 {comments}
                    </span>
                </div>
            </div>
        </div>
    );
}
