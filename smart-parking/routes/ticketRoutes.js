const express = require("express");
const router = express.Router();
const {
  bookTicket,
  endTicket,
  getTickets,
  searchTicketsByDate,
} = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookTicket);
router.patch("/:id/end", verifyToken, endTicket);
router.get("/", verifyToken, getTickets);
router.get("/search/date", verifyToken, searchTicketsByDate);

module.exports = router;
