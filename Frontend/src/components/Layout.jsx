import React, { useContext, useState, useEffect } from "react";
import { UserDataContext } from "../context/UserContext";
import { Package, AlertCircle, Crown, X, Menu } from "lucide-react";
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";
import SideBar from "./SideBar";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTrialAlert, setShowTrialAlert] = useState(false);
  const [trialEnded, setTrialEnded] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Trial period calculation
  useEffect(() => {
    if (!user) return;

    // Reset states if user is premium
    if (user.isPremium) {
      setTrialEnded(false);
      setShowTrialAlert(false);
      setRemainingTime(null);
      return; // Exit early for premium users
    }

    const trialEndDate = new Date(user.trialEndDate);
    const currentDate = new Date();
    const timeDifference = trialEndDate - currentDate;

    if (timeDifference <= 0) {
      setTrialEnded(true);
      setShowTrialAlert(false);
      setRemainingTime(0);
    } else if (timeDifference <= 3 * 24 * 60 * 60 * 1000) {
      // 3 days warning
      setShowTrialAlert(true);
      setTrialEnded(false);
      setRemainingTime(timeDifference);
    } else {
      setRemainingTime(timeDifference);
    }

    // Update timer every minute, but only for non-premium users
    const timer = setInterval(() => {
      if (user.isPremium) {
        setTrialEnded(false);
        setShowTrialAlert(false);
        setRemainingTime(null);
        return;
      }

      const newTimeDiff = trialEndDate - new Date();
      setRemainingTime(newTimeDiff > 0 ? newTimeDiff : 0);
      if (newTimeDiff <= 0) {
        setTrialEnded(true);
        setShowTrialAlert(false);
      } else if (newTimeDiff <= 3 * 24 * 60 * 60 * 1000) {
        setShowTrialAlert(true);
        setTrialEnded(false);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [user]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Format remaining time
  const formatTimeLeft = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0)
      return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${
        hours !== 1 ? "s" : ""
      }`;
    if (hours > 0)
      return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }`;
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#F9FAF5]">
      {/* Alerts */}
      {(trialEnded || showTrialAlert) && !user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between ${
            trialEnded
              ? "bg-red-100 border-l-4 border-red-500 text-red-700"
              : "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
          }`}
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <div>
              <p className="font-bold">
                {trialEnded ? "Free Trial Ended" : "Free Trial Expiring Soon"}
              </p>
              <p>
                {trialEnded
                  ? "Your free trial has expired."
                  : `Your free trial ends in ${formatTimeLeft(remainingTime)}.`}
                <Link
                  to="/subscription"
                  className="underline ml-1 hover:text-opacity-80"
                >
                  Upgrade to premium
                </Link>
                {trialEnded
                  ? " to continue using HomeHaven."
                  : " to keep your features uninterrupted."}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              trialEnded ? setTrialEnded(false) : setShowTrialAlert(false)
            }
            className={`hover:text-opacity-80 ${
              trialEnded ? "text-red-700" : "text-yellow-700"
            }`}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md py-2 sm:py-4 px-4 sm:px-8 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Package className="h-8 w-8 sm:h-10 sm:w-10 text-[#588157]" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#344E41] hidden sm:block">
              HomeHaven
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          {!user?.isPremium && (
            <>
              {/* Desktop Upgrade Button */}
              <Link
                to="/subscription"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all text-sm font-medium"
              >
                <Crown size={16} />
                Upgrade Plan
              </Link>
              {/* Mobile Upgrade Icon */}
              <Link
                to="/subscription"
                className="sm:hidden p-2 rounded-full bg-[#8B7E66] hover:bg-[#6B6651] transition-all"
                title="Upgrade Plan"
              >
                <Crown size={20} className="text-white" />
              </Link>
            </>
          )}
          <NotificationBell />
          <img
            src={user?.profilePicture || "https://via.placeholder.com/60"}
            alt="Profile"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#588157] cursor-pointer object-cover"
            onClick={toggleSidebar}
            title={`${user?.fullname?.firstname || "User"} ${
              user?.fullname?.lastname || ""
            }`}
          />
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden bg-white shadow-lg p-4 absolute top-[60px] left-0 right-0 z-30"
        >
          <Link
            to="/dashboard"
            className="block py-2 text-[#344E41] hover:text-[#588157] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {!user?.isPremium && (
            <Link
              to="/subscription"
              className="block py-2 text-[#344E41] hover:text-[#588157] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upgrade Plan
            </Link>
          )}
          <Link
            to="/settings"
            className="block py-2 text-[#344E41] hover:text-[#588157] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Settings
          </Link>
        </motion.div>
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? "0%" : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-[60px] sm:top-[80px] right-0 w-64 sm:w-72 shadow-lg z-50 bg-white h-[calc(100%-60px)] sm:h-[calc(100%-80px)]"
      >
        <SideBar closeSidebar={toggleSidebar} />
      </motion.div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F9F9F9]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
