import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { AuthenticationService, Customer } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'getIsLoggedIn',
      'getLoggedInUserCustomer'
    ]);
    mockProductService = jasmine.createSpyObj('ProductService', ['getCart', 'setCart']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockOrderService = jasmine.createSpyObj('OrderService', [
      'submitPayment',
      'submitShipping',
      'submitOrder'
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Set default return values
    mockAuthService.getIsLoggedIn.and.returnValue(true);
    mockProductService.getCart.and.returnValue([]);
    mockAuthService.getLoggedInUserCustomer.and.returnValue({
      customerId: 1,
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com'
    } as Customer);

    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent,
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ProductService, useValue: mockProductService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: OrderService, useValue: mockOrderService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the checkout component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoggedIn).toBe(false);
      expect(component.cartTotal).toBe(0);
      expect(component.finalTotal).toBe(0);
      expect(component.shipping).toBe(0);
      expect(component.taxes).toBe(0);
      expect(component.cart).toEqual([]);
      expect(component.isOrderSubmitted).toBe(false);
    });

    it('should have valid form groups', () => {
      expect(component.shippingInfo).toBeTruthy();
      expect(component.paymentInfo).toBeTruthy();
    });
  });

  describe('ngOnInit()', () => {
    it('should set isLoggedIn from auth service', () => {
      mockAuthService.getIsLoggedIn.and.returnValue(true);
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.isLoggedIn).toBe(true);
    });

    it('should load cart from product service', () => {
      const mockCart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];
      mockProductService.getCart.and.returnValue(mockCart);

      component.ngOnInit();

      expect(component.cart).toEqual(mockCart);
    });

    it('should set current customer from auth service', () => {
      const mockCustomer: Customer = {
        customerId: 1,
        firstName: 'Jane',
        lastName: 'Smith',
        emailAddress: 'jane@example.com',
        phoneNumber: ''
      };
      mockAuthService.getLoggedInUserCustomer.and.returnValue(mockCustomer);
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.currCustomer).toEqual(mockCustomer);
    });

    it('should populate payment info with customer data', () => {
      const mockCustomer: Customer = {
        customerId: 1,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      mockAuthService.getLoggedInUserCustomer.and.returnValue(mockCustomer);
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.paymentInfo.controls['firstName'].value).toBe('John');
      expect(component.paymentInfo.controls['lastName'].value).toBe('Doe');
    });

    it('should populate shipping info with customer data', () => {
      const mockCustomer: Customer = {
        customerId: 1,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      mockAuthService.getLoggedInUserCustomer.and.returnValue(mockCustomer);
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.shippingInfo.controls['firstName'].value).toBe('John');
      expect(component.shippingInfo.controls['lastName'].value).toBe('Doe');
    });

    it('should call calculateCartTotal during init', () => {
      spyOn(component, 'calculateCartTotal');
      mockProductService.getCart.and.returnValue([]);

      component.ngOnInit();

      expect(component.calculateCartTotal).toHaveBeenCalled();
    });
  });

  describe('calculateCartTotal()', () => {
    it('should calculate total for single item', () => {
      component.cart = [{ price: 50 }];

      component.calculateCartTotal();

      expect(component.cartTotal).toBe(50);
    });

    it('should calculate total for multiple items', () => {
      component.cart = [
        { price: 50 },
        { price: 30 },
        { price: 20 }
      ];

      component.calculateCartTotal();

      expect(component.cartTotal).toBe(100);
    });

    it('should handle empty cart', () => {
      component.cart = [];

      component.calculateCartTotal();

      expect(component.cartTotal).toBe(0);
    });

    it('should call calculateFinalTotal', () => {
      spyOn(component, 'calculateFinalTotal');
      component.cart = [{ price: 50 }];

      component.calculateCartTotal();

      expect(component.calculateFinalTotal).toHaveBeenCalled();
    });

    it('should reset cart total before calculation', () => {
      component.cartTotal = 999;
      component.cart = [{ price: 50 }];

      component.calculateCartTotal();

      expect(component.cartTotal).toBe(50);
    });
  });

  describe('getIsLoggedIn()', () => {
    it('should return true when logged in', () => {
      mockAuthService.getIsLoggedIn.and.returnValue(true);

      const result = component.getIsLoggedIn();

      expect(result).toBe(true);
    });

    it('should return false when not logged in', () => {
      mockAuthService.getIsLoggedIn.and.returnValue(false);

      const result = component.getIsLoggedIn();

      expect(result).toBe(false);
    });

    it('should call auth service', () => {
      mockAuthService.getIsLoggedIn.and.returnValue(true);

      component.getIsLoggedIn();

      expect(mockAuthService.getIsLoggedIn).toHaveBeenCalled();
    });
  });

  describe('removeItem()', () => {
    it('should remove item from cart by index', () => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 },
        { sku: 'SKU003', price: 20 }
      ];

      component.removeItem(1);

      expect(component.cart.length).toBe(2);
      expect(component.cart[1].sku).toBe('SKU003');
    });

    it('should remove first item', () => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];

      component.removeItem(0);

      expect(component.cart[0].sku).toBe('SKU002');
    });

    it('should remove last item', () => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];

      component.removeItem(1);

      expect(component.cart.length).toBe(1);
      expect(component.cart[0].sku).toBe('SKU001');
    });

    it('should call product service setCart', () => {
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.removeItem(0);

      expect(mockProductService.setCart).toHaveBeenCalled();
    });

    it('should call calculateCartTotal', () => {
      spyOn(component, 'calculateCartTotal');
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.removeItem(0);

      expect(component.calculateCartTotal).toHaveBeenCalled();
    });

    it('should update cart in product service', () => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];

      component.removeItem(0);

      expect(mockProductService.setCart).toHaveBeenCalledWith([{ sku: 'SKU002', price: 30 }]);
    });
  });

  describe('calculateFinalTotal()', () => {
    it('should apply no shipping fee when total over 100', () => {
      component.cartTotal = 150;

      component.calculateFinalTotal();

      expect(component.shipping).toBe(0);
    });

    it('should apply 10 dollar shipping fee when total under or equal 100', () => {
      component.cartTotal = 100;

      component.calculateFinalTotal();

      expect(component.shipping).toBe(10);
    });

    it('should calculate taxes as 7.5%', () => {
      component.cartTotal = 100;

      component.calculateFinalTotal();

      expect(component.taxes).toBe(7.5);
    });

    it('should calculate final total with shipping included', () => {
      component.cartTotal = 100;

      component.calculateFinalTotal();

      // (100 * 1.075) + 10 = 107.5 + 10 = 117.5
      expect(component.finalTotal).toBe(117.5);
    });

    it('should calculate final total without shipping', () => {
      component.cartTotal = 150;

      component.calculateFinalTotal();

      // 150 * 1.075 = 161.25
      expect(component.finalTotal).toBe(161.25);
    });

    it('should handle zero cart total', () => {
      component.cartTotal = 0;

      component.calculateFinalTotal();

      expect(component.finalTotal).toBe(10);
      expect(component.shipping).toBe(10);
      expect(component.taxes).toBe(0);
    });

    it('should handle exactly 100 dollar total', () => {
      component.cartTotal = 100;

      component.calculateFinalTotal();

      expect(component.shipping).toBe(10);
    });

    it('should handle over 100 dollar total', () => {
      component.cartTotal = 100.01;

      component.calculateFinalTotal();

      expect(component.shipping).toBe(0);
    });
  });

  describe('submit()', () => {
    beforeEach(() => {
      mockOrderService.submitPayment.and.returnValue(of({}));
      mockOrderService.submitShipping.and.returnValue(of({ message: 1 }));
      mockOrderService.submitOrder.and.returnValue(of({}));

      component.currCustomer = {
        customerId: 1,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.paymentInfo.controls['creditCardNumber'].setValue('4111111111111111');
      component.paymentInfo.controls['cardExpiration'].setValue('12/25');
      component.paymentInfo.controls['cardCVV'].setValue('123');

      component.shippingInfo.controls['addressLine1'].setValue('123 Main St');
      component.shippingInfo.controls['city'].setValue('Springfield');
      component.shippingInfo.controls['zipCode'].setValue('62701');
      component.shippingInfo.controls['state'].setValue('IL');
    });

    it('should submit payment when payment info is valid', fakeAsync(() => {
      component.submit();
      tick();

      expect(mockOrderService.submitPayment).toHaveBeenCalled();
    }));

    it('should submit shipping when shipping info is valid', fakeAsync(() => {
      component.submit();
      tick();

      expect(mockOrderService.submitShipping).toHaveBeenCalled();
    }));

    it('should submit order for each cart item', fakeAsync(() => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];

      component.submit();
      tick();

      expect(mockOrderService.submitOrder).toHaveBeenCalledTimes(2);
    }));

    it('should set isOrderSubmitted to true after all orders submitted', fakeAsync(() => {
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.submit();
      tick();

      expect(component.isOrderSubmitted).toBe(true);
    }));

    it('should set order number as current timestamp', fakeAsync(() => {
      const beforeTime = new Date().getTime();
      component.submit();
      tick();
      const afterTime = new Date().getTime();

      expect(component.orderNumber).toBeGreaterThanOrEqual(beforeTime);
      expect(component.orderNumber).toBeLessThanOrEqual(afterTime);
    }));

    it('should include customer id in payment request', fakeAsync(() => {
      component.submit();
      tick();

      const paymentCall = mockOrderService.submitPayment.calls.mostRecent();
      expect(paymentCall.args[0].customerId).toBe(1);
    }));

    it('should include customer id in shipping request', fakeAsync(() => {
      component.submit();
      tick();

      const shippingCall = mockOrderService.submitShipping.calls.mostRecent();
      expect(shippingCall.args[0].customerId).toBe(1);
    }));

    it('should include sku in order request', fakeAsync(() => {
      component.submit();
      tick();

      const orderCall = mockOrderService.submitOrder.calls.mostRecent();
      expect(orderCall.args[0].sku).toBe('SKU001');
    }));

    it('should set order status as ORDERED', fakeAsync(() => {
      component.submit();
      tick();

      const orderCall = mockOrderService.submitOrder.calls.mostRecent();
      expect(orderCall.args[0].status).toBe('ORDERED');
    }));

    it('should handle multiple cart items in sequence', fakeAsync(() => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];

      component.submit();
      tick();

      expect(component.isOrderSubmitted).toBe(true);
      expect(mockOrderService.submitOrder).toHaveBeenCalledTimes(2);
    }));
  });

  describe('navigateHome()', () => {
    it('should navigate to home page', () => {
      component.navigateHome();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should clear cart', () => {
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.navigateHome();

      expect(component.cart).toEqual([]);
    });

    it('should set cart in product service to empty', () => {
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.navigateHome();

      expect(mockProductService.setCart).toHaveBeenCalledWith([]);
    });

    it('should call all three operations', () => {
      component.cart = [{ sku: 'SKU001', price: 50 }];

      component.navigateHome();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
      expect(component.cart).toEqual([]);
      expect(mockProductService.setCart).toHaveBeenCalledWith([]);
    });
  });

  describe('Integration Tests', () => {
    it('should initialize and calculate totals on init', () => {
      const mockCart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];
      mockProductService.getCart.and.returnValue(mockCart);

      component.ngOnInit();

      expect(component.cartTotal).toBe(80);
      expect(component.finalTotal).toBe(96);
    });

    it('should update totals after removing item', () => {
      component.cart = [
        { sku: 'SKU001', price: 50 },
        { sku: 'SKU002', price: 30 }
      ];
      component.calculateCartTotal();
      expect(component.cartTotal).toBe(80);

      component.removeItem(1);

      expect(component.cartTotal).toBe(50);
    });

    it('should recalculate totals when removing high value item', () => {
      component.cart = [
        { sku: 'SKU001', price: 120 }
      ];
      component.calculateCartTotal();
      expect(component.shipping).toBe(0);

      component.removeItem(0);

      expect(component.cart).toEqual([]);
      expect(component.cartTotal).toBe(0);
    });
  });
});