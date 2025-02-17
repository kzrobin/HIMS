import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

const Item = () => {
  const { itemId } = useParams();
  const { backendUrl } = useContext(UserDataContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize Cloudinary instance
  const cld = new Cloudinary({
    cloud: {
      cloudName: "kz-cloud", // Replace with your Cloudinary cloud name
    },
  });

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
        console.error("Error fetching item:", error);
        setError("Failed to fetch item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, backendUrl]);

  if (loading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>{error}</Layout>;
  if (!item) return <Layout>Item not found.</Layout>;

  return (
    <Layout>
      <div className="mt-6 my-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg  mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          Item Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Image */}
          <div className="flex justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="rounded-lg shadow-md w-48 h-48 object-cover"
                // onError={(e) => (e.target.src = "/fallback-image.png")} // Show a fallback image if the URL is broken
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
                <p className="text-gray-600">No Image Available</p>
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                {[
                  { label: "Name", value: item.name },
                  { label: "Category", value: item.category },
                  { label: "Store Location", value: item.storeLocation },
                  { label: "Quantity", value: item.quantity },
                  {
                    label: "Purchase Date",
                    value: item.purchaseDate
                      ? new Date(item.purchaseDate).toLocaleDateString()
                      : "N/A",
                  },
                  {
                    label: "Expiry Date",
                    value: item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A",
                  },
                  { label: "Serial Number", value: item.serialNumber || "N/A" },
                  {
                    label: "Purchase Location",
                    value: item.purchaseLocation || "N/A",
                  },
                  { label: "Value", value: `$${item.value.toFixed(2)}` },
                  { label: "Notes", value: item.notes || "N/A" },
                ].map((row, index) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default Item;
