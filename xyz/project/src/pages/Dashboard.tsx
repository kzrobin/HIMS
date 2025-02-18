import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Trash2, Filter, LogOut, Crown, BarChart2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Footer } from '../components/Footer';
import { PremiumBadge } from '../components/PremiumBadge';
import { PremiumDashboard } from '../components/PremiumDashboard';
import { NotificationBell } from '../components/NotificationBell';
import { User, Item } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const categories = ['Food', 'Electronics', 'Clothing', 'Documents', 'Other'];
const itemTypes = ['Perishable', 'Non-perishable', 'Electronic', 'Document', 'Other'];
const locations = ['Kitchen', 'Living Room', 'Bedroom', 'Garage', 'Storage', 'Other'];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    category: '',
    expiryDate: '',
    productionDate: '',
    type: '',
    notes: '',
    location: '',
    quantity: 1,
    value: 0,
  });
  const [error, setError] = useState<string>('');

  const isPremium = user.subscriptionTier === 'premium';

  // Premium features check
  const canAddMoreItems = isPremium || items.length < 100;
  const canUseAdvancedFeatures = isPremium;

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const validateItem = () => {
    if (!newItem.name?.trim()) {
      setError('Name is required');
      return false;
    }
    if (!newItem.category) {
      setError('Category is required');
      return false;
    }
    if (!newItem.type) {
      setError('Type is required');
      return false;
    }
    if (!newItem.productionDate) {
      setError('Production date is required');
      return false;
    }
    return true;
  };

  const handleAddItem = () => {
    if (!canAddMoreItems) {
      setShowUpgradeModal(true);
      return;
    }

    if (!validateItem()) return;

    const item: Item = {
      id: Date.now().toString(),
      ...newItem as Item,
      lastModified: new Date().toISOString(),
    };
    setItems([...items, item]);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: '',
      expiryDate: '',
      productionDate: '',
      type: '',
      notes: '',
      location: '',
      quantity: 1,
      value: 0,
    });
    setError('');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesLocation = !selectedLocation || item.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              {isPremium && <PremiumBadge />}
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell 
                items={items}
                subscriptionEndDate={user.subscriptionExpiryDate}
              />
              {!isPremium && (
                <Button
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPremium && <PremiumDashboard user={user} items={items} />}
        
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {isPremium && (
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    {isPremium && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                    {isPremium && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                      {isPremium && (
                        <td className="px-6 py-4 whitespace-nowrap">{item.location || '-'}</td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">{item.productionDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.expiryDate || '-'}</td>
                      {isPremium && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">{item.quantity || 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${item.value?.toLocaleString() || '0'}</td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">{item.notes || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add some items to your inventory or try a different search.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                label="Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  required
                >
                  <option value="">Select Type</option>
                  {itemTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {isPremium && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              )}
              <Input
                label="Production Date"
                type="date"
                value={newItem.productionDate}
                onChange={(e) => setNewItem({ ...newItem, productionDate: e.target.value })}
                required
              />
              <Input
                label="Expiry Date"
                type="date"
                value={newItem.expiryDate}
                onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
              />
              {isPremium && (
                <>
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  />
                  <Input
                    label="Value ($)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: parseFloat(e.target.value) || 0 })}
                  />
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Add any additional notes here..."
                />
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddItem} className="flex-1">
                  Add Item
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setError('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Upgrade to Premium</h2>
            <p className="text-gray-600 mb-4">
              You've reached the limit of 100 items for free accounts. Upgrade to Premium for unlimited items and more features!
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={() => navigate('/pricing')}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                View Premium Features
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};