import React from "react";
import { Crown } from "lucide-react";

export const PremiumBadge = () => {
  return (
    <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-sm font-semibold">
      <Crown className="h-4 w-4 mr-1" />
      Premium
    </div>
  );
};
