const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const dealController = require("../controllers/dealController");

router.post("/create", auth, dealController.createDeal);
router.get("/", auth, dealController.getDeals);
router.get("/:id", auth, dealController.getDealById);
router.put("/:id/status", auth, dealController.updateDealStatus);

module.exports = router;
