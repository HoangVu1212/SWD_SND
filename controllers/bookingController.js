const Event = require("../models/eventModel");
const Booking = require("../models/bookingModel");

exports.createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user.userId;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.availableSeats < quantity)
      return res.status(400).json({ message: "Not enough seats available" });

    event.availableSeats -= quantity;
    await event.save();

    const totalCost = event.ticketPrice * quantity;
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      quantity,
      totalCost,
    });

    res.json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("event");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (new Date() > booking.event.date)
    return res.status(400).json({ message: "Cannot cancel past events" });

  booking.status = "cancelled";
  await booking.save();

  booking.event.availableSeats += booking.quantity;
  await booking.event.save();

  res.json({ message: "Booking cancelled" });
};
exports.getAllBookings = async (req, res) => {
  const filter = req.user.role === "customer" ? { user: req.user.userId } : {};
  const bookings = await Booking.find(filter).populate("event").populate("user");
  res.json(bookings);
};
exports.getBookingsByDate = async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end || new Date(start) > new Date(end))
    return res.status(400).json({ message: "Invalid date range" });

  const bookings = await Booking.find({
    bookingDate: { $gte: new Date(start), $lte: new Date(end) },
  });
  res.json(bookings);
};
