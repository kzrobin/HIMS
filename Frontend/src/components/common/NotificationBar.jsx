import React, { useState } from "react";
import { Bell, X } from "lucide-react";

export const NotificationBar = ({ message, type = "info" }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    info: "bg-blue-600",
    success: "bg-green-600",
    warning: "bg-amber-500",
    error: "bg-red-600",
  };

  return (
    <div
      className={`${bgColors[type]} text-white px-4 py-2 rounded-md w-full sm:w-3/4 md:w-1/2 mx-auto`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
