import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'shopeasy_cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  cartItems$ = this.cartItemsSubject.asObservable();

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveToStorage(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = [...this.getCartItems()];
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.updateCart(items);
  }

  removeFromCart(productId: number): void {
    const items = this.getCartItems().filter(i => i.product.id !== productId);
    this.updateCart(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const items = this.getCartItems().map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    this.updateCart(items);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotalItems(): number {
    return this.getCartItems().reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce(
      (sum, i) => sum + i.product.price * i.quantity, 0
    );
  }

  isInCart(productId: number): boolean {
    return this.getCartItems().some(i => i.product.id === productId);
  }

  getItemQuantity(productId: number): number {
    const item = this.getCartItems().find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}
