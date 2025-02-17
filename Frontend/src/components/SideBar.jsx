import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { X, LayoutDashboard, User, File, ShieldAlert } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const SideBar = ({ closeSidebar }) => {
  const { user, backendUrl } = useContext(UserDataContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      path: "/profile",
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      path: "/report",
      icon: <File size={20} />,
      label: "Report",
    },
  ];

  // Add verification item if account is not verified
  if (!user?.isAccountVerified) {
    navItems.unshift({
      path: "/verify",
      icon: <ShieldAlert size={20} />,
      label: "Verify Account",
    });
  }

  const logout = async () => {
    navigate("/logout");
  };

  return (
    <div className="flex flex-col bg-[#fdfdfd] h-[calc(100vh-80px)] rounded-md py-4 sm:py-6 border w-64 shadow-md">
      {/* Close Button */}
      <div className="flex justify-start px-4 mb-4">
        <button
          onClick={closeSidebar}
          className="text-gray-700 hover:text-black transition-colors p-1 rounded-full hover:bg-[#f0eaea]"
        >
          <X size={24} />
        </button>
      </div>

      {/* User Profile Section */}
      <Link
        to="/profile"
        className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm mx-4 w-[88%]"
      >
        <img
          src={user?.profilePicture || "/image.svg"}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col w-[75%]">
          <div className="text-lg font-semibold text-[#080809] overflow-hidden text-ellipsis whitespace-nowrap">
            {user?.fullname?.firstname || "Guest"}{" "}
            {user?.fullname?.lastname || ""}
          </div>
          <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {user?.email || "No email"}
          </div>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex flex-col mt-6 space-y-1 px-4">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => {
              navigate(item.path);
              closeSidebar(); // Close sidebar on navigation
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              location.pathname === item.path
                ? "bg-[#3bcd5b9a] text-white"
                : "text-gray-700 hover:bg-[#f2f2f2]"
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="mt-auto px-4">
        <button
          onClick={logout}
          className="w-full mt-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
