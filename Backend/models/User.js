const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,

        role: {
            type: String,
            enum: ["investor", "founder", "admin"],
            default: null // ✅ NOT required at registration
        },
        meetingLink: {
            type: String,
            default: ""
        },

        isProfileComplete: { type: Boolean, default: false },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        // ✅ Accepted connections
        connections: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                status: {
                    type: String,
                    enum: ["active", "completed"],
                    default: "active"
                },
                connectedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        // ✅ Incoming requests
        receivedRequests: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                requestedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],

        // ✅ Outgoing requests (THIS is what you're missing)
        sentRequests: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                requestedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        watchlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    // ✅ Watchlist (saved users / startups)


    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
