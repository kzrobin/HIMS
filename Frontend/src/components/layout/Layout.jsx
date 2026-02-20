import { UserDataContext } from "../../context/UserContext";
import NotificationBell from "../common/NotificationBell";
import SideBar from "../common/SideBar";

import React, { useContext, useState, useEffect } from "react";
import { Package, AlertCircle, Crown, X, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useContext(UserDataContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#F9FAF5]">
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
