const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const activeBookings = await Booking.find({ user: id, status: "active" });
  if (activeBookings.length > 0)
    return res.status(400).json({ message: "Cannot delete users with active bookings" });

  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
};
