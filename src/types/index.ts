// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  department: string;
  whatsappNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Item categories
export enum ItemCategory {
  LAB_EQUIPMENT = 'Lab Equipment',
  BOOKS = 'Books/Notes',
  FURNITURE = 'Furniture',
  ELECTRONICS = 'Electronics',
  TICKETS = 'Tickets',
  MISCELLANEOUS = 'Miscellaneous',
}

// Item listing types
export enum ListingType {
  SELL = 'sell',
  BUY = 'buy',
  RENT = 'rent',
}

// Item interface
export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ItemCategory;
  listingType: ListingType;
  condition?: string;
  images: string[];
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// Search filters
export interface SearchFilters {
  query?: string;
  category?: ItemCategory;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
}
