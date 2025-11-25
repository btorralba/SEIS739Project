import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockProduct: Product = {
    productImageId: 1,
    productName: 'Night Reaper',
    price: 99.99,
    sku: 'SKU001'
  } as Product;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'getCurrentNavigation']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockProductService = jasmine.createSpyObj('ProductService', ['getSKU', 'addItemsToCart']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);

    const mockNavigation: Partial<Navigation> = {
      extras: {
        state: {
          product: mockProduct
        }
      }
    };
    mockRouter.getCurrentNavigation.and.returnValue(mockNavigation as Navigation);

    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the product component', () => {
      expect(component).toBeTruthy();
    });

    it('should have filter options defined', () => {
      expect(component.filterOptions).toBeDefined();
      expect(component.filterOptions.colors).toEqual(['Black', 'Tan']);
      expect(component.filterOptions.sizes).toEqual(['Small', 'Medium', 'Large', 'X-Large', 'XX-Large']);
    });

    it('should have filters form group', () => {
      expect(component.filters).toBeDefined();
      expect(component.filters.controls['colors']).toBeDefined();
      expect(component.filters.controls['quantity']).toBeDefined();
      expect(component.filters.controls['sizes']).toBeDefined();
    });

    it('should initialize filters with default values', () => {
      expect(component.filters.controls['colors'].value).toBe('');
      expect(component.filters.controls['quantity'].value).toBe(1);
      expect(component.filters.controls['sizes'].value).toBe('');
    });

    it('should load product from router state', () => {
      expect(component.product).toBeDefined();
      expect(component.product.productName).toBe('Night Reaper');
      expect(component.product.price).toBe(99.99);
    });

    it('should get product data from navigation extras', () => {
      expect(mockRouter.getCurrentNavigation).toHaveBeenCalled();
      expect(component.product).toEqual(mockProduct);
    });

    it('should have product properties set correctly', () => {
      expect(component.product.productImageId).toBe(1);
      expect(component.product.productName).toBe('Night Reaper');
      expect(component.product.price).toBe(99.99);
    });
  });

  describe('addToCart()', () => {
    beforeEach(() => {
      mockProductService.getSKU.and.returnValue(of({ message: 'SKU001' }));
    });

    it('should add item to cart with valid color and size', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(2);

      component.addToCart();
      tick();

      expect(mockProductService.getSKU).toHaveBeenCalled();
      expect(mockProductService.addItemsToCart).toHaveBeenCalled();
    }));

    it('should show success snack bar when item added', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(1);

      component.addToCart();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '1 Night Reaper added to cart',
        'Close',
        { duration: 2000 }
      );
    }));

    it('should show error snack bar when color not selected', () => {
      component.filters.controls['colors'].setValue('');
      component.filters.controls['sizes'].setValue('Medium');

      component.addToCart();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Select a color, size, and quantity',
        'Close',
        { duration: 2000 }
      );
    });

    it('should show error snack bar when size not selected', () => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('');

      component.addToCart();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Select a color, size, and quantity',
        'Close',
        { duration: 2000 }
      );
    });

    it('should show error snack bar when both color and size not selected', () => {
      component.filters.controls['colors'].setValue('');
      component.filters.controls['sizes'].setValue('');

      component.addToCart();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Select a color, size, and quantity',
        'Close',
        { duration: 2000 }
      );
    });

    it('should not call getSKU when validation fails', () => {
      component.filters.controls['colors'].setValue('');
      component.filters.controls['sizes'].setValue('Medium');

      component.addToCart();

      expect(mockProductService.getSKU).not.toHaveBeenCalled();
    });

    it('should not call addItemsToCart when validation fails', () => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('');

      component.addToCart();

      expect(mockProductService.addItemsToCart).not.toHaveBeenCalled();
    });

    it('should show correct quantity in success message', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(5);

      component.addToCart();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '5 Night Reaper added to cart',
        'Close',
        { duration: 2000 }
      );
    }));

    it('should handle Tan color selection', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Tan');
      component.filters.controls['sizes'].setValue('Large');

      component.addToCart();
      tick();

      expect(mockProductService.getSKU).toHaveBeenCalled();
    }));

    it('should handle all size options', fakeAsync(() => {
      const sizes = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];

      for (const size of sizes) {
        mockProductService.getSKU.calls.reset();
        mockProductService.addItemsToCart.calls.reset();

        component.filters.controls['colors'].setValue('Black');
        component.filters.controls['sizes'].setValue(size);

        component.addToCart();
        tick();

        expect(mockProductService.getSKU).toHaveBeenCalled();
      }
    }));

    it('should handle quantity of 1', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(1);

      component.addToCart();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '1 Night Reaper added to cart',
        'Close',
        { duration: 2000 }
      );
    }));

    it('should handle large quantity values', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(100);

      component.addToCart();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '100 Night Reaper added to cart',
        'Close',
        { duration: 2000 }
      );
    }));
  });

  describe('addProductToCart()', () => {
    it('should call getSKU with correct parameters', fakeAsync(() => {
      const selectedProduct = {
        color: 'Black',
        quantity: 2,
        size: 'Medium',
        name: 'Night Reaper',
        productImageId: 1,
        price: 99.99
      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU001' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(mockProductService.getSKU).toHaveBeenCalledWith('Night Reaper', 'Black', 'Medium');
    }));

    it('should add SKU to selected product', fakeAsync(() => {
      const selectedProduct = {
        color: 'Black',
        quantity: 2,
        size: 'Medium',
        name: 'Night Reaper',
        productImageId: 1,
        price: 99.99,
        sku: 'SKU001'
      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU001' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(selectedProduct.sku).toBe('SKU001');
    }));

    it('should call addItemsToCart with product containing SKU', fakeAsync(() => {
      const selectedProduct = {
        color: 'Black',
        quantity: 2,
        size: 'Medium',
        name: 'Night Reaper',
        productImageId: 1,
        price: 99.99
      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU001' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(mockProductService.addItemsToCart).toHaveBeenCalledWith(jasmine.objectContaining({
        sku: 'SKU001',
        name: 'Night Reaper',
        color: 'Black',
        size: 'Medium'
      }));
    }));

    it('should handle different SKU values', fakeAsync(() => {
      const selectedProduct = {
        color: 'Tan',
        quantity: 1,
        size: 'Large',
        name: 'Phantom Recon',
        productImageId: 2,
        price: 109.99,
        sku: 'SKU001'

      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU002' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(selectedProduct.sku).toBe('SKU002');
    }));

    it('should maintain all product properties when adding to cart', fakeAsync(() => {
      const selectedProduct = {
        color: 'Black',
        quantity: 3,
        size: 'Small',
        name: 'St Michael',
        productImageId: 3,
        price: 89.99
      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU003' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(selectedProduct.name).toBe('St Michael');
      expect(selectedProduct.quantity).toBe(3);
      expect(selectedProduct.color).toBe('Black');
      expect(selectedProduct.size).toBe('Small');
      expect(selectedProduct.productImageId).toBe(3);
      expect(selectedProduct.price).toBe(89.99);
    }));

    it('should call getSKU with Tan color', fakeAsync(() => {
      const selectedProduct = {
        color: 'Tan',
        quantity: 1,
        size: 'Medium',
        name: 'Modern Crusader',
        productImageId: 4,
        price: 79.99
      };

      mockProductService.getSKU.and.returnValue(of({ message: 'SKU004' }));

      component.addProductToCart(selectedProduct);
      tick();

      expect(mockProductService.getSKU).toHaveBeenCalledWith('Modern Crusader', 'Tan', 'Medium');
    }));
  });

  describe('navigateHome()', () => {
    it('should navigate to home page', () => {
      component.navigateHome();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should call router navigateByUrl method', () => {
      component.navigateHome();

      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    });

    it('should navigate to correct URL', () => {
      component.navigateHome();

      const callArgs = mockRouter.navigateByUrl.calls.mostRecent().args[0];
      expect(callArgs).toBe('/');
    });

    it('should not affect other component state when navigating home', () => {
      component.filters.controls['colors'].setValue('Black');
      const originalColor = component.filters.controls['colors'].value;

      component.navigateHome();

      expect(component.filters.controls['colors'].value).toBe(originalColor);
    });
  });

  describe('Integration Tests', () => {
    beforeEach(() => {
      mockProductService.getSKU.and.returnValue(of({ message: 'SKU001' }));
    });

    it('should handle complete add to cart flow', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(2);

      component.addToCart();
      tick();

      expect(mockProductService.getSKU).toHaveBeenCalledWith('Night Reaper', 'Black', 'Medium');
      expect(mockProductService.addItemsToCart).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        '2 Night Reaper added to cart',
        'Close',
        { duration: 2000 }
      );
    }));

    it('should handle multiple add to cart attempts', fakeAsync(() => {
      // First attempt
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.addToCart();
      tick();

      expect(mockProductService.addItemsToCart).toHaveBeenCalledTimes(1);

      // Second attempt with different selections
      mockProductService.addItemsToCart.calls.reset();
      component.filters.controls['colors'].setValue('Tan');
      component.filters.controls['sizes'].setValue('Large');
      component.addToCart();
      tick();

      expect(mockProductService.addItemsToCart).toHaveBeenCalledTimes(1);
    }));

    it('should handle validation failure then success', () => {
      // First attempt - validation fails
      component.filters.controls['colors'].setValue('');
      component.filters.controls['sizes'].setValue('Medium');
      component.addToCart();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Select a color, size, and quantity',
        'Close',
        { duration: 2000 }
      );

      mockSnackBar.open.calls.reset();
      mockProductService.getSKU.calls.reset();

      // Second attempt - validation passes
      component.filters.controls['colors'].setValue('Black');
      component.addToCart();

      expect(mockProductService.getSKU).toHaveBeenCalled();
    });

    it('should add to cart and then navigate home', fakeAsync(() => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');

      component.addToCart();
      tick();

      expect(mockProductService.addItemsToCart).toHaveBeenCalled();

      component.navigateHome();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    }));

    it('should handle product information access', () => {
      expect(component.product.productName).toBe('Night Reaper');
      expect(component.product.price).toBe(99.99);

      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');

      const colorSelected = component.filters.controls['colors'].value;
      const sizeSelected = component.filters.controls['sizes'].value;

      expect(colorSelected).toBe('Black');
      expect(sizeSelected).toBe('Medium');
    });
  });

  describe('Filter Form Controls', () => {
    it('should allow setting color value', () => {
      component.filters.controls['colors'].setValue('Black');
      expect(component.filters.controls['colors'].value).toBe('Black');
    });

    it('should allow setting size value', () => {
      component.filters.controls['sizes'].setValue('Large');
      expect(component.filters.controls['sizes'].value).toBe('Large');
    });

    it('should allow setting quantity value', () => {
      component.filters.controls['quantity'].setValue(5);
      expect(component.filters.controls['quantity'].value).toBe(5);
    });

    it('should allow changing quantity after initial set', () => {
      component.filters.controls['quantity'].setValue(1);
      expect(component.filters.controls['quantity'].value).toBe(1);

      component.filters.controls['quantity'].setValue(10);
      expect(component.filters.controls['quantity'].value).toBe(10);
    });

    it('should handle all color options', () => {
      const colors = ['Black', 'Tan'];

      for (const color of colors) {
        component.filters.controls['colors'].setValue(color);
        expect(component.filters.controls['colors'].value).toBe(color);
      }
    });

    it('should have form valid state', () => {
      expect(component.filters.valid).toBeTruthy();
    });

    it('should maintain form state after multiple changes', () => {
      component.filters.controls['colors'].setValue('Black');
      component.filters.controls['sizes'].setValue('Medium');
      component.filters.controls['quantity'].setValue(3);

      expect(component.filters.controls['colors'].value).toBe('Black');
      expect(component.filters.controls['sizes'].value).toBe('Medium');
      expect(component.filters.controls['quantity'].value).toBe(3);
    });
  });
});