import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import DeleteItem from "../../components/Item/DeleteItem";

const ItemView = () => {
  const { itemId } = useParams();
  const { backendUrl } = useContext(UserDataContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`${backendUrl}/items/${itemId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setItem(response.data.item);
        }
      } catch (error) {
        setError("Failed to fetch item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, backendUrl]);

  if (loading) return <Layout>Loading...</Layout>;
  // if (error) return <Layout>{error}</Layout>;
  if (!item)
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-2xl font-bold text-gray-800">Item Not Found</h2>
          <p className="mt-4 text-lg text-gray-600 text-center">
            The item you are looking for does not exist or has been removed.
          </p>
        </div>
      </Layout>
    );

  // Additional details (excluding Name, Category and Expiry Date)
  const additionalRows = [
    { label: "Store Location", value: item.storeLocation },
    { label: "Quantity", value: item.quantity },
    {
      label: "Purchase Date",
      value: item.purchaseDate
        ? new Date(item.purchaseDate).toLocaleDateString()
        : "N/A",
    },
    { label: "Serial Number", value: item.serialNumber || "N/A" },
    { label: "Purchase Location", value: item.purchaseLocation || "N/A" },
    { label: "Value", value: `$${item.value.toFixed(2)}` },
    { label: "Notes", value: item.notes || "N/A" },
  ];

  return (
    <Layout>
      <div className="mt-6 my-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg mx-auto">
        {/* Responsive Primary Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Item Image */}
          <div className="flex justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="rounded-lg shadow-md w-48 h-48 object-cover"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                <p className="text-gray-600">No Image Available</p>
              </div>
            )}
          </div>

          {/* Right: Primary Item Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              {item.name}
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Category:</strong> {item.category}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Expiry Date:</strong>{" "}
              {item.expiryDate
                ? new Date(item.expiryDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-6">
          <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              {additionalRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold text-gray-700 border border-gray-200">
                    {row.label}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Edit and Delete Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() =>
              navigate(`/item/edit/${item._id}`, {
                state: { from: location.pathname },
              })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      {confirmDelete && (
        <DeleteItem
          onCancel={() => setConfirmDelete(false)}
          deleteItem={item._id}
          previousUrl={location.state?.from}
        />
      )}
    </Layout>
  );
};

export default ItemView;
