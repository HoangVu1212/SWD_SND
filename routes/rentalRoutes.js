const express = require("express");
const router = express.Router();
const {
  searchRentalByDate,
  getRental,
  bookRental,
} = require("../controllers/rentalController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookRental);
router.get("/", verifyToken, getRental);
router.get("/search/date", verifyToken, searchRentalByDate);

module.exports = router;
