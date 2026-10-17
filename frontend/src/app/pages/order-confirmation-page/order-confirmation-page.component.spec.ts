import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderConfirmationPageComponent } from './order-confirmation-page.component';
import { CheckoutService, OrderSummary } from '../../services/checkout.service';
import { RouterTestingModule } from '@angular/router/testing';

const mockOrder: OrderSummary = {
  items: [{ name: 'Phone', quantity: 1, price: 10000, emoji: '📱' }],
  subtotal: 10000, deliveryFee: 0, discount: 500, total: 9500,
  paymentMethod: 'upi', orderId: 'SE12345678901',
  address: {
    fullName: 'Yash Somwanshi', phone: '9876543210', email: 'yash@example.com',
    addressLine1: '123 Main Street', addressLine2: '',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
    landmark: '', addressType: 'home'
  }
};

describe('OrderConfirmationPageComponent', () => {
  let component: OrderConfirmationPageComponent;
  let fixture: ComponentFixture<OrderConfirmationPageComponent>;
  let mockCheckoutService: jasmine.SpyObj<CheckoutService>;

  beforeEach(async () => {
    mockCheckoutService = jasmine.createSpyObj('CheckoutService', ['getOrder', 'clearOrder']);
    mockCheckoutService.getOrder.and.returnValue(mockOrder);

    await TestBed.configureTestingModule({
      imports: [OrderConfirmationPageComponent, RouterTestingModule],
      providers: [{ provide: CheckoutService, useValue: mockCheckoutService }]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order from CheckoutService', () => {
    expect(component.order).toEqual(mockOrder);
  });

  it('should clear order on init', () => {
    expect(mockCheckoutService.clearOrder).toHaveBeenCalled();
  });

  it('should display the customer name', () => {
    expect(fixture.nativeElement.textContent).toContain('Yash Somwanshi');
  });

  it('should display order ID', () => {
    expect(fixture.nativeElement.textContent).toContain('SE12345678901');
  });

  it('should display the product emoji and name', () => {
    expect(fixture.nativeElement.textContent).toContain('📱');
    expect(fixture.nativeElement.textContent).toContain('Phone');
  });

  it('should display city and pincode', () => {
    expect(fixture.nativeElement.textContent).toContain('Mumbai');
    expect(fixture.nativeElement.textContent).toContain('400001');
  });

  it('should format price with rupee symbol', () => {
    expect(component.formatPrice(9500)).toContain('₹');
  });

  it('should return correct payment label for upi', () => {
    expect(component.paymentLabel('upi')).toContain('UPI');
  });

  it('should return correct payment label for cod', () => {
    expect(component.paymentLabel('cod')).toContain('Cash on Delivery');
  });

  it('should return correct payment label for card', () => {
    expect(component.paymentLabel('card')).toContain('Card');
  });

  it('should display estimated delivery date', () => {
    expect(component.estimatedDate).not.toBe('');
  });
});
