export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  emoji: string;
  badge?: string;
  inStock: boolean;
  description: string;
}
