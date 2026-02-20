import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { UserDataContext } from "../../context/UserContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const ReportExpairy = () => {
  const { items, getItems } = useContext(UserDataContext);
  const [expired, setExpired] = useState([]);
  const [expiringThisWeek, setExpiringThisWeek] = useState([]);
  const [expiringThisMonth, setExpiringThisMonth] = useState([]);
  const [noExpiry, setNoExpiry] = useState([]);

  // Toggle states for section content
  const [showExpired, setShowExpired] = useState(true);
  const [showWeek, setShowWeek] = useState(true);
  const [showMonth, setShowMonth] = useState(true);
  const [showNoExpiry, setShowNoExpiry] = useState(true);
  const location = useLocation();

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(today.getDate() + 7);
    const monthLater = new Date();
    monthLater.setDate(today.getDate() + 30);

    const expiredItems = [];
    const weekItems = [];
    const monthItems = [];
    const noExpiryItems = [];

    items.forEach((item) => {
      if (!item.expiryDate) {
        noExpiryItems.push(item);
        return;
      }
      const expiry = new Date(item.expiryDate);
      if (expiry < today) {
        expiredItems.push(item);
      } else if (expiry >= today && expiry <= weekLater) {
        weekItems.push(item);
      } else if (expiry > weekLater && expiry <= monthLater) {
        monthItems.push(item);
      }
    });

    setExpired(expiredItems);
    setExpiringThisWeek(weekItems);
    setExpiringThisMonth(monthItems);
    setNoExpiry(noExpiryItems);
  }, [items]);

  // Updated item card style: width fit, capped to 50% of parent
  const itemCardClass =
    "bg-gray-50 border rounded p-4 shadow-sm w-fit max-w-[45%]";

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">Expiry Report</h1>
        {/* Each section takes full width */}
        <div className="flex flex-col gap-6">
          {/* Already Expired Section */}
          <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <h2
              onClick={() => setShowExpired((prev) => !prev)}
              className="text-xl font-semibold mb-3 cursor-pointer select-none flex items-center justify-between"
            >
              <span>Already Expired ({expired.length})</span>
              {showExpired ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </h2>
            {showExpired &&
              (expired.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {expired.map((item) => (
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                      className={itemCardClass}
                    >
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Expired on{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No expired items.</p>
              ))}
          </div>

          {/* Expiring This Week Section */}
          <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <h2
              onClick={() => setShowWeek((prev) => !prev)}
              className="text-xl font-semibold mb-3 cursor-pointer select-none flex items-center justify-between"
            >
              <span>Expiring This Week ({expiringThisWeek.length})</span>
              {showWeek ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </h2>
            {showWeek &&
              (expiringThisWeek.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {expiringThisWeek.map((item) => (
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                      key={item._id}
                      className={itemCardClass}
                    >
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Expires on{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No items expiring this week.</p>
              ))}
          </div>

          {/* Expiring This Month Section */}
          <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <h2
              onClick={() => setShowMonth((prev) => !prev)}
              className="text-xl font-semibold mb-3 cursor-pointer select-none flex items-center justify-between"
            >
              <span>Expiring This Month ({expiringThisMonth.length})</span>
              {showMonth ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </h2>
            {showMonth &&
              (expiringThisMonth.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {expiringThisMonth.map((item) => (
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                      key={item._id}
                      className={itemCardClass}
                    >
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Expires on{" "}
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No items expiring this month.</p>
              ))}
          </div>

          {/* No Expiry Date Section */}
          <div className="bg-white rounded-lg shadow-md p-4 w-full">
            <h2
              onClick={() => setShowNoExpiry((prev) => !prev)}
              className="text-xl font-semibold mb-3 cursor-pointer select-none flex items-center justify-between"
            >
              <span>No Expiry Date ({noExpiry.length})</span>
              {showNoExpiry ? (
                <ChevronUp className="ml-2" />
              ) : (
                <ChevronDown className="ml-2" />
              )}
            </h2>
            {showNoExpiry &&
              (noExpiry.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {noExpiry.map((item) => (
                    <Link
                      to={`/item/${item._id}`}
                      state={{ from: location.pathname }}
                      key={item._id}
                      className={itemCardClass}
                    >
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">All items have expiry dates.</p>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportExpairy;
