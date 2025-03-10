import React, { useContext, useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import "react-resizable/css/styles.css";
import {
  Trash2,
  Package,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  View,
  PencilOff,
  QrCode,
  Search,
  X,
} from "lucide-react";
import { Tally3, ListFilter } from "lucide-react";
import ItemForm from "./ItemForm";
import { UserDataContext } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import DeleteItem from "./DeleteItem";
import { useBarcodeScanner } from "../../utils/BarCodeScanner";

const ItemTable = () => {
  // User context
  const { items, getItems } = useContext(UserDataContext);
  const location = useLocation();

  // Column visibility
  const [showColumns, setShowColumns] = useState(false);

  // Initialize visibleColumns based on screen width (stored in localStorage)
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const savedColumns = JSON.parse(localStorage.getItem("visibleColumns"));
    if (savedColumns) return savedColumns;

    const screenWidth = window.innerWidth;
    return {
      category: true,
      storeLocation: screenWidth >= 768,
      purchaseDate: false,
      expiryDate: screenWidth >= 768,
      quantity: screenWidth >= 768,
      value: screenWidth >= 768,
      notes: screenWidth >= 768,
      serialNumber: false,
      purchaseLocation: screenWidth >= 1024,
      createdAt: false,
      image: screenWidth >= 768,
    };
  });

  // Save column visibility to localStorage
  useEffect(() => {
    localStorage.setItem("visibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sorting state
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Handle item form
  const [showItemForm, setShowItemForm] = useState(false);

  // Initialize barcode scanner for search
  const {
    scannerRef: searchScannerRef,
    barcode: searchBarcode,
    scanning: searchScanning,
    startScanner: searchStartScanner,
    stopScanner: searchStopScanner,
  } = useBarcodeScanner();
  const [searchScanModalOpen, setSearchScanModalOpen] = useState(false);

  // When barcode is detected, update search term and close modal
  useEffect(() => {
    if (searchScanModalOpen && searchBarcode) {
      setSearchTerm(searchBarcode);
      searchStopScanner();
      setSearchScanModalOpen(false);
    }
  }, [searchBarcode, searchScanModalOpen, searchStopScanner]);

  const openSearchScanModal = () => {
    setSearchScanModalOpen(true);
    setTimeout(searchStartScanner, 100);
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset pagination when search term changes
  };

  // Filtered items based on category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn] || "";
    const valueB = b[sortColumn] || "";

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Filtered items based on search term
  const searchedItems = sortedItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const handleSort = (column) => {
    console.log(column);
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Total number of pages
  const totalPages = Math.ceil(searchedItems.length / itemsPerPage);

  // Slice items for current page
  const currentItems = searchedItems.slice(
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

  //handle delete status
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemId, SetDeleteItemId] = useState(null);

  // Get items when component mounts
  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {}, [items]);

  return (
    <div className="flex flex-col flex-1 h-full mx-4">
      {/* Features */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-5 sm:px-8 py-3 sm:py-4 gap-4">
        {/* Left Section - Title & Column Toggle */}
        <div className="flex items-center gap-2 relative">
          <h1 className="font-semibold text-2xl sm:text-3xl">Items</h1>
          <div>
            <Tally3
              onClick={() => setShowColumns(!showColumns)}
              className={`text-4xl font-thin bg-white mt-[8px] opacity-50 hover:opacity-100 rounded-sm pl-1 cursor-pointer transition ${
                showColumns ? "outline outline-2 outline-green-500" : ""
              }`}
            />
            <AnimatePresence>
              {showColumns && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: showColumns ? 1 : 0,
                    y: showColumns ? 0 : -10,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-60 bg-white shadow-md p-3 rounded z-10"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modified Search Bar */}
        <div className="flex items-center px-6 py-1 sm:px-8 sm:py-2 rounded-full bg-white border border-gray-200 w-full sm:w-1/3 overflow-hidden">
          {/* Search Icon */}
          <div className="flex-shrink-0">
            <Search className="h-5 w-5 text-gray-500" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 min-w-0 outline-none px-2 sm:px-3"
          />

          {/* QR Code Icon */}
          <button
            onClick={openSearchScanModal}
            className="flex-shrink-0 flex items-center"
            title="Scan Barcode"
          >
            <QrCode className="h-5 w-5 text-blue-500" />
          </button>
        </div>

        {/* Filters & Add Button */}
        <div className="flex items-center gap-2">
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

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowItemForm(true)}
            className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition flex items-center gap-1"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Item</span>
          </motion.button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto flex-1 bg-white rounded-lg shadow my custom-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {visibleColumns.image && (
                <th>
                  <div className="flex items-center px-4 py-3 text-left text-xs font-bold">
                    Image
                  </div>
                </th>
              )}
              <th>
                <div
                  className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name
                  <span
                    className={`ml-1 ${
                      sortColumn === "name"
                        ? sortOrder === "asc"
                          ? "text-blue-500"
                          : "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {sortColumn === "name" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </span>
                </div>
              </th>
              {visibleColumns.category && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    Category
                    <span
                      className={`ml-1 ${
                        sortColumn === "category"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "category" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.storeLocation && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("storeLocation")}
                  >
                    Store Location
                    <span
                      className={`ml-1 ${
                        sortColumn === "storeLocation"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "storeLocation" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.purchaseDate && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("purchaseDate")}
                  >
                    Purchase Date
                    <span
                      className={`ml-1 ${
                        sortColumn === "purchaseDate"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "purchaseDate" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.expiryDate && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("expiryDate")}
                  >
                    Expiry Date
                    <span
                      className={`ml-1 ${
                        sortColumn === "expiryDate"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "expiryDate" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.quantity && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    Quantity
                    <span
                      className={`ml-1 ${
                        sortColumn === "quantity"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "quantity" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.value && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("value")}
                  >
                    Value
                    <span
                      className={`ml-1 ${
                        sortColumn === "value"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "value" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.notes && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("notes")}
                  >
                    Notes
                    <span
                      className={`ml-1 ${
                        sortColumn === "notes"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "notes" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.serialNumber && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("serialNumber")}
                  >
                    Serial Number
                    <span
                      className={`ml-1 ${
                        sortColumn === "serialNumber"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "serialNumber" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.purchaseLocation && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("purchaseLocation")}
                  >
                    Purchase Location
                    <span
                      className={`ml-1 ${
                        sortColumn === "purchaseLocation"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "purchaseLocation" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th>
                  <div
                    className="flex items-center px-4 py-3 text-left text-xs font-bold cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At
                    <span
                      className={`ml-1 ${
                        sortColumn === "createdAt"
                          ? sortOrder === "asc"
                            ? "text-blue-500"
                            : "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {sortColumn === "createdAt" ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} />
                      )}
                    </span>
                  </div>
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
                    <td className="px-4 py-3">{item.value || "-"}</td>
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
                  <td className=" flex justify-start items-center gap-3 px-4 py-3">
                    <Link
                      to={`/item/edit/${item._id}`}
                      state={{ from: location.pathname }}
                    >
                      <PencilOff className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                    >
                      {" "}
                      <View className="h-5 w-5" />
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      onClick={() => {
                        SetDeleteItemId(item._id);
                        setShowDeleteConfirm(true);
                      }}
                    >
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
      {showItemForm && <ItemForm onClose={() => setShowItemForm(false)} />}
      {showDeleteConfirm && (
        <DeleteItem
          onCancel={() => {
            setShowDeleteConfirm(false);
            SetDeleteItemId(null);
          }}
          deleteItem={deleteItemId}
        />
      )}
      {/* Search Scanner Modal */}
      {searchScanModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white relative p-6 rounded-lg w-full max-w-md shadow-lg">
            <button
              onClick={() => {
                searchStopScanner();
                setSearchScanModalOpen(false);
              }}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition z-10"
              title="Close Scanner"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              id="scanner"
              ref={searchScannerRef}
              className="w-full h-72 sm:h-80 mb-4 rounded-lg"
            ></div>
            <p className="text-center text-gray-700 text-sm">
              Point your camera at a barcode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemTable;
