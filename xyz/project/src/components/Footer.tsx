import React from 'react';
import { Package } from 'lucide-react';

export const Footer=  ({show = true}) => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Package className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-xl font-semibold">Home Inventory</span>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-400">
            © {new Date().getFullYear()} Home Inventory. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};