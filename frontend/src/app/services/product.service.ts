import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'electronics',
    price: 109999, originalPrice: 134999, discount: 19,
    rating: 4.7, reviewCount: 12483, emoji: '📱',
    badge: 'Best Seller', inStock: true,
    description: 'Flagship smartphone with 200MP camera and S Pen'
  },
  {
    id: 2, name: 'Apple iPhone 15 Pro', category: 'electronics',
    price: 134900, originalPrice: 149900, discount: 10,
    rating: 4.8, reviewCount: 9871, emoji: '📲',
    badge: 'Top Rated', inStock: true,
    description: 'Pro-level performance with titanium design'
  },
  {
    id: 3, name: 'Sony WH-1000XM5 Headphones', category: 'electronics',
    price: 24990, originalPrice: 34990, discount: 29,
    rating: 4.6, reviewCount: 6234, emoji: '🎧',
    badge: 'Deal', inStock: true,
    description: 'Industry-leading noise cancellation headphones'
  },
  {
    id: 4, name: 'Dell XPS 15 Laptop', category: 'electronics',
    price: 149990, originalPrice: 179990, discount: 17,
    rating: 4.5, reviewCount: 3421, emoji: '💻',
    badge: 'New', inStock: true,
    description: 'Premium 15-inch OLED laptop for professionals'
  },
  {
    id: 5, name: 'Nike Air Max 270', category: 'fashion',
    price: 10795, originalPrice: 12995, discount: 17,
    rating: 4.4, reviewCount: 8942, emoji: '👟',
    badge: 'Trending', inStock: true,
    description: 'Iconic Air Max cushioning with modern design'
  },
  {
    id: 6, name: 'Levi\'s 501 Original Fit Jeans', category: 'fashion',
    price: 2499, originalPrice: 3999, discount: 38,
    rating: 4.3, reviewCount: 15234, emoji: '👖',
    inStock: true,
    description: 'The original straight-fit jeans since 1873'
  },
  {
    id: 7, name: 'Puma Classic Polo T-Shirt', category: 'fashion',
    price: 899, originalPrice: 1599, discount: 44,
    rating: 4.2, reviewCount: 22187, emoji: '👕',
    badge: 'Hot Deal', inStock: true,
    description: 'Comfortable polo for everyday wear'
  },
  {
    id: 8, name: 'Prestige Induction Cooktop', category: 'home',
    price: 2499, originalPrice: 3999, discount: 38,
    rating: 4.4, reviewCount: 7654, emoji: '🍳',
    inStock: true,
    description: 'Smart induction cooktop with 7 preset menus'
  },
  {
    id: 9, name: 'Philips Air Fryer HD9200', category: 'home',
    price: 7499, originalPrice: 11995, discount: 37,
    rating: 4.5, reviewCount: 4523, emoji: '🍟',
    badge: 'Best Seller', inStock: true,
    description: 'Rapid Air technology for healthy frying'
  },
  {
    id: 10, name: 'IKEA Kallax Shelf Unit', category: 'home',
    price: 9999, originalPrice: 13999, discount: 29,
    rating: 4.3, reviewCount: 2341, emoji: '🗄️',
    inStock: false,
    description: 'Versatile shelving unit for any room'
  },
  {
    id: 11, name: 'Cosco Granite Football', category: 'sports',
    price: 599, originalPrice: 999, discount: 40,
    rating: 4.1, reviewCount: 5678, emoji: '⚽',
    inStock: true,
    description: 'Official size and weight football'
  },
  {
    id: 12, name: 'Boldfit Resistance Bands Set', category: 'sports',
    price: 699, originalPrice: 1499, discount: 53,
    rating: 4.3, reviewCount: 9123, emoji: '🏋️',
    badge: 'Hot Deal', inStock: true,
    description: 'Set of 5 resistance bands for home workouts'
  },
  {
    id: 13, name: 'Lakme Absolute Face Stylist', category: 'beauty',
    price: 449, originalPrice: 749, discount: 40,
    rating: 4.2, reviewCount: 13456, emoji: '💄',
    inStock: true,
    description: 'Illuminating foundation with SPF protection'
  },
  {
    id: 14, name: 'Mama Earth Onion Hair Oil', category: 'beauty',
    price: 349, originalPrice: 499, discount: 30,
    rating: 4.4, reviewCount: 28765, emoji: '🧴',
    badge: 'Top Rated', inStock: true,
    description: 'Reduces hair fall with onion and redensyl'
  },
  {
    id: 15, name: 'Atomic Habits - James Clear', category: 'books',
    price: 399, originalPrice: 799, discount: 50,
    rating: 4.9, reviewCount: 45678, emoji: '📚',
    badge: 'Bestseller', inStock: true,
    description: 'Tiny changes, remarkable results'
  },
  {
    id: 16, name: 'The Alchemist - Paulo Coelho', category: 'books',
    price: 199, originalPrice: 399, discount: 50,
    rating: 4.7, reviewCount: 32156, emoji: '📖',
    inStock: true,
    description: 'A magical story of following your dreams'
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = MOCK_PRODUCTS;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.products;
    return this.products.filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  searchProducts(query: string): Product[] {
    const lower = query.toLowerCase().trim();
    if (!lower) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
    );
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return sorted.sort((a, b) => b.discount - a.discount);
      default:
        return sorted;
    }
  }

  getDealProducts(): Product[] {
    return this.products
      .filter(p => p.discount >= 30)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 4);
  }
}
