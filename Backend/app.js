const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/user.routes");
const itemRoute = require("./routes/item.routes");

connectToDB();
app.use(
  cors({
    // origin: process.env.FRONTEMD_URL.split(","),
    origin: ["http://localhost:5173", "http://192.168.0.103:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Received req");
  next(); // Pass control to the next middleware/route
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/users", userRoutes);
app.use("/items", itemRoute);

module.exports = app;
