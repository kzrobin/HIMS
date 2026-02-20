import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DeleteItem = ({ onCancel, deleteItem, previousUrl = null }) => {
  const { getItems, backendUrl } = useContext(UserDataContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [itemName, setItemName] = useState("");
  const [loadingItem, setLoadingItem] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemName = async () => {
      try {
        const res = await axios.get(`${backendUrl}/items/${deleteItem}`, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data.item) {
          setItemName(res.data.item.name);
        }
      } catch (error) {
        // console.error(error.response || error);
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItemName();
  }, [deleteItem, backendUrl]);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    setErrorMessage("");
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.delete(
        `${backendUrl}/items/delete/${deleteItem}`
      );
      if (res.status === 200) {
        toast.success("Item deleted successfully");
        getItems();
        if (previousUrl) {
          navigate(previousUrl);
        }
        onCancel();
      }
    } catch (error) {
      setErrorMessage("Error occurred. Please try again.");
      // console.error(error.response || error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        {loadingItem ? (
          <p className="text-lg text-gray-700">Loading...</p>
        ) : errorMessage ? (
          <>
            <h2 className="text-lg font-semibold">Error Occurred</h2>
            <p className="mt-2">{errorMessage}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">
              Are you sure you want to delete{" "}
              <span className="italic">"{itemName}"</span>?
            </h2>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
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
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteItem;
