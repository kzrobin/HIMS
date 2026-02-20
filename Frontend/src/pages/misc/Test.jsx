import React, { useState } from "react";
import { useBarcodeScanner } from "../../utils/BarCodeScanner";

const BarcodeScanner = () => {
  const {
    scannerRef,
    barcode,
    scanning,
    startScanner,
    setBarcode,
    stopScanner,
  } = useBarcodeScanner();
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const openModal = () => {
    setScanModalOpen(true);
    // Start the scanner after modal appears (optional delay)
    setTimeout(startScanner, 100);
  };

  const closeModal = () => {
    stopScanner(); // Ensure scanner is stopped so it can be reused later
    setScanModalOpen(false);
  };

  return (
    <div className="p-5">
      {/* Input with scan icon on the right */}
      <div className="relative w-full max-w-sm mx-auto mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Barcode:
        </label>
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="w-full px-3 py-2 border rounded shadow-sm pr-10"
          placeholder="Enter or scan barcode"
        />
        <button
          onClick={openModal}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          title="Scan Barcode"
        >
          <i className="fas fa-qrcode text-xl text-blue-500"></i>
        </button>
      </div>
      <p className="mb-2 text-gray-600 text-center">
        You may type manually or click the scan icon to scan.
      </p>

      {/* Modal overlay with centered scanner */}
      {scanModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white relative p-4 rounded-lg w-full max-w-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              title="Close Scanner"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <div
              id="scanner"
              ref={scannerRef}
              className="w-full h-60 border-2 border-black mb-4"
            ></div>
            <p className="text-center text-gray-700">
              Point your camera at a barcode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
