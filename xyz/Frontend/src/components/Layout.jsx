import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import NotificationBell from "./NotificationBell";
import SideBar from "./SideBar";
import { Link } from "react-router-dom";
import SubscriptionCard from "./SubscriptionCard";

const Layout = ({ children }) => {
  const { user } = useContext(UserDataContext);

  console.log(user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between border py-2 sm:py-4 px-2 sm:px-8"
      >
        <Link to="/dashboard" className="flex gap-2 justify-start items-start">
          <Package className="h-10 w-10 text-[#3BCD5B]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#1C542A] hidden sm:block">
            Home Inventory
          </h1>
        </Link>
        {/* Notification bell */}
        <div className="flex items-center relative">
          <Link to="/profile">Profile</Link>
          <NotificationBell />
          <div className="min-w-full">
            <img
              src={user.profilePicture}
              alt="profile"
              className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full ml-4 cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </motion.div>
      {isSidebarOpen && (
        <div className="fixed z-10" onClick={toggleSidebar}></div>
      )}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isSidebarOpen ? "0%" : "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-[80px] right-0 w-[280px] shadow-lg z-20"
      >
        <SideBar closeSidebar={toggleSidebar} />
      </motion.div>

      <div className="flex-1 bg-[#F9F9F9] w-full overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
