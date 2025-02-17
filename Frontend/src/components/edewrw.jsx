import React, { useContext, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadImageToCloudinary } from "../utils/ImageUpload";

const ItemForm = ({ onClose, onSave }) => {
  const { backendUrl } = useContext(UserDataContext);
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
    image: "/images/package.svg", // Default placeholder
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUD_PRESET;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
    setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 2) newErrors.name = "Item name must be at least 2 characters.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.storeLocation) newErrors.storeLocation = "Store location is required.";
    if (formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1.";
    if (formData.value < 0) newErrors.value = "Value cannot be negative.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    let imageUrl = formData.image;

    try {
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile, cloudName, uploadPreset);
      }
    } catch (error) {
      toast.error("Failed to upload image.");
      imageUrl = "/images/package.svg";
    }

    try {
      const response = await axios.post(
        `${backendUrl}/items/add`,
        { ...formData, image: imageUrl },
        { withCredentials: true }
      );

      if (response.status === 201) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm max-h-[90vh] my-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 px-2 py-2 block w-full border border-gray-300 rounded-md"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            {imageFile && (
              <div className="mt-2">
                <img src={URL.createObjectURL(imageFile)} alt="Selected Preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md" disabled={uploading}>
              {uploading ? "Uploading..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
