import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

const mockProduct1: Product = {
  id: 1, name: 'Samsung Galaxy S24', category: 'electronics',
  price: 109999, originalPrice: 134999, discount: 19,
  rating: 4.7, reviewCount: 1200, emoji: '📱',
  badge: 'Best Seller', inStock: true,
  description: 'Flagship smartphone'
};

const mockProduct2: Product = {
  id: 2, name: 'Nike Air Max', category: 'fashion',
  price: 10795, originalPrice: 12995, discount: 17,
  rating: 4.4, reviewCount: 800, emoji: '👟',
  inStock: true,
  description: 'Running shoes'
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addToCart()', () => {
    it('should add a new product to cart', () => {
      service.addToCart(mockProduct1);
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });

    it('should increase quantity if product already in cart', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1);
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });

    it('should add multiple products', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
      expect(service.getCartItems().length).toBe(2);
    });

    it('should add product with custom quantity', () => {
      service.addToCart(mockProduct1, 3);
      expect(service.getCartItems()[0].quantity).toBe(3);
    });
  });

  describe('removeFromCart()', () => {
    it('should remove product from cart', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
      service.removeFromCart(1);
      const items = service.getCartItems();
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(2);
    });

    it('should not throw when removing non-existent product', () => {
      expect(() => service.removeFromCart(999)).not.toThrow();
    });
  });

  describe('updateQuantity()', () => {
    it('should update quantity of a cart item', () => {
      service.addToCart(mockProduct1);
      service.updateQuantity(1, 5);
      expect(service.getCartItems()[0].quantity).toBe(5);
    });

    it('should remove item when quantity set to 0', () => {
      service.addToCart(mockProduct1);
      service.updateQuantity(1, 0);
      expect(service.getCartItems().length).toBe(0);
    });

    it('should remove item when quantity is negative', () => {
      service.addToCart(mockProduct1);
      service.updateQuantity(1, -1);
      expect(service.getCartItems().length).toBe(0);
    });
  });

  describe('clearCart()', () => {
    it('should empty the cart', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
      service.clearCart();
      expect(service.getCartItems().length).toBe(0);
    });
  });

  describe('getTotalItems()', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getTotalItems()).toBe(0);
    });

    it('should return sum of all quantities', () => {
      service.addToCart(mockProduct1, 2);
      service.addToCart(mockProduct2, 3);
      expect(service.getTotalItems()).toBe(5);
    });
  });

  describe('getTotalPrice()', () => {
    it('should return 0 for empty cart', () => {
      expect(service.getTotalPrice()).toBe(0);
    });

    it('should calculate correct total price', () => {
      service.addToCart(mockProduct1, 1); // 109999
      service.addToCart(mockProduct2, 2); // 10795 * 2 = 21590
      expect(service.getTotalPrice()).toBe(131589);
    });
  });

  describe('isInCart()', () => {
    it('should return true if product is in cart', () => {
      service.addToCart(mockProduct1);
      expect(service.isInCart(1)).toBeTrue();
    });

    it('should return false if product not in cart', () => {
      expect(service.isInCart(999)).toBeFalse();
    });
  });

  describe('getItemQuantity()', () => {
    it('should return correct quantity', () => {
      service.addToCart(mockProduct1, 3);
      expect(service.getItemQuantity(1)).toBe(3);
    });

    it('should return 0 for item not in cart', () => {
      expect(service.getItemQuantity(999)).toBe(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist cart to localStorage', () => {
      service.addToCart(mockProduct1);
      const stored = localStorage.getItem('shopeasy_cart');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
    });

    it('should emit cart updates via observable', (done) => {
      service.cartItems$.subscribe(items => {
        if (items.length === 1) {
          expect(items[0].product.id).toBe(1);
          done();
        }
      });
      service.addToCart(mockProduct1);
    });
  });
});
