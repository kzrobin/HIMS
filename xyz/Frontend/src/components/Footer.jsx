import React from "react";
import { Package } from "lucide-react";

export const Footer = ({ show = true }) => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white w-full">
      {show && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Home Inventory</span>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-blue-400 transition-colors text-center md:text-left"
                aria-label="Features"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-blue-400 transition-colors text-center md:text-left"
                aria-label="About"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-300 hover:text-blue-400 transition-colors text-center md:text-left"
                aria-label="Contact"
              >
                Contact
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right text-sm text-gray-400">
              © 2025 HIMS. All rights reserved.
            </div>
          </div>
        </div>
      )}
      {!show && (
        <div className="text-center text-base leading-10 text-gray-400">
          © 2025 HIMS. All rights reserved.
        </div>
      )}
    </footer>
  );
};
