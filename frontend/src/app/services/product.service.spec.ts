import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts()', () => {
    it('should return all products', () => {
      const products = service.getAllProducts();
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return an array of Product objects', () => {
      const products = service.getAllProducts();
      products.forEach(p => {
        expect(p.id).toBeDefined();
        expect(p.name).toBeDefined();
        expect(p.price).toBeDefined();
        expect(p.category).toBeDefined();
      });
    });
  });

  describe('getProductsByCategory()', () => {
    it('should return all products when category is "all"', () => {
      const all = service.getAllProducts();
      const filtered = service.getProductsByCategory('all');
      expect(filtered.length).toBe(all.length);
    });

    it('should return only electronics products', () => {
      const products = service.getProductsByCategory('electronics');
      products.forEach(p => expect(p.category).toBe('electronics'));
    });

    it('should return only fashion products', () => {
      const products = service.getProductsByCategory('fashion');
      products.forEach(p => expect(p.category).toBe('fashion'));
    });

    it('should return empty array for unknown category', () => {
      const products = service.getProductsByCategory('unknown-xyz');
      expect(products.length).toBe(0);
    });
  });

  describe('getProductById()', () => {
    it('should return the correct product by id', () => {
      const product = service.getProductById(1);
      expect(product).toBeDefined();
      expect(product?.id).toBe(1);
    });

    it('should return undefined for non-existent id', () => {
      const product = service.getProductById(9999);
      expect(product).toBeUndefined();
    });
  });

  describe('searchProducts()', () => {
    it('should return all products for empty query', () => {
      const all = service.getAllProducts();
      const result = service.searchProducts('');
      expect(result.length).toBe(all.length);
    });

    it('should find products by name (case-insensitive)', () => {
      const result = service.searchProducts('samsung');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name.toLowerCase()).toContain('samsung');
    });

    it('should find products by category', () => {
      const result = service.searchProducts('electronics');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const result = service.searchProducts('xyznonexistent123');
      expect(result.length).toBe(0);
    });
  });

  describe('sortProducts()', () => {
    let products: Product[];

    beforeEach(() => {
      products = service.getAllProducts();
    });

    it('should sort by price ascending', () => {
      const sorted = service.sortProducts(products, 'price-asc');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i - 1].price);
      }
    });

    it('should sort by price descending', () => {
      const sorted = service.sortProducts(products, 'price-desc');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].price).toBeLessThanOrEqual(sorted[i - 1].price);
      }
    });

    it('should sort by rating descending', () => {
      const sorted = service.sortProducts(products, 'rating');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].rating).toBeLessThanOrEqual(sorted[i - 1].rating);
      }
    });

    it('should sort by discount descending', () => {
      const sorted = service.sortProducts(products, 'discount');
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].discount).toBeLessThanOrEqual(sorted[i - 1].discount);
      }
    });

    it('should not mutate original array', () => {
      const original = [...products];
      service.sortProducts(products, 'price-asc');
      expect(products).toEqual(original);
    });
  });

  describe('getDealProducts()', () => {
    it('should return products with at least 30% discount', () => {
      const deals = service.getDealProducts();
      deals.forEach(p => expect(p.discount).toBeGreaterThanOrEqual(30));
    });

    it('should return at most 4 products', () => {
      const deals = service.getDealProducts();
      expect(deals.length).toBeLessThanOrEqual(4);
    });
  });
});
