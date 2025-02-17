import React, { useState, useEffect, useMemo, useContext } from "react";
import { Bell } from "lucide-react";
import { UserDataContext } from "../context/UserContext";

const NotificationBell = ({ subscriptionEndDate }) => {
  const { items, user } = useContext(UserDataContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Memoize items and subscriptionEndDate to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items || [], [items]);
  const memoizedSubscriptionEndDate = useMemo(
    () => subscriptionEndDate,
    [subscriptionEndDate]
  );

  useEffect(() => {
    const today = new Date();
    const newNotifications = [];

    // Ensure items is always an array
    memoizedItems.forEach((item) => {
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        if (!isNaN(expiryDate.getTime())) {
          const daysUntilExpiry = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );
          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            newNotifications.push({
              id: `expiry-${item.id}`,
              title: "Item Expiring Soon",
              message: `${item.name} will expire in ${daysUntilExpiry} days`,
              type: "expiry",
              date: item.expiryDate,
              itemId: item.id,
            });
          }
        }
      }

      if (item.warranty) {
        const warrantyDate = new Date(item.warranty);
        if (!isNaN(warrantyDate.getTime())) {
          const daysUntilWarrantyExpiry = Math.ceil(
            (warrantyDate - today) / (1000 * 60 * 60 * 24)
          );
          if (daysUntilWarrantyExpiry <= 30 && daysUntilWarrantyExpiry > 0) {
            newNotifications.push({
              id: `warranty-${item.id}`,
              title: "Warranty Expiring",
              message: `Warranty for ${item.name} will expire in ${daysUntilWarrantyExpiry} days`,
              type: "warranty",
              date: item.warranty,
              itemId: item.id,
            });
          }
        }
      }
    });

    // Check subscription expiry
    if (memoizedSubscriptionEndDate) {
      const subscriptionEnd = new Date(memoizedSubscriptionEndDate);
      if (!isNaN(subscriptionEnd.getTime())) {
        const daysUntilSubscriptionEnd = Math.ceil(
          (subscriptionEnd - today) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilSubscriptionEnd <= 7 && daysUntilSubscriptionEnd > 0) {
          newNotifications.push({
            id: "subscription",
            title: "Subscription Ending Soon",
            message: `Your premium subscription will end in ${daysUntilSubscriptionEnd} days`,
            type: "subscription",
            date: memoizedSubscriptionEndDate,
          });
        }
      }
    }

    // Sort notifications by date
    newNotifications.sort((a, b) => new Date(a.date) - new Date(b.date));

    // ✅ Only update state if the notifications list has changed
    setNotifications((prevNotifications) => {
      const isSame =
        prevNotifications.length === newNotifications.length &&
        prevNotifications.every(
          (notif, index) => notif.id === newNotifications[index].id
        );

      return isSame ? prevNotifications : newNotifications;
    });
  }, [memoizedItems, memoizedSubscriptionEndDate]);

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case "expiry":
        return "text-red-600";
      case "warranty":
        return "text-amber-600";
      case "subscription":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {notification.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                </div>
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
