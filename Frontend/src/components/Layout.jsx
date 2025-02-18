import React, { useContext, useState, useEffect } from "react";
import { UserDataContext } from "../context/UserContext";
import { Package, AlertCircle, Crown } from "lucide-react"; // Import Crown icon for mobile
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTrialAlert, setShowTrialAlert] = useState(false);
  const [trialEnded, setTrialEnded] = useState(false);

  useEffect(() => {
    if (user && !user.isPremium) {
      const trialEndDate = new Date(user.trialEndDate);
      const currentDate = new Date();

      // Check if the trial has ended
      if (currentDate > trialEndDate) {
        setTrialEnded(true);
      }

      // Check if the trial is about to end (within 3 days)
      if (trialEndDate - currentDate <= 3 * 24 * 60 * 60 * 1000) {
        setShowTrialAlert(true);
      }
    }
  }, [user]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative">
      {/* Trial Ended Alert */}
      {trialEnded && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center justify-between" role="alert">
          <div>
            <p className="font-bold">Free Trial Ended</p>
            <p>Your free trial has expired. <Link to="/subscription" className="underline">Upgrade to premium</Link> to continue using our services.</p>
          </div>
          <button onClick={() => setTrialEnded(false)} className="text-red-700 hover:text-red-900">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Trial Expiring Soon Alert */}
      {showTrialAlert && !trialEnded && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center justify-between" role="alert">
          <div>
            <p className="font-bold">Free Trial Expiring Soon</p>
            <p>Your free trial will end in 3 days. <Link to="/subscription" className="underline">Upgrade to premium</Link> to continue enjoying our services.</p>
          </div>
          <button onClick={() => setShowTrialAlert(false)} className="text-yellow-700 hover:text-yellow-900">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between border py-2 sm:py-4 px-2 sm:px-8"
      >
        <Link to="/dashboard" className="title flex gap-2 justify-start items-start">
          <Package className="title h-10 w-10 text-[#3BCD5B]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#1C542A] hidden sm:block title">Home Inventory</h1>
        </Link>
        <div className="flex items-center relative">
          {/* Upgrade Plan Button (Desktop) */}
          {!user.isPremium && (
            <>
              <Link
                to="/subscription"
                className="hidden sm:flex mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Upgrade Plan
              </Link>
              {/* Upgrade Plan Icon (Mobile) */}
              <Link
                to="/subscription"
                className="sm:hidden flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                title="Upgrade Plan"
              >
                <Crown size={20} className="text-white" />
              </Link>
            </>
          )}
          <NotificationBell />
          <img
            src={user.profilePicture}
            alt="profile"
            className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full ml-4 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
      </motion.div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed z-10" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? "0%" : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-[80px] right-0 w-[280px] shadow-lg z-20"
      >
        <SideBar closeSidebar={toggleSidebar} />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 bg-[#F9F9F9] w-full overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;