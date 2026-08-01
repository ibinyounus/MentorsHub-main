const express = require("express");
const router = express.Router();
const paymentController = require("./payment.controller");

router.post("/", paymentController.addPayment);
router.get("/history", paymentController.getPaymentHistory);
router.get("/summary", paymentController.getPaymentSummary);

module.exports = router;
