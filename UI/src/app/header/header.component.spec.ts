import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService, Customer, User } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from '../login/login.component';
import { CartComponent } from '../cart/cart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', [
      'register',
      'addCustomer',
      'login',
      'getCustomerInfo',
      'setIsLoggedIn',
      'setLoggedInUserCustomer'
    ]);
    mockProductService = jasmine.createSpyObj('ProductService', ['getProductSearch']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the header component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoggedIn).toBe(false);
      expect(component.customer).toBeUndefined();
      expect(component.productName).toBeUndefined();
    });

    it('should have injected MatDialog', () => {
      expect(component.dialog).toBeTruthy();
    });
  });

  describe('login()', () => {
    let mockLoginDialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;

    beforeEach(() => {
      mockLoginDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    });

    it('should open login dialog', () => {
      mockLoginDialogRef.afterClosed.and.returnValue(of(null));
      mockDialog.open.and.returnValue(mockLoginDialogRef);

      component.login();

      expect(mockDialog.open).toHaveBeenCalledWith(LoginComponent);
    });

    it('should register when isRegister is true', fakeAsync(() => {
      const mockDialogData = {
        isRegister: true,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '5551234567'
      };

      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.register.and.returnValue(of({ message: 123 }));
      mockAuthService.addCustomer.and.returnValue(of({ message: 123 }));
      mockAuthService.getCustomerInfo.and.returnValue(of({
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com'
      } as Customer));

      component.login();
      tick();

      expect(mockAuthService.register).toHaveBeenCalledWith(mockDialogData);
    }));

    it('should add customer after registration', fakeAsync(() => {
      const mockDialogData = {
        isRegister: true,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '5551234567'
      };

      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.register.and.returnValue(of({ message: 123 }));
      mockAuthService.addCustomer.and.returnValue(of({ message: 123 }));
      mockAuthService.getCustomerInfo.and.returnValue(of({
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com'
      } as Customer));

      component.login();
      tick();

      expect(mockAuthService.addCustomer).toHaveBeenCalled();
    }));

    it('should login when isRegister is false', fakeAsync(() => {
      const mockDialogData = {
        isRegister: false,
        emailAddress: 'john@example.com',
        password: 'password123'
      };

      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.login.and.returnValue(of({ message: 123 }));
      mockAuthService.getCustomerInfo.and.returnValue(of({
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com'
      } as Customer));

      component.login();
      tick();

      expect(mockAuthService.login).toHaveBeenCalledWith(mockDialogData);
    }));

    it('should not authenticate when dialog is closed without data', fakeAsync(() => {
      mockLoginDialogRef.afterClosed.and.returnValue(of(null));
      mockDialog.open.and.returnValue(mockLoginDialogRef);

      component.login();
      tick();

      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    }));

    it('should call getCustomerInfo after successful registration', fakeAsync(() => {
      const mockDialogData = {
        isRegister: true,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '5551234567'
      };

      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.register.and.returnValue(of({ message: 123 }));
      mockAuthService.addCustomer.and.returnValue(of({ message: 123 }));
      spyOn(component, 'getCustomerInfo');

      component.login();
      tick();

      expect(component.getCustomerInfo).toHaveBeenCalled();
    }));

    it('should call getCustomerInfo after successful login', fakeAsync(() => {
      const mockDialogData = {
        isRegister: false,
        emailAddress: 'john@example.com',
        password: 'password123'
      };

      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.login.and.returnValue(of({ message: 123 }));
      spyOn(component, 'getCustomerInfo');

      component.login();
      tick();

      expect(component.getCustomerInfo).toHaveBeenCalled();
    }));
  });

  describe('getCustomerInfo()', () => {
    it('should set customer info', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(component.customer).toEqual(mockCustomer);
    }));

    it('should set isLoggedIn to true', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(component.isLoggedIn).toBe(true);
    }));

    it('should call setIsLoggedIn on auth service', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(mockAuthService.setIsLoggedIn).toHaveBeenCalled();
    }));

    it('should set logged in user customer', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(mockAuthService.setLoggedInUserCustomer).toHaveBeenCalledWith(mockCustomer);
    }));

    it('should navigate to home page', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    }));

    it('should call getCustomerInfo with response message', fakeAsync(() => {
      const mockResponse = { message: 456 };
      mockAuthService.getCustomerInfo.and.returnValue(of({
        customerId: 456,
        firstName: 'Jane',
        lastName: 'Smith',
        emailAddress: 'jane@example.com'
      } as Customer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(mockAuthService.getCustomerInfo).toHaveBeenCalledWith(456);
    }));

    it('should perform all operations in sequence', fakeAsync(() => {
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };
      const mockResponse = { message: 123 };

      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.getCustomerInfo(mockResponse);
      tick();

      expect(mockAuthService.getCustomerInfo).toHaveBeenCalledWith(123);
      expect(component.customer).toEqual(mockCustomer);
      expect(component.isLoggedIn).toBe(true);
      expect(mockAuthService.setIsLoggedIn).toHaveBeenCalled();
      expect(mockAuthService.setLoggedInUserCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    }));
  });

  describe('productSearch()', () => {
    it('should search for product with "s" prefix', fakeAsync(() => {
      component.productName = 'shirt';
      const mockProduct = { sku: 'SKU001', name: 'St Michael' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('St Michael');
    }));

    it('should search for product with "g" prefix', fakeAsync(() => {
      component.productName = 'guardian';
      const mockProduct = { sku: 'SKU002', name: 'Guardian Of Shadows' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('Guardian Of Shadows');
    }));

    it('should search for product with "p" prefix', fakeAsync(() => {
      component.productName = 'phantom';
      const mockProduct = { sku: 'SKU003', name: 'Phantom Recon' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('Phantom Recon');
    }));

    it('should search for product with "m" prefix', fakeAsync(() => {
      component.productName = 'modern';
      const mockProduct = { sku: 'SKU004', name: 'Modern Crusader' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('Modern Crusader');
    }));

    it('should search for product with "n" prefix', fakeAsync(() => {
      component.productName = 'night';
      const mockProduct = { sku: 'SKU005', name: 'Night Reaper' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('Night Reaper');
    }));

    it('should navigate to product detail page when product found', fakeAsync(() => {
      component.productName = 'shirt';
      const mockProduct = { sku: 'SKU001', name: 'St Michael' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/product/SKU001'], { state: { product: mockProduct } });
    }));

    it('should show snack bar message when product not found', fakeAsync(() => {
      component.productName = 'shirt';

      mockProductService.getProductSearch.and.returnValue(of(null));

      component.productSearch();
      tick();

      expect(mockSnackBar.open).toHaveBeenCalledWith('No products found!', 'Close', { duration: 2000 });
    }));

    it('should handle case insensitive search', fakeAsync(() => {
      component.productName = 'SHIRT';
      const mockProduct = { sku: 'SKU001', name: 'St Michael' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('St Michael');
    }));

    it('should use first character of product name for search mapping', fakeAsync(() => {
      component.productName = 'something';
      const mockProduct = { sku: 'SKU001', name: 'St Michael' };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockProductService.getProductSearch).toHaveBeenCalledWith('St Michael');
    }));

    it('should pass product as state when navigating', fakeAsync(() => {
      component.productName = 'phantom';
      const mockProduct = { sku: 'SKU003', name: 'Phantom Recon', price: 99.99 };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      const navigateCall = mockRouter.navigate.calls.mostRecent();
      expect(navigateCall.args[1].state['product']).toEqual(mockProduct);
    }));
  });

  describe('openCart()', () => {
    it('should open cart dialog', () => {
      const mockCartDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialog.open.and.returnValue(mockCartDialogRef);

      component.openCart();

      expect(mockDialog.open).toHaveBeenCalledWith(CartComponent, {
        position: { right: '20px', top: '80px' }
      });
    });

    it('should pass position configuration to dialog', () => {
      const mockCartDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialog.open.and.returnValue(mockCartDialogRef);

      component.openCart();

      const openCall = mockDialog.open.calls.mostRecent();
      expect(openCall.args[1].position.right).toBe('20px');
      expect(openCall.args[1].position.top).toBe('80px');
    });

    it('should open CartComponent', () => {
      const mockCartDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockDialog.open.and.returnValue(mockCartDialogRef);

      component.openCart();

      const openCall = mockDialog.open.calls.mostRecent();
      expect(openCall.args[0]).toBe(CartComponent);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete login flow for registration', fakeAsync(() => {
      const mockDialogData = {
        isRegister: true,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: '5551234567'
      };
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };

      const mockLoginDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.register.and.returnValue(of({ message: 123 }));
      mockAuthService.addCustomer.and.returnValue(of({ message: 123 }));
      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.login();
      tick();

      expect(component.isLoggedIn).toBe(true);
      expect(component.customer).toEqual(mockCustomer);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
    }));

    it('should handle complete login flow for existing user', fakeAsync(() => {
      const mockDialogData = {
        isRegister: false,
        emailAddress: 'john@example.com',
        password: 'password123'
      };
      const mockCustomer: Customer = {
        customerId: 123,
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
        phoneNumber: ''
      };

      const mockLoginDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      mockLoginDialogRef.afterClosed.and.returnValue(of(mockDialogData));
      mockDialog.open.and.returnValue(mockLoginDialogRef);
      mockAuthService.login.and.returnValue(of({ message: 123 }));
      mockAuthService.getCustomerInfo.and.returnValue(of(mockCustomer));

      component.login();
      tick();

      expect(component.isLoggedIn).toBe(true);
      expect(component.customer).toEqual(mockCustomer);
    }));

    it('should handle product search and navigation', fakeAsync(() => {
      component.productName = 'modern';
      const mockProduct = { sku: 'SKU004', name: 'Modern Crusader', price: 89.99 };

      mockProductService.getProductSearch.and.returnValue(of(mockProduct));

      component.productSearch();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalled();
      expect(mockSnackBar.open).not.toHaveBeenCalled();
    }));

    it('should handle product not found scenario', fakeAsync(() => {
      component.productName = 'unknown';

      mockProductService.getProductSearch.and.returnValue(of(null));

      component.productSearch();
      tick();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith('No products found!', 'Close', { duration: 2000 });
    }));
  });
});