import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../models/product.model';

const mockProduct: Product = {
  id: 1, name: 'Samsung Galaxy S24', category: 'electronics',
  price: 109999, originalPrice: 134999, discount: 19,
  rating: 4.7, reviewCount: 1200, emoji: '📱',
  badge: 'Best Seller', inStock: true,
  description: 'Flagship smartphone'
};

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart', 'isInCart']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Samsung Galaxy S24');
  });

  it('should display product emoji', () => {
    expect(fixture.nativeElement.textContent).toContain('📱');
  });

  it('should display discounted price formatted', () => {
    const price = component.formatPrice(109999);
    expect(price).toContain('₹');
    expect(price).toContain('1,09,999');
  });

  it('should call cartService.addToCart on addToCart()', () => {
    const mockEvent = new MouseEvent('click');
    component.addToCart(mockEvent);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should call toastService.show on addToCart()', () => {
    const mockEvent = new MouseEvent('click');
    component.addToCart(mockEvent);
    expect(mockToastService.show).toHaveBeenCalled();
  });

  it('should return correct stars array', () => {
    const stars = component.getStars(4.7);
    expect(stars.length).toBe(4);
  });

  it('should render Add to Cart button for in-stock product', () => {
    const btn = fixture.nativeElement.querySelector(`#add-cart-${mockProduct.id}`);
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBeFalse();
  });

  it('should disable cart button for out-of-stock product', () => {
    component.product = { ...mockProduct, inStock: false };
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector(`#add-cart-${mockProduct.id}`);
    expect(btn.disabled).toBeTrue();
  });

  it('should show badge when product has badge', () => {
    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('Best Seller');
  });
});
