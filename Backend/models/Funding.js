const mongoose = require("mongoose");

const fundingSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deal",
    required: true
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  founderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  proofDocument: {
    type: String // URL to the uploaded document
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  interest: {
    type: String
  },
  term: {
    type: String
  },
  requestNo: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Pre-save hook to generate a Request Number (e.g., BON-0451)
fundingSchema.pre('save', async function() {
    if (!this.requestNo) {
        try {
            const count = await this.constructor.countDocuments();
            this.requestNo = `BON-${(count + 1).toString().padStart(4, '0')}`;
        } catch (error) {
            console.error("Error in pre-save hook:", error);
            throw error;
        }
    }
});

module.exports = mongoose.model("Funding", fundingSchema);
