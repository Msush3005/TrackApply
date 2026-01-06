const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("TrackApply API is running");
});

module.exports = app;
