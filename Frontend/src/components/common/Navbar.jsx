import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserDataContext } from "../../context/UserContext";
import { Home } from "lucide-react";
export const Navbar = ({ login = true, signup = true }) => {
  const { user } = useContext(UserDataContext);
  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="flex items-center space-x-3"
        >
          <Home className="h-8 w-8 sm:h-10 sm:w-10 text-[#F9FAF5]" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            HomeHaven
          </h1>
        </motion.div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link to="/login">
            <button className="px-4 py-2 sm:px-6 sm:py-2 text-[#588157] bg-white rounded-lg hover:bg-[#DAD7CD] transition-all duration-300 text-sm sm:text-base">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-[#8B7E66] text-white rounded-lg hover:bg-[#6B6651] transition-all duration-300 text-sm sm:text-base">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
