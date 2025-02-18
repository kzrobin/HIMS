const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },

    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Furniture", "Groceries", "Clothing", "Other"],
    },

    storeLocation: { type: String, required: true },

    quantity: { type: Number, required: true, min: 1 },

    purchaseDate: { type: Date, default: null },

    expiryDate: { type: Date, default: null },

    serialNumber: { type: String, default: "" },

    purchaseLocation: { type: String, default: "" },

    value: { type: Number, default: 0, min: 0 },

    notes: { type: String, default: "" },

    image: {
      type: String,
      default: "/images/package.svg", // ✅ Default image URL
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
