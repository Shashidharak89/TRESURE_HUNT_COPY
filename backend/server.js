const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Allow CORS for all origins
app.use(
  cors({
    origin: "*", // Allows requests from any origin
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allow necessary headers
  })
);

// Define API routes
app.use("/api/round1", require("./routes/round1Routes"));
app.use("/api/round2", require("./routes/round2Routes"));
app.use("/api/round3", require("./routes/round3Routes"));
app.use("/api/round4", require("./routes/round4Routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
