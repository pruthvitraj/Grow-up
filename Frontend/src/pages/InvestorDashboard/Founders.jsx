import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Founders() {
    const [founders, setFounders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [domain, setDomain] = useState("");
    const [location, setLocation] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadFounders = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/profile/founder/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setFounders(res.data);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        loadFounders();
    }, []);

    // Send Connection Request
    const handleConnect = async (founderId) => {
        try {
            await axios.post(
                "http://localhost:5000/api/profile/founder/list",
                { founderId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Connection request sent");
        } catch (err) {
            console.error(err);
            alert("Failed to send request");
        }
    };

    if (loading)
        return <div className="p-6 text-xl text-center">Loading founders...</div>;

    // Apply filters
    const filtered = founders.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) &&
        (domain ? f.domain === domain : true) &&
        (location ? f.location === location : true)
    );

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <h1 className="text-3xl font-bold mb-6">Founders</h1>

            {/* Filters Section */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">

                <input
                    type="text"
                    placeholder="Search by name..."
                    className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                >
                    <option value="">All Domains</option>
                    <option value="AI">AI</option>
                    <option value="FinTech">FinTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="GreenTech">GreenTech</option>
                </select>

                <select
                    className="p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">All Locations</option>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Dubai">Dubai</option>
                </select>
            </div>

            {/* Founder Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((founder) => (
                    <div
                        key={founder._id}
                        className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow"
                    >
                        <img
                            src={founder.profileImg || "https://via.placeholder.com/100"}
                            className="w-full h-40 rounded-xl object-cover"
                        />

                        <h2 className="text-lg font-bold mt-3">{founder.name}</h2>
                        <p className="text-sm text-gray-500">{founder.domain}</p>
                        <p className="text-sm text-gray-500">{founder.location}</p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => alert("Open founder profile")}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white w-full"
                            >
                                View
                            </button>

                            <button
                                onClick={() => handleConnect(founder._id)}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white w-full"
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
