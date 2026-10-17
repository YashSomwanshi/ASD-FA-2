import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { CartService } from '../../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getTotalItems'], {
      cartItems$: new BehaviorSubject<CartItem[]>([])
    });
    mockCartService.getTotalItems.and.returnValue(0);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule, FormsModule],
      providers: [{ provide: CartService, useValue: mockCartService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all categories defined', () => {
    expect(component.categories.length).toBe(7);
  });

  it('should start with "all" as active category', () => {
    expect(component.activeCategory).toBe('all');
  });

  it('should change active category on setCategory()', () => {
    component.setCategory('electronics');
    expect(component.activeCategory).toBe('electronics');
  });

  it('should render the logo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')).toBeTruthy();
  });

  it('should render search input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#search-input')).toBeTruthy();
  });

  it('should render cart button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#cart-btn')).toBeTruthy();
  });

  it('should not show cart badge when cart is empty', () => {
    component.cartCount = 0;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.cart-badge');
    expect(badge).toBeFalsy();
  });

  it('should show cart badge when items exist', () => {
    component.cartCount = 3;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.cart-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('3');
  });

  it('should update cartCount from cartService observable', () => {
    mockCartService.getTotalItems.and.returnValue(5);
    (mockCartService.cartItems$ as BehaviorSubject<CartItem[]>).next([
      { product: {} as any, quantity: 5 }
    ]);
    expect(component.cartCount).toBe(5);
  });
});
