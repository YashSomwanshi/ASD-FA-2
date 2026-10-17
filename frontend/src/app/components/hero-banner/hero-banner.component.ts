import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.css'
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoSlide!: Subscription;

  slides = [
    {
      tag: '🔥 Big Billion Days',
      title: 'Massive Deals on Electronics',
      subtitle: 'Up to 70% off on smartphones, laptops & accessories',
      cta: 'Shop Now',
      emoji: '📱',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      accent: '#6c63ff'
    },
    {
      tag: '✨ Fashion Week',
      title: 'Trending Styles, Unreal Prices',
      subtitle: 'Discover latest collections from top brands',
      cta: 'Explore Fashion',
      emoji: '👗',
      gradient: 'linear-gradient(135deg, #2d1b69 0%, #6c0ba9 50%, #a855f7 100%)',
      accent: '#f472b6'
    },
    {
      tag: '🏠 Home Makeover Sale',
      title: 'Transform Your Space',
      subtitle: 'Furniture, décor & appliances at amazing prices',
      cta: 'Shop Home',
      emoji: '🛋️',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      accent: '#34d399'
    }
  ];

  ngOnInit(): void {
    this.autoSlide = interval(4000).subscribe(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    });
  }

  ngOnDestroy(): void {
    this.autoSlide?.unsubscribe();
  }

  goTo(index: number): void {
    this.currentSlide = index;
  }

  prev(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  next(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }
}
