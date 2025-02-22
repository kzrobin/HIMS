import React, { useState, useEffect, useMemo, useContext } from "react";
import { Bell, AlertTriangle } from "lucide-react"; // Only expiry icon needed
import { UserDataContext } from "../context/UserContext";
import { Link, useLocation } from "react-router-dom";

const NotificationBell = () => {
  const { items, user } = useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  const memoizedItems = useMemo(() => items || [], [items]);

  useEffect(() => {
    const today = new Date();
    const newNotifications = [];

    // Add only expiration notifications for items
    memoizedItems.forEach((item) => {
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        if (!isNaN(expiryDate.getTime())) {
          const daysUntilExpiry = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );
          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            newNotifications.push({
              id: item._id,
              // Removed repeated title from each notification
              message: `${item.name} expires in ${daysUntilExpiry} day${
                daysUntilExpiry > 1 ? "s" : ""
              }.`,
              type: "expiry",
              date: item.expiryDate,
            });
          }
        }
      }
    });

    newNotifications.sort((a, b) => new Date(a.date) - new Date(b.date));

    setNotifications((prev) => {
      const same =
        prev.length === newNotifications.length &&
        prev.every((n, index) => n.id === newNotifications[index].id);
      return same ? prev : newNotifications;
    });
  }, [memoizedItems]);

  // Helper to render the expiry icon
  const getNotificationIcon = () => (
    <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Upcoming Expiry Alerts</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <Link
                  to={`/item/${n.id}`}
                  state={{ from: location.pathname }}
                  className="flex items-start px-4 py-3 border-b hover:bg-gray-50 transition-colors"
                >
                  {getNotificationIcon()}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {new Date(n.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{n.message}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
