import React, { useContext, useEffect, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Package,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  View,
  Pencil,
  QrCode,
  Search,
  X,
  ListFilter,
} from "lucide-react";
import "react-resizable/css/styles.css";
import ItemForm from "./ItemForm";
import { UserDataContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DeleteItem from "./DeleteItem";
import { useBarcodeScanner } from "../../utils/BarCodeScanner";

const ItemTable = () => {
  const { items, getItems } = useContext(UserDataContext);
  const location = useLocation();

  // Column visibility state
  const [showColumns, setShowColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = JSON.parse(localStorage.getItem("visibleColumns"));
    const screenWidth = window.innerWidth;
    return (
      savedColumns || {
        category: true,
        storeLocation: screenWidth >= 768,
        purchaseDate: screenWidth >= 1024,
        expiryDate: screenWidth >= 768,
        quantity: screenWidth >= 768,
        value: screenWidth >= 768,
        notes: screenWidth >= 1024,
        serialNumber: false,
        purchaseLocation: screenWidth >= 1024,
        createdAt: false,
        image: screenWidth >= 768,
      }
    );
  });

  useEffect(() => {
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Pagination, filtering, and sorting states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Barcode scanner
  const { scannerRef, barcode, scanning, startScanner, stopScanner } =
    useBarcodeScanner();
  const [searchScanModalOpen, setSearchScanModalOpen] = useState(false);

  useEffect(() => {
    if (searchScanModalOpen && barcode) {
      setSearchTerm(barcode);
      stopScanner();
      setSearchScanModalOpen(false);
    }
  }, [barcode, searchScanModalOpen, stopScanner]);

  const openSearchScanModal = () => {
    setSearchScanModalOpen(true);
    setTimeout(startScanner, 100);
  };

  // Filtering and sorting logic
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn] || "";
    const valueB = b[sortColumn] || "";
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });
  const searchedItems = sortedItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(searchedItems.length / itemsPerPage);
  const currentItems = searchedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Event handlers
  const handleSort = (column) => {
    setSortColumn(column);
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => setCurrentPage(page);

  // Fetch items
  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="flex flex-col h-full mx-2 sm:mx-4 lg:mx-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 gap-4 bg-white shadow-sm rounded-t-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#344E41]">
            Your Items
          </h1>
          <button
            onClick={() => setShowColumns(!showColumns)}
            className={`p-1 rounded-full hover:bg-gray-100 transition-all ${
              showColumns ? "bg-gray-100" : ""
            }`}
            title="Toggle columns"
          >
            <ListFilter className="h-5 w-5 text-[#588157]" />
          </button>
          <AnimatePresence>
            {showColumns && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-10 left-1 sm:left-2 z-20 bg-white shadow-lg rounded-lg p-4 w-56 max-h-60 overflow-y-auto border border-gray-200"
              >
                {Object.keys(visibleColumns).map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 py-1 text-sm text-[#344E41]"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns[key]}
                      onChange={() =>
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                      className="accent-[#588157]"
                    />
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:border-[#588157] focus:ring-1 focus:ring-[#588157] outline-none text-sm text-[#344E41]"
            />
            <button
              onClick={openSearchScanModal}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
              title="Scan Barcode"
            >
              <QrCode className="h-5 w-5 text-[#588157]" />
            </button>
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full sm:w-40 py-2 px-3 rounded-lg border border-gray-300 bg-white text-sm text-[#344E41] focus:border-[#588157] focus:ring-1 focus:ring-[#588157] outline-none"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Groceries">Groceries</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowItemForm(true)}
            className="flex items-center gap-1 px-3 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#344E41] transition-all text-sm font-medium shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Item</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto bg-white rounded-b-lg shadow-md mt-2">
        <table className="w-full divide-y divide-gray-200 text-[#344E41]">
          <thead className="bg-[#F9FAF5] sticky top-0 z-10">
            <tr>
              {visibleColumns.image && (
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-[#344E41]">
                  Image
                </th>
              )}
              <th
                onClick={() => handleSort("name")}
                className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortColumn === "name" ? (
                    sortOrder === "asc" ? (
                      <ArrowUp className="h-4 w-4 text-[#588157]" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-[#588157]" />
                    )
                  ) : (
                    <ArrowUp className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </th>
              {visibleColumns.category && (
                <th
                  onClick={() => handleSort("category")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortColumn === "category" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.storeLocation && (
                <th
                  onClick={() => handleSort("storeLocation")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Store Location
                    {sortColumn === "storeLocation" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.purchaseDate && (
                <th
                  onClick={() => handleSort("purchaseDate")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Purchase Date
                    {sortColumn === "purchaseDate" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.expiryDate && (
                <th
                  onClick={() => handleSort("expiryDate")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Expiry Date
                    {sortColumn === "expiryDate" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.quantity && (
                <th
                  onClick={() => handleSort("quantity")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Quantity
                    {sortColumn === "quantity" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.value && (
                <th
                  onClick={() => handleSort("value")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Value
                    {sortColumn === "value" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.notes && (
                <th
                  onClick={() => handleSort("notes")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Notes
                    {sortColumn === "notes" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.serialNumber && (
                <th
                  onClick={() => handleSort("serialNumber")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Serial Number
                    {sortColumn === "serialNumber" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.purchaseLocation && (
                <th
                  onClick={() => handleSort("purchaseLocation")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Purchase Location
                    {sortColumn === "purchaseLocation" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th
                  onClick={() => handleSort("createdAt")}
                  className="px-2 sm:px-4 py-3 text-left text-xs font-semibold cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    Created At
                    {sortColumn === "createdAt" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className="h-4 w-4 text-[#588157]" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-[#588157]" />
                      )
                    ) : (
                      <ArrowUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              )}
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-[#F9FAF5] transition-all"
                >
                  {visibleColumns.image && (
                    <td className="px-2 sm:px-4 py-3">
                      <img
                        src={item.image || "https://via.placeholder.com/40"}
                        alt={item.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    </td>
                  )}
                  <td className="px-2 sm:px-4 py-3 truncate max-w-[150px] sm:max-w-[200px]">
                    {item.name || "-"}
                  </td>
                  {visibleColumns.category && (
                    <td className="px-2 sm:px-4 py-3 truncate max-w-[120px] sm:max-w-[150px]">
                      {item.category || "-"}
                    </td>
                  )}
                  {visibleColumns.storeLocation && (
                    <td className="px-2 sm:px-4 py-3 truncate max-w-[120px] sm:max-w-[150px]">
                      {item.storeLocation || "-"}
                    </td>
                  )}
                  {visibleColumns.purchaseDate && (
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.purchaseDate
                        ? new Date(item.purchaseDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                  )}
                  {visibleColumns.expiryDate && (
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                  )}
                  {visibleColumns.quantity && (
                    <td className="px-2 sm:px-4 py-3">
                      {item.quantity || "-"}
                    </td>
                  )}
                  {visibleColumns.value && (
                    <td className="px-2 sm:px-4 py-3">{item.value || "-"}</td>
                  )}
                  {visibleColumns.notes && (
                    <td className="px-2 sm:px-4 py-3 truncate max-w-[150px] sm:max-w-[200px]">
                      {item.notes || "-"}
                    </td>
                  )}
                  {visibleColumns.serialNumber && (
                    <td className="px-2 sm:px-4 py-3 truncate max-w-[120px] sm:max-w-[150px]">
                      {item.serialNumber || "-"}
                    </td>
                  )}
                  {visibleColumns.purchaseLocation && (
                    <td className="px-2 sm:px-4 py-3 truncate max-w-[120px] sm:max-w-[150px]">
                      {item.purchaseLocation || "-"}
                    </td>
                  )}
                  {visibleColumns.createdAt && (
                    <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                  )}
                  <td className="px-2 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
                    <Link
                      to={`/item/edit/${item._id}`}
                      state={{ from: location.pathname }}
                      className="text-[#588157] hover:text-[#344E41] transition-colors"
                      title="Edit Item"
                    >
                      <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                      className="text-[#588157] hover:text-[#344E41] transition-colors"
                      title="View Item"
                    >
                      <View className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteItemId(item._id);
                        setShowDeleteConfirm(true);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="100%" className="text-center py-12">
                  <Package className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm sm:text-base font-medium text-[#344E41]">
                    No Items Found
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Try adding items or adjusting your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-4 mb-6">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-[#588157] text-white hover:bg-[#344E41] disabled:bg-gray-300 transition-all"
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-[#588157] text-white hover:bg-[#344E41] disabled:bg-gray-300 transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-[#344E41]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-[#588157] text-white hover:bg-[#344E41] disabled:bg-gray-300 transition-all"
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-[#588157] text-white hover:bg-[#344E41] disabled:bg-gray-300 transition-all"
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showItemForm && <ItemForm onClose={() => setShowItemForm(false)} />}
        {showDeleteConfirm && (
          <DeleteItem
            onCancel={() => {
              setShowDeleteConfirm(false);
              setDeleteItemId(null);
            }}
            deleteItem={deleteItemId}
          />
        )}
        {searchScanModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white relative p-4 sm:p-6 rounded-lg w-full max-w-md shadow-lg">
              <button
                onClick={() => {
                  stopScanner();
                  setSearchScanModalOpen(false);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 text-[#344E41] transition-all"
                title="Close Scanner"
              >
                <X className="h-5 w-5" />
              </button>
              <div
                id="scanner"
                ref={scannerRef}
                className="w-full h-64 sm:h-72 mb-4 rounded-lg overflow-hidden"
              />
              <p className="text-center text-sm text-[#344E41]">
                Scan a barcode to search your items.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItemTable;
