import React from "react";
import { Check, Crown } from "lucide-react";
import { Button } from "./Button";

const SubscriptionCard = ({ tier, onSubscribe, isCurrentPlan }) => {
  const features = {
    free: [
      "Basic inventory management",
      "Up to 100 items",
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
    ],
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-xl ${
        tier === "premium"
          ? "bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-400"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-2xl font-bold ${
            tier === "premium" ? "text-amber-700" : "text-gray-900"
          }`}
        >
          {tier === "premium" ? (
            <div className="flex items-center">
              <Crown className="h-6 w-6 mr-2 text-amber-600" />
              Premium
            </div>
          ) : (
            "Free"
          )}
        </h3>
        <div className="text-2xl font-bold">
          {tier === "premium" ? "$9.99" : "$0"}
          <span className="text-sm text-gray-600">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features[tier].map((feature) => (
          <li key={feature} className="flex items-start">
            <Check
              className={`h-5 w-5 mr-2 flex-shrink-0 ${
                tier === "premium" ? "text-amber-600" : "text-blue-600"
              }`}
            />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        className={`w-full ${
          tier === "premium"
            ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            : ""
        }`}
        disabled={isCurrentPlan}
      >
        {isCurrentPlan
          ? "Current Plan"
          : `Get ${tier === "premium" ? "Premium" : "Started"}`}
      </Button>
    </div>
  );
};

export default SubscriptionCard;
