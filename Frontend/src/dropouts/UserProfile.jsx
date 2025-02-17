import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F9F9] roune-l p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#3BCD5B]"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C542A]">
              {user.fullname.firstname} {user.fullname.lastname}
            </h1>
            <p className="text-gray-600 mt-2">{user.email}</p>
            <div className="flex gap-2 mt-4 justify-center sm:justify-start">
              <span className="bg-[#3BCD5B] text-white px-3 py-1 rounded-full text-sm">
                {user.isPremium ? "Premium User" : "Free User"}
              </span>
              <span
                className={`${
                  user.isAccountVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                } px-3 py-1 rounded-full text-sm`}
              >
                {user.isAccountVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1C542A] mb-4">
            Account Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">First Name</span>
              <span className="text-[#1C542A] font-medium">
                {user.fullname.firstname}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Last Name</span>
              <span className="text-[#1C542A] font-medium">
                {user.fullname.lastname}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Email</span>
              <span className="text-[#1C542A] font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Account Status</span>
              <span
                className={`${
                  user.isAccountVerified ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                {user.isAccountVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Subscription Plan</span>
              <span
                className={`${
                  user.isPremium ? "text-[#3BCD5B]" : "text-gray-600"
                } font-medium`}
              >
                {user.isPremium ? "Premium" : "Free"}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <Link to="/profile-update" className="mt-8 flex justify-end gap-4">
          <button className="bg-[#3BCD5B] text-white px-3 tetx-sm sm:text-base  sm:px-6 py-2 rounded-lg hover:bg-[#1C542A] transition-colors">
            Update Profile and Password
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
