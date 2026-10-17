import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent implements OnInit, OnDestroy {
  isOpen = false;
  cartItems: CartItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    public cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
      });

    // Listen to cart open event
    document.addEventListener('open-cart', () => this.open());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open(): void { this.isOpen = true; }
  close(): void { this.isOpen = false; }

  increase(productId: number, qty: number): void {
    this.cartService.updateQuantity(productId, qty + 1);
  }

  decrease(productId: number, qty: number): void {
    this.cartService.updateQuantity(productId, qty - 1);
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.toastService.show('Item removed from cart', 'info');
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.show('Cart cleared', 'info');
  }

  checkout(): void {
    this.close();
    this.router.navigate(['/checkout']);
  }

  get totalItems(): number { return this.cartService.getTotalItems(); }
  get totalPrice(): number { return this.cartService.getTotalPrice(); }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString('en-IN');
  }
}
