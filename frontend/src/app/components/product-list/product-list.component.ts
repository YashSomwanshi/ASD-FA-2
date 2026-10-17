import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  dealProducts: Product[] = [];
  activeCategory = 'all';
  sortBy = 'default';
  searchQuery = '';

  categories = [
    { id: 'all', label: 'All', emoji: '🏪' },
    { id: 'electronics', label: 'Electronics', emoji: '📱' },
    { id: 'fashion', label: 'Fashion', emoji: '👕' },
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'beauty', label: 'Beauty', emoji: '💄' },
    { id: 'books', label: 'Books', emoji: '📚' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
    this.dealProducts = this.productService.getDealProducts();
    this.applyFilters();
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.searchQuery.trim()
      ? this.productService.searchProducts(this.searchQuery)
      : this.productService.getProductsByCategory(this.activeCategory);

    this.filteredProducts = this.productService.sortProducts(result, this.sortBy);
  }
}
