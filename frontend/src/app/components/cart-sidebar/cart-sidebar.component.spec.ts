import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartSidebarComponent } from './cart-sidebar.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { Product } from '../../models/product.model';

const mockProduct: Product = {
  id: 1, name: 'Test Product', category: 'electronics',
  price: 1000, originalPrice: 1500, discount: 33,
  rating: 4.5, reviewCount: 100, emoji: '📱',
  inStock: true, description: 'Test description'
};

describe('CartSidebarComponent', () => {
  let component: CartSidebarComponent;
  let fixture: ComponentFixture<CartSidebarComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let cartSubject: BehaviorSubject<CartItem[]>;

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<CartItem[]>([]);
    mockCartService = jasmine.createSpyObj('CartService', [
      'removeFromCart', 'updateQuantity', 'clearCart', 'getTotalItems', 'getTotalPrice'
    ], { cartItems$: cartSubject });
    mockCartService.getTotalItems.and.returnValue(0);
    mockCartService.getTotalPrice.and.returnValue(0);

    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CartSidebarComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start as closed', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('should open sidebar', () => {
    component.open();
    expect(component.isOpen).toBeTrue();
  });

  it('should close sidebar', () => {
    component.open();
    component.close();
    expect(component.isOpen).toBeFalse();
  });

  it('should show empty state when cart is empty', () => {
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.cart-empty');
    expect(empty).toBeTruthy();
  });

  it('should show cart items when cart has items', () => {
    cartSubject.next([{ product: mockProduct, quantity: 1 }]);
    mockCartService.getTotalItems.and.returnValue(1);
    mockCartService.getTotalPrice.and.returnValue(1000);
    fixture.detectChanges();
    const cartItem = fixture.nativeElement.querySelector('#cart-item-1');
    expect(cartItem).toBeTruthy();
  });

  it('should call removeFromCart on remove()', () => {
    component.remove(1);
    expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should call updateQuantity on increase()', () => {
    component.increase(1, 2);
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should call updateQuantity on decrease()', () => {
    component.decrease(1, 2);
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('should call clearCart and show toast on clearCart()', () => {
    component.clearCart();
    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(mockToastService.show).toHaveBeenCalled();
  });

  it('should close sidebar on checkout()', () => {
    component.open();
    component.checkout();
    expect(component.isOpen).toBeFalse();
  });

  it('should format price correctly', () => {
    expect(component.formatPrice(109999)).toContain('₹');
  });
});
