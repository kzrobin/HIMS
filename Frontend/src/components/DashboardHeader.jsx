import React from "react";
import { Package, Plus, LogOut, Crown } from "lucide-react";
import { Button } from "./Button";

const DashboardHeader = ({ user, isPremium, onLogout, onAddItem, onUpgrade }) => {
  return (
    <header className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
        </div>
        
        {/* Display premium badge if user is premium */}
        {isPremium && (
          <div className="flex items-center space-x-2">
            <Crown className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-600">Premium User</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Add Item Button */}
        <Button
          onClick={onAddItem}
          className="hidden sm:flex items-center bg-indigo-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-indigo-600"
        >
          <Plus className="mr-2" />
          Add Item
        </Button>

        {/* Upgrade Button */}
        {!isPremium && (
          <Button
            onClick={onUpgrade}
            className="hidden md:flex items-center bg-gray-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-gray-600"
          >
            <Package className="mr-2" />
            Upgrade
          </Button>
        )}

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-red-600"
        >
          <LogOut className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
