import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import {
  Package,
  List,
  Calendar,
  Search,
  Shield,
  BarChart,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <main className="flex-grow">
        {/* Hero Section with Wave Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-[#3BCD5B] via-[#2E8B57] to-[#3BCD5B] text-white pb-24 w-full relative overflow-hidden"
        >
          {/* Wave Background */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-wave bg-repeat-x bg-cover opacity-20"></div>

          <nav>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex justify-between items-center">
                {/* Logo and Title */}
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

                {/* Navbar Links and Buttons */}
                <div className="flex items-center space-x-6">
                  <Link to="/login" className="hidden md:block">
                    <button className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-nowrap">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Horizontal Line */}
          <hr className="border-t-2 border-gray-300 mx-4 sm:mx-16" />

          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              Smart Home Inventory Management
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Keep track of everything in your home effortlessly.
            </p>
            <Link to="/signup">
              <button className="text-lg px-8 py-4 bg-white text-black rounded-xl hover:bg-indigo-100 transform hover:scale-105 transition-all">
                Start Organizing Today
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <section className="py-24 bg-gray-50 relative">
          {/* Wave Background */}
          <div className="absolute top-0 left-0 w-full h-24 bg-wave bg-repeat-x bg-cover opacity-20 transform rotate-180"></div>

          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-16">
              Powerful Features for Your Home
            </h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <List className="h-12 w-12 text-[#4F46E5] mb-6" />
                <h4 className="text-xl font-semibold mb-4">
                  Smart Organization
                </h4>
                <p className="text-gray-600">
                  Categorize and organize your items efficiently with our
                  intuitive system.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <Calendar className="h-12 w-12 text-[#4F46E5] mb-6" />
                <h4 className="text-xl font-semibold mb-4">Expiry Tracking</h4>
                <p className="text-gray-600">
                  Never let items expire again. Get notifications before your
                  items reach their expiry date.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <Search className="h-12 w-12 text-[#4F46E5] mb-6" />
                <h4 className="text-xl font-semibold mb-4">Quick Search</h4>
                <p className="text-gray-600">
                  Find any item instantly with our powerful search
                  functionality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <div className="py-24 bg-white relative">
          {/* Wave Background */}
          <div className="absolute top-0 left-0 w-full h-24 bg-wave bg-repeat-x bg-cover opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">
                Why Choose Home Inventory?
              </h3>
              <p className="text-xl text-gray-600">
                Experience the benefits of organized living
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Secure & Private
                  </h4>
                  <p className="text-gray-600">
                    Your data is encrypted and stored securely. We prioritize
                    your privacy and security above all.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Insights & Analytics
                  </h4>
                  <p className="text-gray-600">
                    Get valuable insights about your inventory with detailed
                    analytics and reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white py-16 relative"
        >
          {/* Wave Background */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-wave bg-repeat-x bg-cover opacity-20 transform rotate-180"></div>

          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8">
              Join thousands of organized households today.
            </p>
            <Link to="/signup">
              <button className="text-lg px-8 py-4 bg-white text-black rounded-xl hover:bg-indigo-100 transform hover:scale-105 transition-all">
                Create Free Account
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
