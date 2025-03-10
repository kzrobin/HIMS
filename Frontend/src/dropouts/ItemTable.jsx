import React, { useContext, useEffect, useState } from "react";
import {
  Trash2,
  Package,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Tally3, ListFilter } from "lucide-react";
import ItemForm from "./ItemForm";
import { UserDataContext } from "../context/UserContext";

const ItemTable = () => {
  // User context
  const { items, getItems, user } = useContext(UserDataContext);

  // Check premium features
  const isPremium = user.isPremium;

  // Column visibility
  const [showColumns, setShowColumns] = useState(false);

  // Initialize visibleColumns based on screen width
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const screenWidth = window.innerWidth;
    return {
      category: true,
      storeLocation: isPremium && screenWidth >= 768, // Show on medium screens and above
      purchaseDate: screenWidth >= 768, // Show on medium screens and above
      expiryDate: screenWidth >= 768, // Show on medium screens and above
      quantity: isPremium && screenWidth >= 768, // Show on medium screens and above
      value: isPremium && screenWidth >= 768, // Show on medium screens and above
      notes: screenWidth >= 768, // Show on medium screens and above
      serialNumber: screenWidth >= 1024, // Show on large screens and above
      purchaseLocation: screenWidth >= 1024, // Show on large screens and above
      createdAt: screenWidth >= 1024, // Show on large screens and above
      image: screenWidth >= 768, // Show on medium screens and above
    };
  });

  // Item form state
  const [showItemForm, setShowItemForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState("");

  // Handle item form
  const handleAddItem = () => setShowItemForm(true);
  const handleCloseForm = () => setShowItemForm(false);

  // Save new item
  const handleSaveItem = (newItem) => {
    setShowItemForm(false);
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1); // Reset pagination when category changes
  };

  // Filtered items based on category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  // Total number of pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Slice items for current page
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  // Get items when component mounts
  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {}, [items]);

  return (
    <div className="flex flex-col flex-1 h-full mx-4">
      {/* Features */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-5 sm:px-8 py-3 sm:py-4 gap-4">
        <div className="flex justify-start items-center gap-2">
          <h1 className="font-semibold text-2xl sm:text-3xl">Items</h1>
          <div>
            <Tally3
              onClick={() => setShowColumns(!showColumns)}
              className={`text-4xl font-thin bg-white mt-[8px] opacity-50 hover:opacity-100 relative rounded-sm pl-1
              ${showColumns ? "outline outline-2 outline-green-500" : ""}`}
            />
            {showColumns && (
              <div className="bg-white shadow-md p-3 rounded mt-2 w-60 absolute z-10">
                {Object.keys(visibleColumns).map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={visibleColumns[key]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="listFilter flex bg-white px-2 py-2 rounded-lg border border-gray-200">
            <ListFilter className="pr-1 text-gray-600" />
            <select
              onChange={handleCategoryChange}
              value={selectedCategory}
              className="outline-none p-1 rounded bg-transparent text-gray-700"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Groceries">Groceries</option>
              <option value="Clothing">Clothing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition flex items-center gap-1"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 bg-white rounded-lg shadow my custom-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {visibleColumns.image && (
                <th className="px-4 py-3 text-left text-xs font-bold">Image</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-bold">Name</th>
              {visibleColumns.category && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Category
                </th>
              )}
              {visibleColumns.storeLocation && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Store Location
                </th>
              )}
              {visibleColumns.purchaseDate && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Purchase Date
                </th>
              )}
              {visibleColumns.expiryDate && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Expiry Date
                </th>
              )}
              {visibleColumns.quantity && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Quantity
                </th>
              )}
              {visibleColumns.value && (
                <th className="px-4 py-3 text-left text-xs font-bold">Value</th>
              )}
              {visibleColumns.notes && (
                <th className="px-4 py-3 text-left text-xs font-bold">Notes</th>
              )}
              {visibleColumns.serialNumber && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Serial Number
                </th>
              )}
              {visibleColumns.purchaseLocation && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Purchase Location
                </th>
              )}
              {visibleColumns.createdAt && (
                <th className="px-4 py-3 text-left text-xs font-bold">
                  Created At
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {visibleColumns.image && (
                    <td className="px-4 py-3">
                      <img
                        src={item.image || "/images/package.svg"}
                        alt={item.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">{item.name || "-"}</td>
                  {visibleColumns.category && (
                    <td className="px-4 py-3">{item.category || "-"}</td>
                  )}
                  {visibleColumns.storeLocation && (
                    <td className="px-4 py-3">{item.storeLocation || "-"}</td>
                  )}
                  {visibleColumns.purchaseDate && (
                    <td className="px-4 py-3">
                      {item.purchaseDate
                        ? new Date(item.purchaseDate).toLocaleDateString()
                        : "-"}
                    </td>
                  )}
                  {visibleColumns.expiryDate && (
                    <td className="px-4 py-3">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>
                  )}
                  {visibleColumns.quantity && (
                    <td className="px-4 py-3">{item.quantity || "-"}</td>
                  )}
                  {visibleColumns.value && (
                    <td className="px-4 py-3">
                      ${item.value?.toLocaleString() || "-"}
                    </td>
                  )}
                  {visibleColumns.notes && (
                    <td className="px-4 py-3">{item.notes || "-"}</td>
                  )}
                  {visibleColumns.serialNumber && (
                    <td className="px-4 py-3">{item.serialNumber || "-"}</td>
                  )}
                  {visibleColumns.purchaseLocation && (
                    <td className="px-4 py-3">
                      {item.purchaseLocation || "-"}
                    </td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="px-4 py-3">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <button className="text-red-600 hover:text-red-900 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No items found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add some items to your inventory or try a different search.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2 mb-4">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>

      {showItemForm && (
        <ItemForm onClose={handleCloseForm} onSave={handleSaveItem} />
      )}
    </div>
  );
};

ItemTable.defaultProps = {
  items: [],
  isPremium: false,
  handleDeleteItem: () => {},
};

export default ItemTable;
