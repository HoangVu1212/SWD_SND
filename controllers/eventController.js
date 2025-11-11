const Event = require("../models/eventModel");

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};
