const Rental = require("../models/RentalModel");
const Equipment = require("../models/equipmentModel");

// 📥 Đặt vé đỗ xe
exports.bookRental = async (req, res) => {
  try {
    const { EquipmentId, startDate , endDate, quantity } = req.body;
    const userId = req.user.id;

    const lot = await Equipment.findById(EquipmentId);
    if (!lot) return res.status(404).json({ message: "Equipment not found" });

    if (lot.availableSlots <= 0)
      return res.status(400).json({ message: "Not enough stock available." });

    lot.availableSlots -= 1;
    await lot.save();

    const rental = await Ticket.create({
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


// 📋 Xem danh sách vé
exports.getRental = async (req, res) => {
  try {
    const filter =
      req.user.role === "customer" ? { user: req.user.id } : {};

    const Rental = await Ticket.find(filter)
      .populate("user", "username role")
      .populate("equipment", "name quantity");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 Tìm vé theo khoảng ngày
exports.searchRentalsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate))
      return res.status(400).json({ message: "Invalid date range." });

    const filter =
      req.user.role === "customer" ? { user: req.user.id } : {};

    const rental = await Rental.find({
      ...filter,
      bookedAt: { $gte: startDate, $lte: endDate },
    }).populate("equipment", "name quantity");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
