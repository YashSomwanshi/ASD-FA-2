import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService, Toast } from '../../services/toast.service';
import { Subject } from 'rxjs';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockToastService: { toast$: Subject<Toast | null> };

  beforeEach(async () => {
    mockToastService = { toast$: new Subject<Toast | null>() };

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [{ provide: ToastService, useValue: mockToastService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with null toast', () => {
    expect(component.toast).toBeNull();
  });

  it('should not show toast initially (no "show" class)', () => {
    const toastEl = fixture.nativeElement.querySelector('.toast');
    expect(toastEl.classList).not.toContain('show');
  });

  it('should display message when toast is emitted', () => {
    const toast: Toast = { message: 'Item added to cart!', type: 'success' };
    mockToastService.toast$.next(toast);
    fixture.detectChanges();
    expect(component.toast).toEqual(toast);
    expect(fixture.nativeElement.textContent).toContain('Item added to cart!');
  });

  it('should add "show" class when toast is set', () => {
    mockToastService.toast$.next({ message: 'Hello', type: 'info' });
    fixture.detectChanges();
    const toastEl = fixture.nativeElement.querySelector('.toast');
    expect(toastEl.classList).toContain('show');
  });

  it('should hide when null is emitted', () => {
    mockToastService.toast$.next({ message: 'Hello', type: 'success' });
    fixture.detectChanges();
    mockToastService.toast$.next(null);
    fixture.detectChanges();
    expect(component.toast).toBeNull();
  });

  it('should apply success type', () => {
    mockToastService.toast$.next({ message: 'Success!', type: 'success' });
    fixture.detectChanges();
    const toastEl = fixture.nativeElement.querySelector('.toast');
    expect(toastEl.classList).toContain('success');
  });

  it('should apply error type', () => {
    mockToastService.toast$.next({ message: 'Error!', type: 'error' });
    fixture.detectChanges();
    const toastEl = fixture.nativeElement.querySelector('.toast');
    expect(toastEl.classList).toContain('error');
  });

  it('should apply info type', () => {
    mockToastService.toast$.next({ message: 'Info!', type: 'info' });
    fixture.detectChanges();
    const toastEl = fixture.nativeElement.querySelector('.toast');
    expect(toastEl.classList).toContain('info');
  });

  it('should clean up subscription on destroy', () => {
    spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
  });
});
