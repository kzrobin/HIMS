// UpgradeModal.js
import React from "react";

const UpgradeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Upgrade Your Plan
        </h2>
        <p className="text-center text-lg mb-6">
          It looks like you've reached your item limit. Upgrade to a premium
          plan to add more items and enjoy additional features!
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md focus:outline-none hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-indigo-500 text-white px-6 py-2 rounded-md focus:outline-none hover:bg-indigo-600"
            onClick={() => (window.location.href = "/pricing")} // Redirect to pricing page
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
