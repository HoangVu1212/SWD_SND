const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const bookingCtrl = require("../controllers/bookingController");

router.post("/", auth(["customer"]), bookingCtrl.createBooking);
router.patch("/:id/cancel", auth(["customer"]), bookingCtrl.cancelBooking);
router.get("/", auth(), bookingCtrl.getAllBookings);
router.get("/bydate", auth(["admin"]), bookingCtrl.getBookingsByDate);

module.exports = router;
