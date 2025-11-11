const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const eventCtrl = require("../controllers/eventController");

router.post("/", auth(["admin"]), eventCtrl.createEvent);
router.get("/", eventCtrl.getAllEvents);

module.exports = router;
