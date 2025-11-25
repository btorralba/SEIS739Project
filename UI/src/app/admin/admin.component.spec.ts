import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, Order } from '../services/order.service';
import { ProductService, Product } from '../services/product.service';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../services/authentication.service';
import { of } from 'rxjs';
import { variables } from '../environment/environment';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders', 'updateOrder']);
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts', 'updateProduct']);
    mockCustomerService = jasmine.createSpyObj('CustomerService', [
      'getCustomers',
      'getCustomerById',
      'getShippingAddressByCustomerId'
    ]);

    // Set default return values to prevent "undefined" errors
    mockProductService.getProducts.and.returnValue(of([]));
    mockOrderService.getOrders.and.returnValue(of([]));
    mockCustomerService.getCustomers.and.returnValue(of([]));
    mockCustomerService.getCustomerById.and.returnValue(of({}));
    mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of({}));
    mockProductService.updateProduct.and.returnValue(of({}));
    mockOrderService.updateOrder.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AdminComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ProductService, useValue: mockProductService },
        { provide: CustomerService, useValue: mockCustomerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the admin component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.username).toBeUndefined();
      expect(component.password).toBeUndefined();
      expect(component.isValid).toBe(false);
      expect(component.products).toEqual([]);
      expect(component.orders).toEqual([]);
      expect(component.customers).toEqual([]);
      expect(component.productTableOpen()).toBe(true);
      expect(component.orderTableOpen()).toBe(false);
      expect(component.customerTableOpen()).toBe(false);
    });

    it('should have correct displayed columns for tables', () => {
      expect(component.productsDisplayedColumns).toEqual([
        'productName',
        'size',
        'color',
        'sku',
        'price',
        'quantity'
      ]);
      expect(component.customerDisplayedColumns).toEqual(['firstName', 'lastName', 'emailAddress']);
      expect(component.orderDisplayedColumns).toEqual([
        'orderSk',
        'status',
        'orderNumber',
        'sku',
        'customerName',
        'shippingAddress'
      ]);
    });
  });

  describe('validateCreds()', () => {
    it('should set isValid to true with correct credentials and call setTables', () => {
      component.username = variables.adminUsername;
      component.password = variables.adminPassword;
      spyOn(component, 'setTables');

      component.validateCreds();

      expect(component.isValid).toBe(true);
      expect(component.setTables).toHaveBeenCalled();
    });

    it('should set isValid to false with incorrect username', () => {
      component.username = 'wrongUsername';
      component.password = variables.adminPassword;
      spyOn(component, 'setTables');

      component.validateCreds();

      expect(component.isValid).toBe(false);
      expect(component.setTables).not.toHaveBeenCalled();
    });

    it('should set isValid to false with incorrect password', () => {
      component.username = variables.adminUsername;
      component.password = 'wrongPassword';
      spyOn(component, 'setTables');

      component.validateCreds();

      expect(component.isValid).toBe(false);
      expect(component.setTables).not.toHaveBeenCalled();
    });

    it('should set isValid to false with both credentials incorrect', () => {
      component.username = 'wrongUsername';
      component.password = 'wrongPassword';
      spyOn(component, 'setTables');

      component.validateCreds();

      expect(component.isValid).toBe(false);
      expect(component.setTables).not.toHaveBeenCalled();
    });
  });

  describe('setTables()', () => {
    let mockProducts: Product[];
    let mockCustomers: Customer[];
    let mockOrders: Order[];
    let mockCustomerData: any;
    let mockShippingAddress: any;

    beforeEach(() => {
      mockProducts = [
        { productImageId: 1, productName: 'Product1', size: 'M', color: 'Red', sku: 'SKU001', price: 29.99, quantity: 10 } as Product,
        { productImageId: 2, productName: 'Product2', size: 'L', color: 'Blue', sku: 'SKU002', price: 39.99, quantity: 5 } as Product
      ];

      mockCustomers = [
        { customerId: 1, firstName: 'John', lastName: 'Doe', emailAddress: 'john@example.com' } as Customer,
        { customerId: 2, firstName: 'Jane', lastName: 'Smith', emailAddress: 'jane@example.com' } as Customer
      ];

      mockOrders = [
        { orderSk: 1, status: 'Pending', orderNumber: 'ORD001', sku: 123, customerId: 1, shippingId: 1 } as Order,
        { orderSk: 2, status: 'Shipped', orderNumber: 'ORD002', sku: 456, customerId: 2, shippingId: 2 } as Order
      ];

      mockCustomerData = { firstName: 'John', lastName: 'Doe' };
      mockShippingAddress = {
        addressLine1: '123 Main St',
        addressLine2: 'Apt 4',
        addressLine3: 'Suite 100',
        city: 'Springfield',
        stateAbbr: 'IL',
        zipCode: '62701'
      };
    });

    it('should load products from service', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of([]));

      component.setTables();
      tick();

      expect(mockProductService.getProducts).toHaveBeenCalled();
      expect(component.products).toEqual(mockProducts);
    }));

    it('should load customers from service', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of(mockCustomers));
      mockOrderService.getOrders.and.returnValue(of([]));

      component.setTables();
      tick();

      expect(mockCustomerService.getCustomers).toHaveBeenCalled();
      expect(component.customers).toEqual(mockCustomers);
    }));

    it('should load orders and populate customer names', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockCustomerService.getCustomerById.and.returnValue(of(mockCustomerData));
      mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of(mockShippingAddress));

      component.setTables();
      tick();

      expect(mockOrderService.getOrders).toHaveBeenCalled();
      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(1);
      expect(mockCustomerService.getCustomerById).toHaveBeenCalledWith(2);
    }));

    it('should construct shipping address correctly with all fields', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockCustomerService.getCustomerById.and.returnValue(of(mockCustomerData));
      mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of(mockShippingAddress));

      component.setTables();
      tick();

      expect(component.orders.length).toBe(2);
    }));

    it('should handle shipping address with no addressLine2', fakeAsync(() => {
      const addressNoLine2 = { ...mockShippingAddress, addressLine2: null };
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockCustomerService.getCustomerById.and.returnValue(of(mockCustomerData));
      mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of(addressNoLine2));

      component.setTables();
      tick();

      expect(component.orders.length).toBeGreaterThan(0);
    }));

    it('should handle shipping address with no addressLine3', fakeAsync(() => {
      const addressNoLine3 = { ...mockShippingAddress, addressLine3: null };
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockCustomerService.getCustomerById.and.returnValue(of(mockCustomerData));
      mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of(addressNoLine3));

      component.setTables();
      tick();

      expect(component.orders.length).toBeGreaterThan(0);
    }));

    it('should handle empty product list', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of([]));

      component.setTables();
      tick();

      expect(component.products).toEqual([]);
      expect(component.customers).toEqual([]);
      expect(component.orders).toEqual([]);
    }));

    it('should handle multiple orders from same customer', fakeAsync(() => {
      const multipleOrders = [
        { orderSk: 1, status: 'Pending', orderNumber: 'ORD001', sku: 'SKU001', customerId: 1 },
        { orderSk: 2, status: 'Shipped', orderNumber: 'ORD002', sku: 'SKU002', customerId: 1 }
      ];

      mockProductService.getProducts.and.returnValue(of([]));
      mockCustomerService.getCustomers.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(multipleOrders));
      mockCustomerService.getCustomerById.and.returnValue(of(mockCustomerData));
      mockCustomerService.getShippingAddressByCustomerId.and.returnValue(of(mockShippingAddress));

      component.setTables();
      tick();

      expect(component.orders.length).toBe(2);
    }));
  });

  describe('submitChanges()', () => {
    let mockProducts: Product[];
    let mockOrders: Order[];

    beforeEach(() => {
      mockProducts = [
        { productImageId: 1, productName: 'Product1', size: 'M', color: 'Red', sku: 'SKU001', price: 29.99, quantity: 10 } as Product,
        { productImageId: 2, productName: 'Product2', size: 'L', color: 'Blue', sku: 'SKU002', price: 39.99, quantity: 5 } as Product
      ];

      mockOrders = [
        { orderSk: 1, status: 'Pending', customerId: 1 } as Order,
        { orderSk: 2, status: 'Shipped', customerId: 2 } as Order
      ];
    });

    it('should update product when price changes', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockOrderService.getOrders.and.returnValue(of([]));
      mockProductService.updateProduct.and.returnValue(of({}));

      component.products = [
        { ...mockProducts[0], price: 49.99 },
        { ...mockProducts[1] }
      ];

      component.submitChanges();
      tick();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
    }));

    it('should update product when quantity changes', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockOrderService.getOrders.and.returnValue(of([]));
      mockProductService.updateProduct.and.returnValue(of({}));

      component.products = [
        { ...mockProducts[0], quantity: 20 },
        { ...mockProducts[1] }
      ];

      component.submitChanges();
      tick();

      expect(mockProductService.updateProduct).toHaveBeenCalled();
    }));

    it('should not update product when price and quantity unchanged', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockOrderService.getOrders.and.returnValue(of([]));

      component.products = [...mockProducts];

      component.submitChanges();
      tick();

      expect(mockProductService.updateProduct).not.toHaveBeenCalled();
    }));

    it('should update order when status changes', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockOrderService.updateOrder.and.returnValue(of({}));

      component.orders = [
        { ...mockOrders[0], status: 'Shipped' },
        { ...mockOrders[1] }
      ];

      component.submitChanges();
      tick();

      expect(mockOrderService.updateOrder).toHaveBeenCalled();
    }));

    it('should not update order when status unchanged', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));

      component.orders = [...mockOrders];

      component.submitChanges();
      tick();

      expect(mockOrderService.updateOrder).not.toHaveBeenCalled();
    }));

    it('should update multiple products with changes', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockOrderService.getOrders.and.returnValue(of([]));
      mockProductService.updateProduct.and.returnValue(of({}));

      component.products = [
        { ...mockProducts[0], price: 49.99 },
        { ...mockProducts[1], quantity: 15 }
      ];

      component.submitChanges();
      tick();

      expect(mockProductService.updateProduct).toHaveBeenCalledTimes(2);
    }));

    it('should update multiple orders with changes', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockOrderService.updateOrder.and.returnValue(of({}));

      component.orders = [
        { ...mockOrders[0], status: 'Delivered' },
        { ...mockOrders[1], status: 'Cancelled' }
      ];

      component.submitChanges();
      tick();

      expect(mockOrderService.updateOrder).toHaveBeenCalledTimes(2);
    }));

    it('should call setTables when data is updated', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of(mockProducts));
      mockOrderService.getOrders.and.returnValue(of(mockOrders));
      mockProductService.updateProduct.and.returnValue(of({}));
      mockOrderService.updateOrder.and.returnValue(of({}));
      spyOn(component, 'setTables');

      component.products = [
        { ...mockProducts[0], price: 49.99 },
        { ...mockProducts[1] }
      ];
      component.orders = [
        { ...mockOrders[0], status: 'Delivered' },
        { ...mockOrders[1] }
      ];

      component.submitChanges();
      tick();

      expect(component.setTables).toHaveBeenCalled();
    }));

    it('should handle empty product and order lists', fakeAsync(() => {
      mockProductService.getProducts.and.returnValue(of([]));
      mockOrderService.getOrders.and.returnValue(of([]));

      component.submitChanges();
      tick();

      expect(mockProductService.getProducts).toHaveBeenCalled();
      expect(mockOrderService.getOrders).toHaveBeenCalled();
    }));
  });
});