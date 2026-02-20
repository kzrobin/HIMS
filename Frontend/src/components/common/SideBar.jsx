import React, { useContext, useState } from "react";
import { UserDataContext } from "../../context/UserContext";
import { X, LayoutDashboard, User, File, ShieldAlert, LogOut, Crown } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

const SideBar = ({ closeSidebar }) => {
  const { user, setUser, backendUrl } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Navigation items
  const navItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
    { path: "/report", icon: <File size={20} />, label: "Report" },
  ];

  if (!user?.isAccountVerified) {
    navItems.unshift({
      path: "/verify",
      icon: <ShieldAlert size={20} />,
      label: "Verify Account",
    });
  }

  // Logout handler with modal
  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null); // Clear user context
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login"); // Proceed anyway if error occurs
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col bg-white h-[calc(100vh-60px)] sm:h-[calc(100vh-80px)] w-64 sm:w-72 border-l border-gray-200 shadow-lg py-4 sm:py-6"
    >
      {/* Close Button */}
      <div className="flex justify-end px-4 mb-4">
        <button
          onClick={closeSidebar}
          className="text-[#344E41] hover:text-[#588157] p-1 rounded-full hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#588157]"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* User Profile Section */}
      <Link
        to="/profile"
        className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg bg-[#F9FAF5] hover:bg-gray-100 transition-all shadow-sm"
        onClick={closeSidebar}
      >
        <img
          src={user?.profilePicture || "https://via.placeholder.com/48"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-[#588157]"
        />
        <div className="flex-1 min-w-0">
          <div className="text-base sm:text-lg font-semibold text-[#344E41] truncate">
            {user?.fullname?.firstname || "Guest"} {user?.fullname?.lastname || ""}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 truncate">{user?.email || "No email"}</div>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-6 space-y-1 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === item.path
                ? "bg-[#588157] text-white shadow-md"
                : "text-[#344E41] hover:bg-gray-100 hover:text-[#588157]"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>


      {/* Logout Button */}
      <div className="mt-auto px-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-2 bg-[#344E41] text-white rounded-lg hover:bg-[#588157] transition-all flex items-center justify-center gap-2 text-sm font-medium"
          aria-label="Log out"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h3 className="text-lg font-semibold text-[#344E41] mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out of your HomeHaven account?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-[#344E41] text-white rounded-lg hover:bg-[#588157] transition-all text-sm font-medium"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 bg-gray-200 text-[#344E41] rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SideBar;