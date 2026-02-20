import React, { useContext, useEffect } from "react";
import {
  BarChart2,
  TrendingUp,
  Package,
  Clock,
  Tag,
  Map,
  Settings,
  Download,
} from "lucide-react";
import { UserDataContext } from "../../context/UserContext";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";

const Report = () => {
  const { user, items, getItems } = useContext(UserDataContext);
  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalItems = items.length;
  const expiringItems = items.filter((item) => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30;
  }).length;

  const categories = [...new Set(items.map((item) => item.category))];
  const locations = [
    ...new Set(items.map((item) => item.storeLocation).filter(Boolean)),
  ];

  // Function to export data as CSV
  const exportToCSV = () => {
    if (!items.length) return;

    const csvHeaders =
      "Name,Category,Store Location,Quantity,Purchase Date,Expiry Date,Serial Number,Purchase Location,Value,Notes\n";
    const csvRows = items.map((item) =>
      [
        item.name,
        item.category,
        item.storeLocation,
        item.quantity,
        item.purchaseDate
          ? new Date(item.purchaseDate).toLocaleDateString()
          : "",
        item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString()
          : "N/A",
        item.serialNumber,
        item.purchaseLocation,
        item.value,
        item.notes,
      ].join(",")
    );

    const csvContent = csvHeaders + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Function to export data as JSON
  const exportToJSON = () => {
    const jsonData = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    getItems();
  }, []);
  return (
    <Layout>
      <div className="space-y-6 mt-6 sm:mt-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Items
              </h3>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Value
              </h3>
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${totalValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Categories
              </h3>
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>

          <Link to={"/report-expiry"} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Expiring Soon
              </h3>
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{expiringItems}</p>
          </Link>
        </div>

        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Map className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
            </div>
            <div className="space-y-2">
              {locations.map((location) => (
                <div
                  key={location}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">{location}</span>
                  <span className="text-gray-900 font-medium">
                    {
                      items.filter((item) => item.storeLocation === location)
                        .length
                    }{" "}
                    items
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Value Distribution
              </h3>
            </div>
            <div className="space-y-2">
              {categories.map((category) => {
                const categoryValue = items
                  .filter((item) => item.category === category)
                  .reduce((sum, item) => sum + (item.value || 0), 0);
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">{category}</span>
                    <span className="text-gray-900 font-medium">
                      ${categoryValue.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={exportToCSV}
              >
                <Download className="h-5 w-5 mr-2" />
                Export as CSV
              </button>
              <button
                className="w-full flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                onClick={exportToJSON}
              >
                <Download className="h-5 w-5 mr-2" />
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
