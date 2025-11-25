import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent, Item } from './cart.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CartComponent>>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockProductService = jasmine.createSpyObj('ProductService', ['getCart']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the cart component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty items array', () => {
      expect(component.items).toEqual([]);
    });

    it('should have injected MatDialogRef', () => {
      expect(component.dialogRef).toBeTruthy();
    });
  });

  describe('ngOnInit()', () => {
    it('should load items from product service on init', () => {
      const mockItems: Item[] = [
        { quantity: 2, size: 'M', sku: 'SKU001', name: 'Product1', color: 'Red' },
        { quantity: 1, size: 'L', sku: 'SKU002', name: 'Product2', color: 'Blue' }
      ];
      mockProductService.getCart.and.returnValue(mockItems);

      component.ngOnInit();

      expect(mockProductService.getCart).toHaveBeenCalled();
      expect(component.items).toEqual(mockItems);
    });

    it('should handle empty cart from service', () => {
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.items).toEqual([]);
    });

    it('should populate items array with single item', () => {
      const mockItem: Item[] = [
        { quantity: 5, size: 'XL', sku: 'SKU003', name: 'Product3', color: 'Green' }
      ];
      mockProductService.getCart.and.returnValue(mockItem);

      component.ngOnInit();

      expect(component.items.length).toBe(1);
      expect(component.items[0]).toEqual(mockItem[0]);
    });

    it('should populate items array with multiple items', () => {
      const mockItems: Item[] = [
        { quantity: 2, size: 'M', sku: 'SKU001', name: 'Product1', color: 'Red' },
        { quantity: 1, size: 'L', sku: 'SKU002', name: 'Product2', color: 'Blue' },
        { quantity: 3, size: 'S', sku: 'SKU003', name: 'Product3', color: 'Yellow' }
      ];
      mockProductService.getCart.and.returnValue(mockItems);

      component.ngOnInit();

      expect(component.items.length).toBe(3);
      expect(component.items).toEqual(mockItems);
    });

    it('should call getCart exactly once during initialization', () => {
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(mockProductService.getCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('close()', () => {
    it('should close the dialog without data', () => {
      component.close();

      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should close the dialog when called', () => {
      component.close();

      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should call dialogRef.close exactly once', () => {
      component.close();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkout()', () => {
    it('should navigate to checkout page', () => {
      component.checkout();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
    });

    it('should close dialog with TEST message', () => {
      component.checkout();

      expect(mockDialogRef.close).toHaveBeenCalledWith('TEST');
    });

    it('should navigate and close dialog', () => {
      component.checkout();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
      expect(mockDialogRef.close).toHaveBeenCalledWith('TEST');
    });

    it('should call navigateByUrl exactly once', () => {
      component.checkout();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(1);
    });

    it('should call dialogRef.close exactly once', () => {
      component.checkout();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should navigate to correct checkout URL', () => {
      component.checkout();

      const navigateCall = mockRouter.navigateByUrl.calls.mostRecent();
      expect(navigateCall.args[0]).toBe('/checkout');
    });

    it('should close dialog with correct message', () => {
      component.checkout();

      const closeCall = mockDialogRef.close.calls.mostRecent();
      expect(closeCall.args[0]).toBe('TEST');
    });
  });

  describe('Item Interface', () => {
    it('should have Item with all required properties', () => {
      const item: Item = {
        quantity: 2,
        size: 'M',
        sku: 'SKU001',
        name: 'Test Product',
        color: 'Red'
      };

      expect(item.quantity).toBe(2);
      expect(item.size).toBe('M');
      expect(item.sku).toBe('SKU001');
      expect(item.name).toBe('Test Product');
      expect(item.color).toBe('Red');
    });
  });

  describe('Integration Tests', () => {
    it('should load cart items and be able to checkout', () => {
      const mockItems: Item[] = [
        { quantity: 1, size: 'L', sku: 'SKU001', name: 'Product1', color: 'Blue' }
      ];
      mockProductService.getCart.and.returnValue(mockItems);

      component.ngOnInit();
      expect(component.items).toEqual(mockItems);

      component.checkout();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
      expect(mockDialogRef.close).toHaveBeenCalledWith('TEST');
    });

    it('should load cart items and be able to close without checkout', () => {
      const mockItems: Item[] = [
        { quantity: 2, size: 'M', sku: 'SKU001', name: 'Product1', color: 'Red' }
      ];
      mockProductService.getCart.and.returnValue(mockItems);

      component.ngOnInit();
      expect(component.items).toEqual(mockItems);

      component.close();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
      expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should handle empty cart and checkout', () => {
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();
      expect(component.items).toEqual([]);

      component.checkout();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/checkout');
    });
  });
});