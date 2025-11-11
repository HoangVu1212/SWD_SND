const ParkingLot = require("../models/parkingLotModel");

// ➕ Tạo mới bãi đỗ (Admin)
exports.createParkingLot = async (req, res) => {
  try {
    const parking = await ParkingLot.create(req.body);
    res.status(201).json(parking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📋 Xem danh sách bãi đỗ
exports.getAllParkingLots = async (req, res) => {
  try {
    const lots = await ParkingLot.find();
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
