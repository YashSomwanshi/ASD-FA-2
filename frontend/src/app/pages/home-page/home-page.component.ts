import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent, ProductListComponent],
  template: `
    <app-hero-banner></app-hero-banner>
    <app-product-list></app-product-list>
  `
})
export class HomePageComponent {}
