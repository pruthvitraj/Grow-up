const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fundingController = require("../controllers/fundingController");

router.post("/create", auth, fundingController.createFunding);
router.get("/", auth, fundingController.getFundings);
router.put("/:id/status", auth, fundingController.updateFundingStatus);

module.exports = router;
