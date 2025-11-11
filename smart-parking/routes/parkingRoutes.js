const express = require("express");
const router = express.Router();
const {
  createParkingLot,
  getAllParkingLots,
} = require("../controllers/parkingController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

router.post("/", verifyToken, authorizeRole("admin"), createParkingLot);
router.get("/", verifyToken, getAllParkingLots);

module.exports = router;
