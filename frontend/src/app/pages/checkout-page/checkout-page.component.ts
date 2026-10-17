import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { CheckoutService, ShippingAddress } from '../../services/checkout.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {
  currentStep = 1; // 1: Address, 2: Payment, 3: Review
  isPlacingOrder = false;

  address: ShippingAddress = {
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home'
  };

  paymentMethod = 'cod';

  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
  ];

  constructor(
    public cartService: CartService,
    private checkoutService: CheckoutService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.cartService.getTotalItems() === 0) {
      this.router.navigate(['/']);
    }
  }

  get cartItems() { return this.cartService.getCartItems(); }
  get subtotal(): number { return this.cartService.getTotalPrice(); }
  get deliveryFee(): number { return this.subtotal > 499 ? 0 : 49; }
  get discount(): number { return Math.floor(this.subtotal * 0.05); }
  get grandTotal(): number { return this.subtotal + this.deliveryFee - this.discount; }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString('en-IN');
  }

  isStep1Valid(): boolean {
    return !!(
      this.address.fullName?.trim() &&
      this.address.phone?.match(/^[6-9]\d{9}$/) &&
      this.address.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      this.address.addressLine1?.trim() &&
      this.address.city?.trim() &&
      this.address.state &&
      this.address.pincode?.match(/^\d{6}$/)
    );
  }

  nextStep(): void {
    if (this.currentStep === 1 && !this.isStep1Valid()) {
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number): void {
    if (step < this.currentStep) this.currentStep = step;
  }

  placeOrder(): void {
    this.isPlacingOrder = true;
    setTimeout(() => {
      const order = {
        items: this.cartService.getCartItems().map((i: CartItem) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price * i.quantity,
          emoji: i.product.emoji
        })),
        subtotal: this.subtotal,
        deliveryFee: this.deliveryFee,
        discount: this.discount,
        total: this.grandTotal,
        paymentMethod: this.paymentMethod,
        orderId: this.checkoutService.generateOrderId(),
        address: { ...this.address }
      };
      this.checkoutService.setOrder(order);
      this.cartService.clearCart();
      this.isPlacingOrder = false;
      this.router.navigate(['/order-confirmation']);
    }, 1800);
  }
}
