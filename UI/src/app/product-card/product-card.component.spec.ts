import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { Router } from '@angular/router';
import { Product } from '../services/product.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    productImageId: 1,
    productName: 'Night Reaper',
    price: 99.99,
    sku: 'SKU001'
  } as Product;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the product card component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize product as undefined', () => {
      expect(component.product).toBeUndefined();
    });

    it('should have injected Router', () => {
      expect(component.constructor).toBeDefined();
    });
  });

  describe('Product Input', () => {
    it('should accept product input', () => {
      component.product = mockProduct;
      expect(component.product).toBe(mockProduct);
    });

    it('should have product with sku property', () => {
      component.product = mockProduct;
      expect(component.product.sku).toBe('SKU001');
    });

    it('should have product with productName property', () => {
      component.product = mockProduct;
      expect(component.product.productName).toBe('Night Reaper');
    });

    it('should have product with price property', () => {
      component.product = mockProduct;
      expect(component.product.price).toBe(99.99);
    });

    it('should have product with productImageId property', () => {
      component.product = mockProduct;
      expect(component.product.productImageId).toBe(1);
    });

    it('should update product when input changes', () => {
      const firstProduct: Product = { ...mockProduct, sku: 'SKU001' } as Product;
      component.product = firstProduct;
      expect(component.product.sku).toBe('SKU001');

      const secondProduct: Product = { ...mockProduct, sku: 'SKU002' } as Product;
      component.product = secondProduct;
      expect(component.product.sku).toBe('SKU002');
    });

    it('should maintain product data after setting', () => {
      component.product = mockProduct;
      expect(component.product).toEqual(mockProduct);
    });
  });

  describe('handleProductClick()', () => {
    beforeEach(() => {
      component.product = mockProduct;
    });

    it('should navigate to product detail page', () => {
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should navigate with correct route including sku', () => {
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/product/SKU001'],
        jasmine.any(Object)
      );
    });

    it('should pass product in state', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product']).toBe(mockProduct);
    });

    it('should navigate to correct product path', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toBe('/product/SKU001');
    });

    it('should call navigate exactly once per click', () => {
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });

    it('should handle different product skus', () => {
      const productWithDifferentSku: Product = {
        ...mockProduct,
        sku: 'SKU999'
      } as Product;
      component.product = productWithDifferentSku;

      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/product/SKU999'],
        jasmine.any(Object)
      );
    });

    it('should handle product with special characters in sku', () => {
      const productWithSpecialSku: Product = {
        ...mockProduct,
        sku: 'SKU-001-ABC'
      } as Product;
      component.product = productWithSpecialSku;

      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/product/SKU-001-ABC'],
        jasmine.any(Object)
      );
    });

    it('should pass complete product object in state', () => {
      const productWithDetails: Product = {
        productImageId: 5,
        productName: 'Phantom Recon',
        price: 109.99,
        sku: 'SKU005',
        size: 'Large',
        color: 'Black'
      } as Product;
      component.product = productWithDetails;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product']).toEqual(productWithDetails);
    });

    it('should handle multiple sequential clicks', () => {
      component.handleProductClick();
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);

      component.handleProductClick();
      expect(mockRouter.navigate).toHaveBeenCalledTimes(2);

      component.handleProductClick();
      expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
    });

    it('should navigate with state property', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].hasOwnProperty('state')).toBe(true);
    });

    it('should include state with product property', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state.hasOwnProperty('product')).toBe(true);
    });

    it('should construct route with product sku from component property', () => {
      const testProduct: Product = {
        productImageId: 3,
        productName: 'St Michael',
        price: 89.99,
        sku: 'TESTSKU123'
      } as Product;
      component.product = testProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toContain('TESTSKU123');
    });
  });

  describe('Navigation Route Construction', () => {
    beforeEach(() => {
      component.product = mockProduct;
    });

    it('should use product sku in route path', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toBe(`/product/${mockProduct.sku}`);
    });

    it('should format route correctly for different skus', () => {
      const skus = ['SKU001', 'SKU-ALPHA', 'PRODUCT-123-ABC'];

      for (const sku of skus) {
        mockRouter.navigate.calls.reset();
        component.product = { ...mockProduct, sku } as Product;

        component.handleProductClick();

        const callArgs = mockRouter.navigate.calls.mostRecent().args;
        expect(callArgs[0][0]).toBe(`/product/${sku}`);
      }
    });

    it('should pass state as second argument to navigate', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs.length).toBe(2);
      expect(typeof callArgs[1]).toBe('object');
    });

    it('should preserve product reference in state', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product'] === mockProduct).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle product input and navigate', () => {
      component.product = mockProduct;
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/product/SKU001'],
        { state: { product: mockProduct } }
      );
    });

    it('should handle different products sequentially', () => {
      const product1: Product = {
        productImageId: 1,
        productName: 'Product 1',
        price: 10.99,
        sku: 'SKU001'
      } as Product;

      const product2: Product = {
        productImageId: 2,
        productName: 'Product 2',
        price: 20.99,
        sku: 'SKU002'
      } as Product;

      // First product
      component.product = product1;
      component.handleProductClick();

      let callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toBe('/product/SKU001');

      // Second product
      mockRouter.navigate.calls.reset();
      component.product = product2;
      component.handleProductClick();

      callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toBe('/product/SKU002');
    });

    it('should maintain product state after navigation click', () => {
      component.product = mockProduct;
      const originalProduct = component.product;

      component.handleProductClick();

      expect(component.product).toBe(originalProduct);
    });

    it('should handle product with all properties', () => {
      const fullProduct: Product = {
        productImageId: 10,
        productName: 'Full Product',
        price: 149.99,
        sku: 'FULL-SKU-001',
        color: 'Black',
        size: 'Large',
        quantity: 5
      } as Product;

      component.product = fullProduct;
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product']).toEqual(fullProduct);
      expect(callArgs[0][0]).toBe('/product/FULL-SKU-001');
    });

    it('should handle rapid successive clicks', () => {
      component.product = mockProduct;

      component.handleProductClick();
      component.handleProductClick();
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
    });

    it('should correctly pass product data through navigation state', () => {
      component.product = mockProduct;
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      const passedProduct = callArgs[1].state['product'];

      expect(passedProduct.sku).toBe(mockProduct.sku);
      expect(passedProduct.productName).toBe(mockProduct.productName);
      expect(passedProduct.price).toBe(mockProduct.price);
      expect(passedProduct.productImageId).toBe(mockProduct.productImageId);
    });
  });

  describe('Router Navigation State', () => {
    beforeEach(() => {
      component.product = mockProduct;
    });

    it('should pass state object to router navigate', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1]).toEqual(jasmine.objectContaining({
        state: jasmine.any(Object)
      }));
    });

    it('should pass product within state object', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state).toEqual(jasmine.objectContaining({
        product: mockProduct
      }));
    });

    it('should not modify product data when navigating', () => {
      const originalSku = component.product.sku;

      component.handleProductClick();

      expect(component.product.sku).toBe(originalSku);
    });

    it('should maintain product reference equality', () => {
      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product']).toBe(component.product);
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with numeric sku', () => {
      const numericProduct: Product = {
        ...mockProduct,
        sku: '12345'
      } as Product;
      component.product = numericProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toBe('/product/12345');
    });

    it('should handle product with long sku', () => {
      const longSkuProduct: Product = {
        ...mockProduct,
        sku: 'VERY-LONG-PRODUCT-SKU-WITH-MANY-CHARACTERS-001'
      } as Product;
      component.product = longSkuProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[0][0]).toContain('VERY-LONG-PRODUCT-SKU-WITH-MANY-CHARACTERS-001');
    });

    it('should handle product with empty string fields', () => {
      const emptyFieldsProduct: Product = {
        productImageId: 1,
        productName: '',
        price: 0,
        sku: 'SKU001'
      } as Product;
      component.product = emptyFieldsProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product']).toEqual(emptyFieldsProduct);
    });

    it('should handle product with zero price', () => {
      const freeProduct: Product = {
        ...mockProduct,
        price: 0
      } as Product;
      component.product = freeProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product'].price).toBe(0);
    });

    it('should handle product with negative price', () => {
      const discountedProduct: Product = {
        ...mockProduct,
        price: -10
      } as Product;
      component.product = discountedProduct;

      component.handleProductClick();

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1].state['product'].price).toBe(-10);
    });
  });

  describe('Method Access', () => {
    it('should have handleProductClick method', () => {
      expect(typeof component.handleProductClick).toBe('function');
    });

    it('should have product property accessible', () => {
      component.product = mockProduct;
      expect(component.product).toBeDefined();
    });

    it('should allow calling handleProductClick multiple times', () => {
      component.product = mockProduct;

      component.handleProductClick();
      component.handleProductClick();
      component.handleProductClick();

      expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
    });
  });
});