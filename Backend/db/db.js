const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.DB_connect)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
}

module.exports = connectToDB;
