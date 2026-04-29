export type AppTab = 'home' | 'create' | 'profile';

export type ItemCondition = 'Like New' | 'Excellent' | 'Good' | 'Fair';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imageAspectRatio: number;
  location: string;
  sellerName: string;
  condition: ItemCondition;
  views: number;
  saved: number;
  postedAt: string;
  badges: string[];
}

export interface GeneratedListing {
  title: string;
  description: string;
  category: string;
  price: number;
}
