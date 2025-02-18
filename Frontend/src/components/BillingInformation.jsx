import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BillingInformation = ({ onNext, onBack }) => {
  const [billingAddress, setBillingAddress] = useState({
    country: "",
    addressLine1: "",
    addressLine2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate fields (e.g., ensure country and addressLine1 are filled)
    if (!billingAddress.country || !billingAddress.addressLine1) {
      alert("Please fill in all required fields.");
      return;
    }
    // Proceed to the next step
    onNext(billingAddress);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Billing Information
      </h2>

      {/* Progress Indicator */}
      <div className="flex justify-between mb-6">
        <span className="text-sm text-gray-600">Select Plan</span>
        <span className="text-sm text-gray-600">Billing Information</span>
        <span className="text-sm text-gray-400">Payment Method</span>
        <span className="text-sm text-gray-400">Confirmation</span>
      </div>

      {/* Billing Address Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Country Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={billingAddress.country}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#3BCD5B] focus:border-[#3BCD5B]"
              placeholder="Select your country"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Can't find your country? Please contact us.
            </p>
          </div>

          {/* Address Line 1 Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              value={billingAddress.addressLine1}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#3BCD5B] focus:border-[#3BCD5B]"
              placeholder="Street and number, P.O. box, C/O"
              required
            />
          </div>

          {/* Address Line 2 Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={billingAddress.addressLine2}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#3BCD5B] focus:border-[#3BCD5B]"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#3BCD5B] text-white rounded-lg hover:bg-[#1C542A] transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingInformation;
