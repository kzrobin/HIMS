import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Button } from "./Button";
import { UserDataContext } from "../context/UserContext";

const Navbar = ({ login = true, signup = true }) => {
  const { user } = useContext(UserDataContext);
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <Package className="h-10 w-10 text-white" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Home Inventory
            </h1>
          </motion.div>

          {!user && (
            <div className="flex items-center space-x-6">
              {login && (
                <Link to="/login" className="hidden md:block">
                  <Button
                    variant="secondary"
                    className="text-white hover:bg-indigo-600 transition-all"
                  >
                    Login
                  </Button>
                </Link>
              )}
              {signup && (
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>
          )}

          {user && <div></div>}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
