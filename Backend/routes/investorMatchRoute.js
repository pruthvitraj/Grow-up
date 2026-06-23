// routes/investorMatchRoute.js
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/investor/ai-matches
// Returns approved founders sorted by AI match score (descending)
// for the currently logged-in investor.
// ─────────────────────────────────────────────────────────────────────────────
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { getBestFoundersForInvestor } = require('../services/matchingService');

// GET /api/investor/ai-matches
router.get('/ai-matches', auth, async (req, res) => {
    try {
        // Role guard
        if (req.user.role !== 'investor') {
            return res.status(403).json({ message: 'Access denied. Investors only.' });
        }

        const results = await getBestFoundersForInvestor(req.user._id);
        return res.status(200).json(results);

    } catch (error) {
        console.error('AI match error (investor):', error.message);
        return res.status(500).json({ message: 'Server error', detail: error.message });
    }
});

module.exports = router;
