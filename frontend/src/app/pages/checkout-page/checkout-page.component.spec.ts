import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutPageComponent } from './checkout-page.component';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { FormsModule } from '@angular/forms';

const mockCartItems: CartItem[] = [
  { product: { id: 1, name: 'Phone', category: 'electronics', price: 10000, originalPrice: 12000, discount: 17, rating: 4.5, reviewCount: 100, emoji: '📱', inStock: true, description: 'A phone' }, quantity: 1 }
];

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let fixture: ComponentFixture<CheckoutPageComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockCheckoutService: jasmine.SpyObj<CheckoutService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getTotalItems', 'getTotalPrice', 'clearCart'], {
      cartItems$: new BehaviorSubject<CartItem[]>(mockCartItems)
    });
    mockCartService.getTotalItems.and.returnValue(1);
    mockCartService.getTotalPrice.and.returnValue(10000);

    mockCheckoutService = jasmine.createSpyObj('CheckoutService', ['setOrder', 'generateOrderId']);
    mockCheckoutService.generateOrderId.and.returnValue('SE123456789001');

    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CheckoutPageComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: CheckoutService, useValue: mockCheckoutService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on step 1', () => {
    expect(component.currentStep).toBe(1);
  });

  it('should have 3 address type options', () => {
    expect(['home', 'work', 'other']).toContain(component.address.addressType);
  });

  it('should have default payment method as cod', () => {
    expect(component.paymentMethod).toBe('cod');
  });

  it('should not be valid on step 1 with empty address', () => {
    expect(component.isStep1Valid()).toBeFalse();
  });

  it('should be valid on step 1 with correct address', () => {
    component.address = {
      fullName: 'Yash Somwanshi', phone: '9876543210',
      email: 'yash@example.com', addressLine1: '123 Main St',
      addressLine2: '', city: 'Mumbai', state: 'Maharashtra',
      pincode: '400001', landmark: '', addressType: 'home'
    };
    expect(component.isStep1Valid()).toBeTrue();
  });

  it('should reject invalid phone numbers', () => {
    component.address.phone = '1234567890'; // starts with 1, invalid
    component.address.fullName = 'Test'; component.address.email = 'a@b.com';
    component.address.addressLine1 = '123'; component.address.city = 'Mumbai';
    component.address.state = 'Maharashtra'; component.address.pincode = '400001';
    expect(component.isStep1Valid()).toBeFalse();
  });

  it('should reject invalid email', () => {
    component.address.phone = '9876543210'; component.address.email = 'not-an-email';
    component.address.fullName = 'Test'; component.address.addressLine1 = '123';
    component.address.city = 'Mumbai'; component.address.state = 'Maharashtra';
    component.address.pincode = '400001';
    expect(component.isStep1Valid()).toBeFalse();
  });

  it('should reject invalid pincode', () => {
    component.address.phone = '9876543210'; component.address.email = 'a@b.com';
    component.address.fullName = 'Test'; component.address.addressLine1 = '123';
    component.address.city = 'Mumbai'; component.address.state = 'Maharashtra';
    component.address.pincode = '40000'; // only 5 digits
    expect(component.isStep1Valid()).toBeFalse();
  });

  it('should advance to step 2 on nextStep() when step1 is valid', () => {
    component.address = {
      fullName: 'Yash', phone: '9876543210', email: 'a@b.com',
      addressLine1: '123 Main', addressLine2: '', city: 'Mumbai',
      state: 'Maharashtra', pincode: '400001', landmark: '', addressType: 'home'
    };
    component.nextStep();
    expect(component.currentStep).toBe(2);
  });

  it('should go back on prevStep()', () => {
    component.currentStep = 2;
    component.prevStep();
    expect(component.currentStep).toBe(1);
  });

  it('should calculate delivery fee as 0 when subtotal > 499', () => {
    expect(component.deliveryFee).toBe(0);
  });

  it('should calculate 5% discount', () => {
    expect(component.discount).toBe(500);
  });

  it('should calculate grand total correctly', () => {
    // subtotal=10000, delivery=0, discount=500
    expect(component.grandTotal).toBe(9500);
  });

  it('should format price with rupee symbol', () => {
    expect(component.formatPrice(10000)).toContain('₹');
  });

  it('should have 31 Indian states/UTs', () => {
    expect(component.indianStates.length).toBe(33);
  });
});
