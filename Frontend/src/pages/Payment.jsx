import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle,
  Check,
} from "lucide-react";
import Layout from "../components/Layout";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { backendUrl, user } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const validateField = (name, value) => {
    let errorMessage = "";

    if (name === "cardNumber") {
      if (!/^\d{16}$/.test(value)) {
        errorMessage = "Card number must be exactly 16 digits.";
      }
    }

    if (name === "expiryDate") {
      const match = value.match(/^(\d{2})\/(\d{2})$/);
      if (!match) {
        errorMessage = "Expiry date must be in MM/YY format.";
      } else {
        const [_, month, year] = match;
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        if (
          parseInt(year) < currentYear ||
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)
        ) {
          errorMessage = "Card is expired.";
        }
      }
    }

    if (name === "cvv") {
      if (!/^\d{3,4}$/.test(value)) {
        errorMessage = "CVV must be 3 or 4 digits.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/users/subscribe-premium`,
        { withCredentials: true }
      );

      if (response.status == 200) {
        toast.success(
          "Payment Successful! 🎉 Thank you for subscribing to Premium. Enjoy exclusive features and benefits!"
        );
        return navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        "Payment failed. Please check your card details or try later"
      );
    }
  };

  useEffect(() => {
    if (user.isPremium === true) {
      toast("You are already a premium user");
      navigate("/dashboard");
    }
  }, []);
  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
        {/* Responsive Progress Status */}
        <div className="flex items-center justify-between mb-8">
          {/* Step 1: Billing Information */}
          <div className="flex flex-col items-center space-y-2 pt-5">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <div
              className={`text-sm ${
                step >= 1 ? "font-semibold" : "text-gray-500"
              }`}
            >
              <span className="hidden md:inline">Billing Information</span>
              <span className="md:hidden text-nowrap">Billing Info</span>
            </div>
          </div>

          {/* Connector 1 */}
          <div
            className={`w-16 md:w-32 h-px ${
              step >= 2 ? "bg-indigo-500" : "bg-gray-300"
            }`}
          ></div>

          {/* Step 2: Payment Method */}
          <div className="flex flex-col items-center space-y-2 pt-5">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <div
              className={`text-sm ${
                step >= 2 ? "font-semibold" : "text-gray-500"
              }`}
            >
              <span className="hidden md:inline">Payment Method</span>
              <span className="md:hidden text-nowrap">Payment M..</span>
            </div>
          </div>

          {/* Connector 2 */}
          <div
            className={`w-16 md:w-32 h-px ${
              step >= 3 ? "bg-indigo-500" : "bg-gray-300"
            }`}
          ></div>

          {/* Step 3: Confirmation */}
          <div className="flex flex-col items-center space-y-2 pt-5">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 3
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {step > 3 ? <Check className="w-4 h-4" /> : "3"}
            </div>
            <div
              className={`text-sm ${
                step >= 3 ? "font-semibold" : "text-gray-500"
              }`}
            >
              <span className="hidden md:inline">Confirmation</span>
              <span className="md:hidden">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step 1: Billing Information */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              handleNextStep(e);
            }}
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <MapPin className="mr-2" /> Billing Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={billingAddress.fullName}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Address<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={billingAddress.address}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  City<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={billingAddress.city}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  State<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={billingAddress.state}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="zip"
                  value={billingAddress.zip}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Country<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={billingAddress.country}
                  onChange={handleBillingChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-6">
              <ArrowLeft
                className="cursor-pointer"
                onClick={handlePreviousStep}
              />
              <h2 className="text-2xl font-semibold ml-2 flex items-center">
                <CreditCard className="mr-2" /> Payment Details
              </h2>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card Number<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CVV<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card Number<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  className={`mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:outline-none ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Expiry Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  className={`mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:outline-none ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              {/* CVV */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  CVV<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  className={`mt-1 px-3 py-2 block w-full border rounded-md shadow-sm focus:outline-none ${
                    errors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors"
              >
                Submit Payment
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
            <p className="text-gray-600">
              Your payment has been processed successfully.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payment;
