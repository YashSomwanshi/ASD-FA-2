import { TestBed } from '@angular/core/testing';
import { CheckoutService, ShippingAddress } from './checkout.service';

const mockAddress: ShippingAddress = {
  fullName: 'Yash Somwanshi', phone: '9876543210', email: 'yash@example.com',
  addressLine1: '123 Main Street', addressLine2: 'Near Park',
  city: 'Mumbai', state: 'Maharashtra', pincode: '400001',
  landmark: 'Near Gateway', addressType: 'home'
};

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null order initially', () => {
    expect(service.getOrder()).toBeNull();
  });

  it('should store and retrieve an order', () => {
    const order = {
      items: [{ name: 'Phone', quantity: 1, price: 1000, emoji: '📱' }],
      subtotal: 1000, deliveryFee: 0, discount: 50, total: 950,
      paymentMethod: 'upi', orderId: 'SE12345', address: mockAddress
    };
    service.setOrder(order);
    expect(service.getOrder()).toEqual(order);
  });

  it('should clear order', () => {
    service.setOrder({
      items: [], subtotal: 0, deliveryFee: 0, discount: 0, total: 0,
      paymentMethod: 'cod', orderId: 'SE0001', address: mockAddress
    });
    service.clearOrder();
    expect(service.getOrder()).toBeNull();
  });

  it('should generate unique order IDs with "SE" prefix', () => {
    const id1 = service.generateOrderId();
    const id2 = service.generateOrderId();
    expect(id1).toMatch(/^SE\d+/);
    expect(id2).toMatch(/^SE\d+/);
  });

  it('should generate order IDs of correct length (11 chars: SE + 8 + 3)', () => {
    const id = service.generateOrderId();
    expect(id.length).toBe(13);
  });
});
