import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CheckoutService, OrderSummary } from '../../services/checkout.service';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation-page.component.html',
  styleUrl: './order-confirmation-page.component.css'
})
export class OrderConfirmationPageComponent implements OnInit {
  order: OrderSummary | null = null;
  estimatedDate: string = '';

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.order = this.checkoutService.getOrder();
    if (!this.order) {
      this.router.navigate(['/']);
      return;
    }
    // Estimated delivery: 3–5 business days
    const d = new Date();
    d.setDate(d.getDate() + 5);
    this.estimatedDate = d.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    // Clear after loading so it can't be revisited
    this.checkoutService.clearOrder();
  }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString('en-IN');
  }

  paymentLabel(method: string): string {
    const map: Record<string, string> = {
      cod: '💵 Cash on Delivery',
      upi: '📱 UPI',
      card: '💳 Credit / Debit Card',
      netbanking: '🏦 Net Banking',
      emi: '📅 EMI'
    };
    return map[method] || method;
  }
}
