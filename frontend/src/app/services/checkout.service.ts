import { Injectable } from '@angular/core';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  addressType: 'home' | 'work' | 'other';
}

export interface OrderSummary {
  items: { name: string; quantity: number; price: number; emoji: string }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderId: string;
  address: ShippingAddress;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private currentOrder: OrderSummary | null = null;

  setOrder(order: OrderSummary): void {
    this.currentOrder = order;
  }

  getOrder(): OrderSummary | null {
    return this.currentOrder;
  }

  generateOrderId(): string {
    const prefix = 'SE';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  clearOrder(): void {
    this.currentOrder = null;
  }
}
