import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailPageComponent } from './product-detail-page.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Product } from '../../models/product.model';

const mockProduct: Product = {
  id: 1,
  name: 'Samsung Galaxy S24',
  category: 'electronics',
  price: 109999,
  originalPrice: 134999,
  discount: 19,
  rating: 4.7,
  reviewCount: 1200,
  emoji: '📱',
  badge: 'Best Seller',
  inStock: true,
  description: 'Flagship smartphone with cutting-edge features.'
};

describe('ProductDetailPageComponent', () => {
  let component: ProductDetailPageComponent;
  let fixture: ComponentFixture<ProductDetailPageComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductById']);
    mockProductService.getProductById.and.returnValue(mockProduct);

    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockToastService = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailPageComponent, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: ToastService, useValue: mockToastService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product by id from route params', () => {
    expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
  });

  it('should start with quantity of 1', () => {
    expect(component.quantity).toBe(1);
  });

  it('should increment quantity on increaseQty()', () => {
    component.increaseQty();
    expect(component.quantity).toBe(2);
  });

  it('should decrement quantity on decreaseQty()', () => {
    component.quantity = 3;
    component.decreaseQty();
    expect(component.quantity).toBe(2);
  });

  it('should not go below 1 on decreaseQty()', () => {
    component.quantity = 1;
    component.decreaseQty();
    expect(component.quantity).toBe(1);
  });

  it('should call cartService.addToCart on addToCart()', () => {
    component.addToCart();
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, component.quantity);
  });

  it('should call toastService.show on addToCart()', () => {
    component.addToCart();
    expect(mockToastService.show).toHaveBeenCalled();
  });

  it('should display product name', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Samsung Galaxy S24');
  });

  it('should display product emoji', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('📱');
  });

  it('should display product price', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('₹');
  });

  it('should format price with Indian locale', () => {
    const formatted = component.formatPrice(109999);
    expect(formatted).toContain('₹');
    expect(formatted).toContain('1,09,999');
  });

  it('should show product as null when id not found', () => {
    mockProductService.getProductById.and.returnValue(undefined);
    component.ngOnInit();
    expect(component.product).toBeUndefined();
  });
});
