export interface User {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  subscriptionTier: 'free' | 'premium';
  subscriptionExpiryDate?: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  productionDate: string;
  type: string;
  notes: string;
  quantity?: number;
  value?: number;
  location?: string;
  warranty?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  attachments?: string[];
  tags?: string[];
  lastModified: string;
}