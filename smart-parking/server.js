const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/parking-lots", require("./routes/parkingRoutes"));
app.use("/tickets", require("./routes/ticketRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));
