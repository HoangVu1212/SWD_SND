const Equipment = require("../models/equipmentModel");


exports.createEquipment = async (req, res) => {
  try {
    const equipment = await equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📋 Xem danh sách bãi đỗ
exports.getAllEquipment = async (req, res) => {
  try {
    const lots = await Equipment.find();
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
