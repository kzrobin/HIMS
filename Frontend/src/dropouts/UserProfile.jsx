import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Crown, ShieldCheck, ShieldX } from "lucide-react";

const UserProfile = () => {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#F9FAF5] px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-[#A3B18A] to-[#588157] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#F9FAF5] object-cover shadow-md"
          />
          <div className="text-center sm:text-left text-[#F9FAF5]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {user.fullname.firstname} {user.fullname.lastname}
            </h1>
            <p className="text-sm sm:text-base opacity-90 mt-1 truncate max-w-[300px]">
              {user.email}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 justify-center sm:justify-start">
              <span
                className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                  user.isPremium
                    ? "bg-[#8B7E66] text-[#F9FAF5]"
                    : "bg-[#F9FAF5] text-[#344E41]"
                }`}
              >
                <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                {user.isPremium ? "Premium" : "Free"}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                  user.isAccountVerified
                    ? "bg-[#588157] text-[#F9FAF5]"
                    : "bg-[#DAD7CD] text-[#344E41]"
                }`}
              >
                {user.isAccountVerified ? (
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <ShieldX className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
                {user.isAccountVerified ? "Verified" : "Not Verified"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#344E41] mb-6">
            Account Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                <span className="text-sm font-medium text-[#344E41] opacity-70">
                  First Name
                </span>
                <span className="text-sm sm:text-base text-[#344E41] font-semibold">
                  {user.fullname.firstname}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                <span className="text-sm font-medium text-[#344E41] opacity-70">
                  Last Name
                </span>
                <span className="text-sm sm:text-base text-[#344E41] font-semibold">
                  {user.fullname.lastname}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                <span className="text-sm font-medium text-[#344E41] opacity-70">
                  Email
                </span>
                <span className="text-sm sm:text-base text-[#344E41] font-semibold truncate max-w-[200px]">
                  {user.email}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                <span className="text-sm font-medium text-[#344E41] opacity-70">
                  Account Status
                </span>
                <span
                  className={`text-sm sm:text-base font-semibold flex items-center gap-1 ${
                    user.isAccountVerified ? "text-[#588157]" : "text-red-600"
                  }`}
                >
                  {user.isAccountVerified ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <ShieldX className="h-4 w-4" />
                  )}
                  {user.isAccountVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                <span className="text-sm font-medium text-[#344E41] opacity-70">
                  Plan
                </span>
                <span
                  className={`text-sm sm:text-base font-semibold flex items-center gap-1 ${
                    user.isPremium ? "text-[#8B7E66]" : "text-[#344E41]"
                  }`}
                >
                  <Crown className="h-4 w-4" />
                  {user.isPremium ? "Premium" : "Free"}
                </span>
              </div>
              {user.trialEndDate && !user.isPremium && (
                <div className="flex justify-between items-center py-2 border-b border-[#588157] border-opacity-20">
                  <span className="text-sm font-medium text-[#344E41] opacity-70">
                    Trial Ends
                  </span>
                  <span className="text-sm sm:text-base text-[#344E41] font-semibold">
                    {new Date(user.trialEndDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            {!user.isAccountVerified && (
              <Link to="/verify">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#344E41] transition-all text-sm sm:text-base font-medium shadow-md"
                >
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  Verify Account
                </motion.button>
              </Link>
            )}
            <Link to="/profile-update">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-[#588157] text-white rounded-lg hover:bg-[#344E41] transition-all text-sm sm:text-base font-medium shadow-md"
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                Edit Profile
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
