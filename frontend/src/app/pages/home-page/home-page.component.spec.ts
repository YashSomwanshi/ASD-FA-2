import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    const mockCartService = jasmine.createSpyObj('CartService', [
      'addToCart', 'isInCart', 'getTotalItems'
    ], {
      cartItems$: new BehaviorSubject<CartItem[]>([])
    });
    mockCartService.getTotalItems.and.returnValue(0);
    mockCartService.isInCart.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: mockCartService },
        ToastService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero banner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero-banner')).toBeTruthy();
  });

  it('should render the product list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-product-list')).toBeTruthy();
  });
});
