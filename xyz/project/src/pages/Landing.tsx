import React from 'react';
import { Link } from 'react-router-dom';
import { Package, List, Calendar, Search, Shield, BarChart } from 'lucide-react';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import { NotificationBar } from '../components/NotificationBar';
import { NotificationBell } from '../components/NotificationBell';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NotificationBar 
        message="🎉 Special offer: Get 3 months of Premium for the price of 2! Limited time only." 
        type="info"
      />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Home Inventory
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <Link to="/login">
                <Button variant="secondary" className="hover:bg-gray-100 transition-colors">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Smart Home Inventory Management
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Keep track of everything in your home with our intelligent inventory system. Never worry about expired items or missing essentials again.
              </p>
              <Link to="/signup">
                <Button className="text-lg px-8 py-4 bg-white text-black hover:bg-blue-50 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl">
                  Start Organizing Today
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gray-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-16">Powerful Features for Your Home</h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <List className="h-12 w-12 text-blue-600 mb-6" />
                <h4 className="text-xl font-semibold mb-4">Smart Organization</h4>
                <p className="text-gray-600">
                  Categorize and organize your items efficiently with our intuitive system. Keep everything in order with custom categories and tags.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <Calendar className="h-12 w-12 text-blue-600 mb-6" />
                <h4 className="text-xl font-semibold mb-4">Expiry Tracking</h4>
                <p className="text-gray-600">
                  Never let items expire again. Get notifications before your items reach their expiry date and maintain freshness.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md transform hover:-translate-y-1 transition-all">
                <Search className="h-12 w-12 text-blue-600 mb-6" />
                <h4 className="text-xl font-semibold mb-4">Quick Search</h4>
                <p className="text-gray-600">
                  Find any item instantly with our powerful search functionality. Filter by category, date, or custom tags.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Why Choose Home Inventory?</h3>
              <p className="text-xl text-gray-600">Experience the benefits of organized living</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="flex items-start space-x-4">
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
                  <p className="text-gray-600">
                    Your data is encrypted and stored securely. We prioritize your privacy and security above all.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Insights & Analytics</h4>
                  <p className="text-gray-600">
                    Get valuable insights about your inventory with detailed analytics and reports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8">Join thousands of organized households today.</p>
            <Link to="/signup">
              <Button className="text-lg px-8 py-4 bg-white text-black hover:bg-blue-50">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};