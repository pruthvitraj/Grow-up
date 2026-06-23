import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

export function CounterCard({ icon, label, target, prefix = "", suffix = "" }) {
    const [count, setCount] = useState(0);

    useEffect(() {
        let start = 0;
        const duration = 1200;
        const increment = target / (duration / 16);

        const step = () => {
            start += increment;
            if (start < target) {
                setCount(Math.ceil(start));
                requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(step);
    }, [target]);

    return (
        <div className="rounded-xl p-6 flex flex-col items-center text-center transition-colors border bg-blue-900/20 border-blue-400/30">
            {icon}

            <h4 className="mt-4 text-2xl font-bold text-white">
                {prefix}{count.toLocaleString()}{suffix}
            </h4>

            <p className="font-medium mt-1 text-gray-300">{label}</p>
        </div>
    );
}
