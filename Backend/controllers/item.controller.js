const { validationResult } = require("express-validator");
const ItemModel = require("../models/item.model");
const userModel = require("../models/user.model");

//  add item
module.exports.addItem = async (req, res) => {
  try {
    const {
      name,
      category,
      storeLocation,
      quantity,
      purchaseDate,
      expiryDate,
      serialNumber,
      purchaseLocation,
      value,
      notes,
      image,
    } = req.body;

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    // Create the new item
    const newItem = new ItemModel({
      name,
      owner: user._id,
      category,
      storeLocation,
      quantity,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      serialNumber,
      purchaseLocation,
      value: value || 0,
      notes,
      image,
    });

    // Save item to the database
    const savedItem = await newItem.save();

    return res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding item:", error);
    return res
      .status(500)
      .json({ message: "Failed to add item", error: error.message });
  }
};

// update Item
module.exports.updateItem = async (req, res) => {
  try {
    console.log("update");
    console.log(req.body);
    const { itemId } = req.params;
    const updates = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const user = req.user;
    const item = await ItemModel.findOne({ _id: itemId, owner: user._id });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or access denied" });
    }

    Object.keys(updates).forEach((key) => {
      item[key] = updates[key];
    });
    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return res
      .status(500)
      .json({ message: "Failed to update item", error: error.message });
  }
};

// delete item
module.exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const user = req.user;
    const item = await ItemModel.findOne({ _id: itemId, owner: user._id });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or access denied" });
    }

    // Delete the item
    await ItemModel.deleteOne({ _id: itemId });

    // Return success response
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete item", error: error.message });
  }
};

// get all itms
module.exports.getAllItemsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const items = await ItemModel.find({ owner: userId });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items by user:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch items", error: error.message });
  }
};

// get specific item
module.exports.getItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    const user = req.user;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invaild Item" });
    }

    // Fetch the item
    const { itemId } = req.params;
    const item = await ItemModel.findById(itemId);
    if (!item || !item.owner.equals(req.user._id)) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
