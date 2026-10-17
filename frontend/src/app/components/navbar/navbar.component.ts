import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  searchQuery = '';
  isCartOpen = false;
  activeCategory = 'all';
  categories = [
    { id: 'all', label: 'All' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home & Kitchen' },
    { id: 'sports', label: 'Sports' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'books', label: 'Books' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cartCount = this.cartService.getTotalItems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    // Emit search query via service or router
    console.log('Search:', this.searchQuery);
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
  }

  openCart(): void {
    document.dispatchEvent(new CustomEvent('open-cart'));
  }
}
