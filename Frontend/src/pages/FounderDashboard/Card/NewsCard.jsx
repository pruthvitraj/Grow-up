import React, { useState } from "react";

export function NewsCard({ img, title, excerpt, likes, comments }) {
    const [liked, setLiked] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <img src={img} alt="" className="h-48 w-full object-cover" />

            <div className="p-4 flex flex-col justify-between flex-1">

                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                        {excerpt}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
                    >
                        ❤️ <span className="text-sm">{likes + (liked ? 1 : 0)}</span>
                    </button>

                    <span className="text-sm flex items-center gap-1">
                        💬 {comments}
                    </span>
                </div>
            </div>
        </div>
    );
}
