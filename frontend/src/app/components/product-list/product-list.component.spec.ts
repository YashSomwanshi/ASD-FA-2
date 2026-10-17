import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    const mockCartService = jasmine.createSpyObj('CartService', ['addToCart', 'isInCart', 'getTotalItems'], {
      cartItems$: new BehaviorSubject<CartItem[]>([])
    });
    const mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterTestingModule, FormsModule],
      providers: [
        ProductService,
        { provide: CartService, useValue: mockCartService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.filteredProducts.length).toBeGreaterThan(0);
  });

  it('should load deal products on init', () => {
    expect(component.dealProducts.length).toBeGreaterThan(0);
  });

  it('should start with "all" category active', () => {
    expect(component.activeCategory).toBe('all');
  });

  it('should filter products by category', () => {
    component.setCategory('electronics');
    component.filteredProducts.forEach(p => {
      expect(p.category).toBe('electronics');
    });
  });

  it('should show all products for "all" category', () => {
    component.setCategory('all');
    expect(component.filteredProducts.length).toBe(productService.getAllProducts().length);
  });

  it('should filter products on search', () => {
    component.searchQuery = 'samsung';
    component.onSearch();
    expect(component.filteredProducts.length).toBeGreaterThan(0);
    expect(component.filteredProducts[0].name.toLowerCase()).toContain('samsung');
  });

  it('should return empty list for no-match search', () => {
    component.searchQuery = 'xyznonexistent999abc';
    component.onSearch();
    expect(component.filteredProducts.length).toBe(0);
  });

  it('should sort products on sort change', () => {
    component.sortBy = 'price-asc';
    component.onSortChange();
    const prices = component.filteredProducts.map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it('should have all 7 category options', () => {
    expect(component.categories.length).toBe(7);
  });
});
