const Ticket = require("../models/ticketModel");
const ParkingLot = require("../models/parkingLotModel");

// 📥 Đặt vé đỗ xe
exports.bookTicket = async (req, res) => {
  try {
    const { parkingLotId, startTime, durationHours } = req.body;
    const userId = req.user.id;

    const lot = await ParkingLot.findById(parkingLotId);
    if (!lot) return res.status(404).json({ message: "Parking lot not found" });

    if (lot.availableSlots <= 0)
      return res.status(400).json({ message: "No available parking slots." });

    lot.availableSlots -= 1;
    await lot.save();

    const ticket = await Ticket.create({
      user: userId,
      parkingLot: lot._id,
      startTime,
      durationHours,
      status: "active",
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧾 Kết thúc vé đỗ xe
exports.endTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("parkingLot");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.status === "completed")
      return res.status(400).json({ message: "Ticket already completed" });

    ticket.status = "completed";
    ticket.totalFee =
      ticket.parkingLot.pricePerHour * ticket.durationHours || 0;
    await ticket.save();

    // cập nhật lại slot
    const lot = await ParkingLot.findById(ticket.parkingLot._id);
    lot.availableSlots += 1;
    await lot.save();

    res.json({ message: "Parking session ended", ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 Xem danh sách vé
exports.getTickets = async (req, res) => {
  try {
    const filter =
      req.user.role === "driver" ? { user: req.user.id } : {};

    const tickets = await Ticket.find(filter)
      .populate("user", "username role")
      .populate("parkingLot", "name location");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Tìm vé theo khoảng ngày
exports.searchTicketsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate))
      return res.status(400).json({ message: "Invalid date range." });

    const filter =
      req.user.role === "driver" ? { user: req.user.id } : {};

    const tickets = await Ticket.find({
      ...filter,
      bookedAt: { $gte: startDate, $lte: endDate },
    }).populate("parkingLot", "name location");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
