import React, { useEffect, useState } from "react";

export function CounterCard({ icon, label, target, prefix = "", suffix = "", index = 0 }) {
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

    const gradients = [
        { bg: 'linear-gradient(135deg, rgba(180, 100, 20, 0.6) 0%, rgba(220, 140, 40, 0.4) 100%)', border: 'rgba(220, 140, 40, 0.3)' },
        { bg: 'linear-gradient(135deg, rgba(100, 60, 140, 0.6) 0%, rgba(140, 80, 180, 0.4) 100%)', border: 'rgba(140, 80, 180, 0.3)' },
        { bg: 'linear-gradient(135deg, rgba(20, 80, 160, 0.6) 0%, rgba(40, 120, 200, 0.4) 100%)', border: 'rgba(40, 120, 200, 0.3)' },
    ];

    const gradient = gradients[index % gradients.length];

    return (
        <div className="rounded-xl p-8 flex flex-col items-center text-center transition-colors border"
            style={{
                background: gradient.bg,
                borderColor: gradient.border,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
            {icon}

            <h4 className="mt-4 text-3xl font-black text-white">
                {prefix}{count.toLocaleString()}{suffix}
            </h4>

            <p className="font-semibold mt-2 text-gray-200">{label}</p>
        </div>
    );
}
