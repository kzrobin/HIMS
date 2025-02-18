import React from "react";
import { Check, Crown } from "lucide-react";
import { Button } from "./Button";

const SubscriptionCard = ({ tier, onSubscribe, isCurrentPlan }) => {
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
      "Receipt & document storage",
      "Advanced analytics",
      "Export/Import functionality",
      "Priority support",
      "Family sharing (up to 5 members)",
      "Custom locations and rooms",
      "Barcode scanning",
      "7-day free trial for all premium features",
    ],
  };

  return (
    <div
      className={`p-8 rounded-2xl shadow-lg ${
        tier === "premium"
          ? "bg-gradient-to-br from-[#3BCD5B] to-[#1C542A] text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-3xl font-bold ${
            tier === "premium" ? "text-white" : "text-[#1C542A]"
          }`}
        >
          {tier === "premium" ? (
            <div className="flex items-center">
              <Crown className="h-8 w-8 mr-2 text-amber-300" />
              Premium
            </div>
          ) : (
            "Free"
          )}
        </h3>
        <div
          className={`text-3xl font-bold ${
            tier === "premium" ? "text-white" : "text-[#1C542A]"
          }`}
        >
          {tier === "premium" ? "$9.99" : "$0"}
          <span className="text-sm text-gray-400">/month</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features[tier].map((feature) => (
          <li key={feature} className="flex items-start">
            <Check
              className={`h-6 w-6 mr-3 flex-shrink-0 ${
                tier === "premium" ? "text-amber-300" : "text-[#3BCD5B]"
              }`}
            />
            <span
              className={`${
                tier === "premium" ? "text-white" : "text-gray-700"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        className={`w-full ${
          tier === "premium"
            ? "bg-white text-[#1C542A] hover:bg-gray-100"
            : "bg-[#3BCD5B] text-white hover:bg-[#1C542A]"
        }`}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan
          ? "Current Plan"
          : `Get ${tier === "premium" ? "Premium" : "Started"}`}
      </Button>

      {tier === "premium" && (
        <p className="mt-4 text-sm text-center text-amber-200">
          Start your 7-day free trial today!
        </p>
      )}
    </div>
  );
};

export default SubscriptionCard;
