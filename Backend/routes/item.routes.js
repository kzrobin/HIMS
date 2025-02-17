const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const {
  getAllItemsByUser,
  addItem,
  updateItem,
  deleteItem,
  getItem,
} = require("../controllers/item.controller");
const { authUser } = require("../middlewares/auth.middlewares");

// Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for adding an item
const validateAddItem = [
  body("name")
    .trim()
    .isString()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("category")
    .isIn(["Electronics", "Furniture", "Groceries", "Clothing", "Other"])
    .withMessage("Invalid category"),
  body("storeLocation")
    .trim()
    .notEmpty()
    .withMessage("Store location is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("purchaseDate")
    .optional()
    .isISO8601()
    .withMessage("Purchase date must be a valid date"),
  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Expiry date must be a valid date"),
  body("serialNumber").optional().trim().isString(),
  body("purchaseLocation").optional().trim().isString(),
  body("value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Value must be a non-negative number"),
  body("notes").optional().trim().isString(),
  validateRequest,
];

// Validation rules for updating an item
const validateUpdateItem = [
  param("itemId").isMongoId().withMessage("Invalid item ID"),
  ...validateAddItem,
];

// Validation rules for deleting an item
const validateDeleteItem = [
  param("itemId").isMongoId().withMessage("Invalid item ID"),
  validateRequest,
];

// Routes
router.get("/", authUser, getAllItemsByUser);
router.get(
  "/:itemId",
  authUser,
  param("itemId").isMongoId().withMessage("Invalid item ID"),
  getItem
);
router.post("/add", authUser, addItem); // 3. Add a new item
router.put("/update/:itemId", authUser, validateUpdateItem, updateItem);
router.delete("/delete/:itemId", authUser, validateDeleteItem, deleteItem);

module.exports = router;
