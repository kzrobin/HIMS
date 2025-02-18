import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { Footer } from '../components/Footer';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (tier: 'free' | 'premium') => {
    // In a real app, this would handle the subscription process
    if (tier === 'premium') {
      // Redirect to payment processing
      console.log('Processing premium subscription');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Home Inventory Pricing
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your home inventory management needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <SubscriptionCard
              tier="free"
              onSubscribe={() => handleSubscribe('free')}
            />
            <SubscriptionCard
              tier="premium"
              onSubscribe={() => handleSubscribe('premium')}
            />
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Features in Detail
            </h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-4 text-amber-600">Advanced Organization</h4>
                <p className="text-gray-600">
                  Create custom categories, tags, and locations. Organize items by room, storage unit, or any custom system that works for you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-4 text-amber-600">Value Tracking</h4>
                <p className="text-gray-600">
                  Track item values, depreciation, and total home inventory worth. Perfect for insurance purposes and financial planning.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-4 text-amber-600">Document Storage</h4>
                <p className="text-gray-600">
                  Store receipts, warranty cards, and important documents alongside your items. Quick access when you need them most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};