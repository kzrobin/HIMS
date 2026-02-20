import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "../../components/common/Footer";
import { Navbar } from "../../components/common/Navbar";
import {
  Package,
  List,
  Calendar,
  Search,
  Shield,
  BarChart,
  Home,
} from "lucide-react";

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#F9FAF5]">
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#A3B18A] to-[#588157] text-white pt-0 sm:pt-1 pb-16 sm:pb-24 relative"
        >
          <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10"></div>


          <Navbar/>

          <div className="container mx-auto px-4 text-center mt-8 sm:mt-12">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            >
              Your Home, Perfectly Organized
            </motion.h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
              Manage your household items with ease. Track, organize, and never
              lose anything again.
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-[#8B7E66] text-white rounded-xl shadow-lg hover:bg-[#6B6651] transition-all duration-300 text-sm sm:text-base"
              >
                Start Now
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <section className="py-12 sm:py-20 bg-white relative">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-[#344E41]">
              Everything You Need to Stay Organized
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
            >
              <motion.div
                variants={itemVariants}
                className="bg-[#F9FAF5] p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <List className="h-10 w-10 sm:h-12 sm:w-12 text-[#588157] mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#344E41]">
                  Easy Cataloging
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Add and categorize your items with a simple, intuitive
                  interface.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-[#F9FAF5] p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-[#588157] mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#344E41]">
                  Smart Reminders
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Get alerts for expiring warranties or maintenance schedules.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-[#F9FAF5] p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-[#588157] mb-3 sm:mb-4" />
                <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-[#344E41]">
                  Instant Search
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Find anything in seconds with powerful search tools.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="py-12 sm:py-20 bg-[#DAD7CD] relative">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#344E41]">
              See It In Action
            </h3>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
              Explore how HomeHaven transforms your home management with our
              interactive demo.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md sm:max-w-3xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login?next=/dashboard">
                  <button className="px-4 py-2 sm:px-6 sm:py-2 bg-[#588157] text-white rounded-lg hover:bg-[#344E41] transition-all text-sm sm:text-base">
                    Add Item
                  </button>
                </Link>
                <Link to="/login?next=/dashboard">
                  <button className="px-4 py-2 sm:px-6 sm:py-2 border border-[#588157] text-[#588157] rounded-lg hover:bg-[#588157] hover:text-white transition-all text-sm sm:text-base">
                    Search Inventory
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-[#A3B18A] to-[#588157] text-white relative">
          <div className="container mx-auto px-4 text-center">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
            >
              Take Control of Your Home Today
            </motion.h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-md sm:max-w-xl mx-auto">
              Join thousands of happy homeowners
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-[#8B7E66] text-white rounded-xl shadow-lg hover:bg-[#6B6651] transition-all duration-300 text-sm sm:text-base"
              >
                Start Now
              </motion.button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
