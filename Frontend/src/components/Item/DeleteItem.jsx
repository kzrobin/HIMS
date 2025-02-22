import React, { useContext, useState } from "react";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteItem = ({ onCancel, deleteItem, previousUrl = null }) => {
  const { getItems, backendUrl } = useContext(UserDataContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  console.log(previousUrl);

  const handleDeleteClick = async () => {
    setIsDeleting(true); // Start deleting state

    try {
      axios.defaults.withCredentials = true;
      const res = await axios.delete(
        `${backendUrl}/items/delete/${deleteItem}`
      );

      if (res.status === 200) {
        toast.success("Item deleted successfully");
        getItems(); // Fetch updated data only if delete succeeds
        if (previousUrl) {
          navigate(previousUrl);
        }
      }
    } catch (error) {
      console.error(error.response || error);
      toast.error("Internal server error. Please try again.");
    } finally {
      setIsDeleting(false); // Reset state
      onCancel();
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Confirm Delete</h2>
        <p>Are you sure you want to delete this item?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting} // Disable delete button during deletion
            className={`px-4 py-2 rounded text-white ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`px-4 py-2 rounded ${
              isDeleting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItem;
