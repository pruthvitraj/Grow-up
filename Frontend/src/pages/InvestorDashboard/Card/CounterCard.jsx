import React, { useEffect, useState } from "react";

export function CounterCard({ icon, label, target, prefix = "", suffix = "" }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 
            rounded-xl p-6 flex flex-col items-center text-center"
        >
            {icon}

            <h4 className="mt-4 text-2xl font-bold dark:text-white">
                {prefix}{count.toLocaleString()}{suffix}
            </h4>

            <p className="text-gray-600 dark:text-gray-300">{label}</p>
        </div>
    );
}
