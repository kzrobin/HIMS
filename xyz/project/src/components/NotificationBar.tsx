import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationBarProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ 
  message, 
  type = 'info' 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500'
  };

  return (
    <div className={`${bgColors[type]} text-white px-4 py-2`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};