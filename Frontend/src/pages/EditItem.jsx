import React, { useContext, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../utils/ImageUpload";

const EditItem = () => {
  const { itemId } = useParams();
  const { backendUrl, getItems } = useContext(UserDataContext);
  const location = useLocation();
  console.log(location);
  console.log("Previous URL:", location.state?.from);
  const previousUrl = location.state?.from || "/dashboard";
  const navigate = useNavigate();

  console.log(itemId);
  const [item, setItem] = useState(null);
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${backendUrl}/items/${itemId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setItem(response.data.item);
          setFormData({
            name: response.data.item.name,
            category: response.data.item.category,
            storeLocation: response.data.item.storeLocation,
            quantity: response.data.item.quantity,
            purchaseDate: response.data.item.purchaseDate
              ? new Date(response.data.item.purchaseDate)
                  .toISOString()
                  .split("T")[0]
              : "",
            expiryDate: response.data.item.expiryDate
              ? new Date(response.data.item.expiryDate)
                  .toISOString()
                  .split("T")[0]
              : "",
            serialNumber: response.data.item.serialNumber,
            purchaseLocation: response.data.item.purchaseLocation,
            value: response.data.item.value,
            notes: response.data.item.notes,
            image: response.data.item.image || "/images/package.svg",
          });
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        toast.error("Failed to fetch item details.");
      }
    };

    fetchItem();
  }, [itemId, backendUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Only image files are allowed.",
        }));
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Image size must be less than 4MB.",
        }));
        return;
      }
      setImageFile(file);
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = "Item name must be at least 2 characters long.";
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    if (!formData.storeLocation) {
      newErrors.storeLocation = "Store location is required.";
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    if (formData.value < 0) {
      newErrors.value = "Value cannot be negative.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processFormSubmission = async () => {
    setUploading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadUrl = await uploadImageToCloudinary(imageFile);
        if (uploadUrl) {
          imageUrl = uploadUrl;
        } else {
          toast.error("Failed to upload image");
        }
      }

      const response = await axios.put(
        `${backendUrl}/items/update/${itemId}`,
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

      if (response.status === 200) {
        toast.success("Item updated successfully");
        getItems();
        navigate("/items");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    } finally {
      setUploading(false);
      setPendingSubmission(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const today = new Date();
    const expiry = formData.expiryDate ? new Date(formData.expiryDate) : null;

    if (expiry && expiry < today) {
      setShowExpiryWarning(true);
      setPendingSubmission({});
      return;
    }

    await processFormSubmission();
  };

  return (
    <Layout>
      <div className="flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg my-4 overflow-y-auto custom-scroll">
          <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 px-2 py-2 block w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 px-2 py-2 block w-full border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
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
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Store Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Store Location
                </label>
                <input
                  type="text"
                  name="storeLocation"
                  value={formData.storeLocation}
                  onChange={handleChange}
                  className={`mt-1 px-2 py-2 block w-full border ${
                    errors.storeLocation ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  required
                />
                {errors.storeLocation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storeLocation}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`mt-1 px-2 py-2 block w-full border ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  min="1"
                  required
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              {/* Purchase Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Expiry Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Serial Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Purchase Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Location
                </label>
                <input
                  type="text"
                  name="purchaseLocation"
                  value={formData.purchaseLocation}
                  onChange={handleChange}
                  className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Value */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Value
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className={`mt-1 px-2 py-2 block w-full border ${
                    errors.value ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  min="0"
                />
                {errors.value && (
                  <p className="text-red-500 text-sm mt-1">{errors.value}</p>
                )}
              </div>

              {/* Notes - full width */}
              <div className="mb-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Image Upload and Preview - full width */}
            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
              <div className="mt-2">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Selected Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  formData.image && (
                    <img
                      src={formData.image}
                      alt="Current"
                      className="w-24 h-24 object-cover rounded"
                    />
                  )
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(previousUrl)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Expiry Warning Popup */}
        {showExpiryWarning && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-80 shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">
                Expiry date has already passed. Do you still want to update this
                item?
              </p>
              <div className="flex justify-between">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowExpiryWarning(false)}
                >
                  No
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setShowExpiryWarning(false);
                    if (pendingSubmission) {
                      processFormSubmission();
                    }
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EditItem;
