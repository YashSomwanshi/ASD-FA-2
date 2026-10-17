import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroBannerComponent } from './hero-banner.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeroBannerComponent', () => {
  let component: HeroBannerComponent;
  let fixture: ComponentFixture<HeroBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBannerComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 slides', () => {
    expect(component.slides.length).toBe(3);
  });

  it('should start on slide 0', () => {
    expect(component.currentSlide).toBe(0);
  });

  it('should navigate to next slide with next()', () => {
    component.next();
    expect(component.currentSlide).toBe(1);
  });

  it('should wrap around on next() from last slide', () => {
    component.currentSlide = 2;
    component.next();
    expect(component.currentSlide).toBe(0);
  });

  it('should navigate to previous slide with prev()', () => {
    component.currentSlide = 1;
    component.prev();
    expect(component.currentSlide).toBe(0);
  });

  it('should wrap around on prev() from first slide', () => {
    component.currentSlide = 0;
    component.prev();
    expect(component.currentSlide).toBe(2);
  });

  it('should go to specific slide with goTo()', () => {
    component.goTo(2);
    expect(component.currentSlide).toBe(2);
  });

  it('should render slide dots', () => {
    const dots = fixture.nativeElement.querySelectorAll('.dot');
    expect(dots.length).toBe(3);
  });

  it('should have active class on current slide', () => {
    const slides = fixture.nativeElement.querySelectorAll('.hero-slide');
    expect(slides[0].classList).toContain('active');
  });
});
