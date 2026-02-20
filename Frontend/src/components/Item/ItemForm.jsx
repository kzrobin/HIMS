import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import { uploadImageToCloudinary } from "../../utils/ImageUpload";
import { toast } from "react-toastify";
import { QrCode, X } from "lucide-react";
import { useBarcodeScanner } from "../../utils/BarCodeScanner";
import { motion, AnimatePresence } from "framer-motion";

const ItemForm = ({ onClose }) => {
  const { backendUrl, getItems } = useContext(UserDataContext);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    storeLocation: "",
    quantity: 1,
    purchaseDate: "",
    expiryDate: "",
    serialNumber: "",
    purchaseLocation: "",
    value: 0,
    notes: "",
    image: "/images/package.svg",
  });

  const [errors, setErrors] = useState({});
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);
  const fileInputRef = useRef(null); // Ref for file input

  // Barcode scanner
  const { scannerRef, barcode, startScanner, stopScanner } =
    useBarcodeScanner();
  const [scanModalOpen, setScanModalOpen] = useState(false);

  useEffect(() => {
    if (barcode) {
      setFormData((prev) => ({ ...prev, serialNumber: barcode }));
      closeScannerModal();
    }
  }, [barcode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select an image file.",
        }));
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 4MB.",
        }));
        return;
      }
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image: "/images/package.svg",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.storeLocation)
      newErrors.storeLocation = "Store location is required.";
    if (formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1.";
    if (formData.value < 0) newErrors.value = "Value cannot be negative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processFormSubmission = async () => {
    setUploading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const response = await axios.post(
        `${backendUrl}/items/add`,
        {
          ...formData,
          image: imageUrl,
          purchaseDate: formData.purchaseDate
            ? new Date(formData.purchaseDate)
            : null,
          expiryDate: formData.expiryDate
            ? new Date(formData.expiryDate)
            : null,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Item added successfully!");
        getItems();
        onClose();
      }
    } catch (error) {
      // console.error("Error adding item:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setUploading(false);
      setPendingSubmission(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const today = new Date();
    const expiry = formData.expiryDate ? new Date(formData.expiryDate) : null;

    if (expiry && expiry < today) {
      setShowExpiryWarning(true);
      setPendingSubmission({});
      return;
    }

    await processFormSubmission();
  };

  const openScannerModal = () => {
    setScanModalOpen(true);
    setTimeout(startScanner, 100);
  };

  const closeScannerModal = () => {
    stopScanner();
    setScanModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#344E41]">
            Add New Item
          </h2>
          <button
            onClick={onClose}
            className="text-[#344E41] hover:text-[#588157] transition-all"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]`}
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Groceries">Groceries</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Store Location */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Store Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="storeLocation"
              value={formData.storeLocation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.storeLocation ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]`}
              required
            />
            {errors.storeLocation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.storeLocation}
              </p>
            )}
          </div>

          {/* Quantity & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#344E41] mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]`}
                min="1"
                required
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#344E41] mb-1">
                Value
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.value ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]`}
                min="0"
              />
              {errors.value && (
                <p className="text-red-500 text-xs mt-1">{errors.value}</p>
              )}
            </div>
          </div>

          {/* Purchase Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#344E41] mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#344E41] mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]"
              />
            </div>
          </div>

          {/* Serial Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41] pr-10"
            />
            <button
              type="button"
              onClick={openScannerModal}
              className="absolute right-2 top-1/2 transform -translate-y-1/4 p-1 hover:bg-gray-100 rounded-full"
              title="Scan Serial Number"
            >
              <QrCode className="h-5 w-5 text-[#588157]" />
            </button>
          </div>

          {/* Purchase Location */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Purchase Location
            </label>
            <input
              type="text"
              name="purchaseLocation"
              value={formData.purchaseLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#588157] text-[#344E41] h-24 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#344E41] mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef} // Added ref here
              onChange={handleImageChange}
              className="w-full text-sm text-[#344E41] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#588157] file:text-white hover:file:bg-[#344E41] transition-all"
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
            {imageFile && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="text-red-500 hover:text-red-700 transition-all"
                  title="Remove Image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-[#344E41] rounded-lg hover:bg-gray-300 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 bg-[#588157] text-white rounded-lg font-medium transition-all ${
                uploading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#344E41]"
              }`}
            >
              {uploading ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Scanner Modal */}
      {scanModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white relative p-4 sm:p-6 rounded-xl w-full max-w-md shadow-lg">
            <button
              onClick={closeScannerModal}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-[#344E41] transition-all"
              title="Close Scanner"
            >
              <X className="h-5 w-5" />
            </button>
            <div
              id="scanner"
              ref={scannerRef}
              className="w-full h-64 sm:h-72 rounded-lg"
            />
            <p className="text-center text-sm text-[#344E41] mt-2">
              Scan a barcode to set the serial number.
            </p>
          </div>
        </motion.div>
      )}

      {/* Expiry Warning Modal */}
      {showExpiryWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <p className="text-lg font-semibold text-[#344E41] mb-4">
              The expiry date is in the past. Proceed anyway?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowExpiryWarning(false)}
                className="flex-1 py-2 bg-gray-200 text-[#344E41] rounded-lg hover:bg-gray-300 transition-all font-medium"
              >
                No
              </button>
              <button
                onClick={() => {
                  setShowExpiryWarning(false);
                  if (pendingSubmission) processFormSubmission();
                }}
                className="flex-1 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#344E41] transition-all font-medium"
              >
                Yes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ItemForm;
