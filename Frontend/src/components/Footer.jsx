import React from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export const Footer = ({ show = true }) => {
  return (
    <footer className="bg-gradient-to-r from-[#344E41] to-[#588157] text-white w-full">
      {show ? (
        // Full Footer (for landing page, etc.)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo and Branding */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-[#F9FAF5]" />
                <span className="text-xl sm:text-2xl font-bold">HomeHaven</span>
              </div>
              <p className="text-sm text-gray-200 text-center md:text-left">
                Organize your home, effortlessly.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 sm:justify-center">
              <Link
                to="/features"
                className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300 text-sm sm:text-base"
                aria-label="Features"
              >
                Features
              </Link>
              <Link
                to="/about"
                className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300 text-sm sm:text-base"
                aria-label="About"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300 text-sm sm:text-base"
                aria-label="Contact"
              >
                Contact
              </Link>
            </div>

            {/* Social Links and Copyright */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/iamkzrobin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/iamkzrobin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3.1V12h3.1V9.8c0-3.1 1.9-4.8 4.7-4.8.9 0 1.8.1 2.7.4v3.1h-1.5c-1.5 0-1.8.7-1.8 1.8V12h3.3l-.5 3.4h-2.8v8.4A12 12 0 0024 12z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/kzrobin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.5 0H3.5A3.5 3.5 0 000 3.5v17A3.5 3.5 0 003.5 24h17a3.5 3.5 0 003.5-3.5v-17A3.5 3.5 0 0020.5 0zM8.2 20.5H5.3V9.2h2.9v11.3zM6.8 7.6c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7 1.7.7 1.7 1.7-.7 1.7-1.7 1.7zm13.7 12.9h-2.9v-5.6c0-1.3-.5-2.2-1.7-2.2-1 0-1.5.7-1.7 1.4v6.4H10V9.2h2.8v1.5c.4-.7 1.2-1.7 2.8-1.7 2 0 3.5 1.3 3.5 4.1v7.4z" />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-300">
                © {new Date().getFullYear()} HomeHaven. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Hybrid Footer (for Signup/Login)
        <div className="py-4 text-center text-sm bg-[#344E41] flex flex-col sm:flex-row justify-center items-center gap-4">
          <p className="text-gray-300">
            © {new Date().getFullYear()} HomeHaven. All rights reserved.
          </p>
          <Link
            to="/contact"
            className="text-gray-200 hover:text-[#F9FAF5] transition-colors duration-300"
            aria-label="Contact Support"
          >
            Contact Support
          </Link>
        </div>
      )}
    </footer>
  );
};
