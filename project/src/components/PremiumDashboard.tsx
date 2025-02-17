import React from 'react';
import { BarChart2, TrendingUp, Package, Clock, Tag, Map, Settings, Users, Download, Upload } from 'lucide-react';
import { User, Item } from '../types';

interface PremiumDashboardProps {
  user: User;
  items: Item[];
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({ user, items }) => {
  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalItems = items.length;
  const expiringItems = items.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 30;
  }).length;

  const categories = [...new Set(items.map(item => item.category))];
  const locations = [...new Set(items.map(item => item.location).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Premium Status Bar */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-6 w-6 mr-2" />
            <span className="font-semibold">Premium Account</span>
          </div>
          <div className="text-sm">
            Next billing date: {user.subscriptionExpiryDate || 'N/A'}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Items</h3>
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Value</h3>
            <BarChart2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${totalValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            <Tag className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expiring Soon</h3>
            <Clock className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{expiringItems}</p>
        </div>
      </div>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Map className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
          </div>
          <div className="space-y-2">
            {locations.map(location => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-gray-600">{location}</span>
                <span className="text-gray-900 font-medium">
                  {items.filter(item => item.location === location).length} items
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Value Distribution</h3>
          </div>
          <div className="space-y-2">
            {categories.map(category => {
              const categoryValue = items
                .filter(item => item.category === category)
                .reduce((sum, item) => sum + (item.value || 0), 0);
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-600">{category}</span>
                  <span className="text-gray-900 font-medium">
                    ${categoryValue.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              Export Inventory
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
              <Upload className="h-5 w-5 mr-2" />
              Import Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};