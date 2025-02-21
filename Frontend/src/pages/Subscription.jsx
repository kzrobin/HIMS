import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { Package, Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";

const Subscription = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  console.log(user);
  const features = {
    free: [
      "Basic inventory management",
      "Add up to 25 items",
      "Basic categories",
      "Expiry tracking",
      "Basic search functionality",
    ],
    premium: [
      "Unlimited items",
      "Advanced categorization",
      "Custom tags and labels",
      "Item value tracking",
      "Warranty management",
      "Advanced analytics",
      "Export/Import functionality",
      "Priority support",
      "Custom locations and rooms",
      "7-day free trial for all premium features",
      "Lifetime access (one-time payment)",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-[#3BCD5B]" />
            <h1 className="ml-3 text-2xl font-bold text-[#1C542A]">
              Home Inventory Pricing
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1C542A] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your home inventory management needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl shadow-lg bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-[#1C542A]">Free</h3>
                <div className="text-3xl font-bold text-[#1C542A]">
                  $0<span className="text-sm text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.free.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-6 w-6 mr-3 flex-shrink-0 text-[#3BCD5B]" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-[#3BCD5B] text-white py-2 px-4 rounded-lg hover:bg-[#1C542A] transition-colors"
              >
                Get Started
              </button>
            </div>

            <div className="flex flex-col p-8 rounded-2xl shadow-lg bg-gradient-to-br from-[#3BCD5B] to-[#1C542A] text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold">
                  <div className="flex items-center">
                    <Crown className="h-8 w-8 mr-2 text-amber-300" />
                    Premium
                  </div>
                </h3>
                <div className="text-3xl font-bold">
                  $25<span className="text-sm text-amber-200"> (Lifetime)</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.premium.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-6 w-6 mr-3 flex-shrink-0 text-amber-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {user?.isPremium ? (
                <button
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-not-allowed"
                  disabled
                >
                  Already a Premium User
                </button>
              ) : (
                <Link
                  to={"/payment"}
                  className="w-full bg-white text-center text-[#1C542A] py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Premium
                </Link>
              )}

              {!user?.isPremium && (
                <p className="mt-4 text-sm text-center text-amber-200">
                  Start your 7-day free trial today!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer show={false} />
    </div>
  );
};

export default Subscription;
