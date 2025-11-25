import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the login component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.userID).toBe('');
      expect(component.userPass).toBe('');
      expect(component.userPass2).toBe('');
      expect(component.isRegister).toBe(false);
      expect(component.firstName).toBe('');
      expect(component.lastName).toBe('');
      expect(component.emailAddress).toBe('');
      expect(component.phoneNumber).toBe('');
    });

    it('should initialize data object with default values', () => {
      expect(component.data).toBeDefined();
      expect(component.data.userID).toBe('');
      expect(component.data.userPass).toBe('');
      expect(component.data.isRegister).toBe(false);
      expect(component.data.firstName).toBe('');
      expect(component.data.lastName).toBe('');
      expect(component.data.emailAddress).toBe('');
      expect(component.data.phoneNumber).toBe('');
    });

    it('should have injected MatDialogRef', () => {
      expect(component.dialogRef).toBeTruthy();
    });

    it('should have all form fields defined', () => {
      expect(component.userID).toBeDefined();
      expect(component.userPass).toBeDefined();
      expect(component.userPass2).toBeDefined();
      expect(component.firstName).toBeDefined();
      expect(component.lastName).toBeDefined();
      expect(component.emailAddress).toBeDefined();
      expect(component.phoneNumber).toBeDefined();
    });
  });

  describe('submit() - Login Mode', () => {
    it('should populate data object with login credentials', () => {
      component.userID = 'testuser';
      component.userPass = 'password123';
      component.isRegister = false;

      component.submit();

      expect(component.data.userID).toBe('testuser');
      expect(component.data.userPass).toBe('password123');
      expect(component.data.isRegister).toBe(false);
    });

    it('should close dialog with data when submitting login', () => {
      component.userID = 'testuser';
      component.userPass = 'password123';

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalledWith(component.data);
    });

    it('should not include registration fields when not registering', () => {
      component.userID = 'testuser';
      component.userPass = 'password123';
      component.isRegister = false;
      component.firstName = 'John';
      component.lastName = 'Doe';

      component.submit();

      expect(component.data.firstName).toBe('');
      expect(component.data.lastName).toBe('');
    });

    it('should handle empty username for login', () => {
      component.userID = '';
      component.userPass = 'password123';

      component.submit();

      expect(component.data.userID).toBe('');
      expect(component.data.userPass).toBe('password123');
    });

    it('should handle empty password for login', () => {
      component.userID = 'testuser';
      component.userPass = '';

      component.submit();

      expect(component.data.userID).toBe('testuser');
      expect(component.data.userPass).toBe('');
    });

    it('should handle both username and password empty', () => {
      component.userID = '';
      component.userPass = '';

      component.submit();

      expect(component.data.userID).toBe('');
      expect(component.data.userPass).toBe('');
    });

    it('should handle special characters in credentials', () => {
      component.userID = 'user@example.com';
      component.userPass = 'P@ssw0rd!#$%';

      component.submit();

      expect(component.data.userID).toBe('user@example.com');
      expect(component.data.userPass).toBe('P@ssw0rd!#$%');
    });

    it('should ignore userPass2 field during login', () => {
      component.userID = 'testuser';
      component.userPass = 'password123';
      component.userPass2 = 'password123';

      component.submit();

      expect(component.data.userPass).toBe('password123');
    });

    it('should set isRegister to false in data when login mode', () => {
      component.isRegister = false;

      component.submit();

      expect(component.data.isRegister).toBe(false);
    });
  });

  describe('submit() - Registration Mode', () => {
    beforeEach(() => {
      component.isRegister = true;
    });

    it('should populate all registration fields in data', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = '5551234567';

      component.submit();

      expect(component.data.userID).toBe('newuser');
      expect(component.data.userPass).toBe('password123');
      expect(component.data.firstName).toBe('John');
      expect(component.data.lastName).toBe('Doe');
      expect(component.data.emailAddress).toBe('john@example.com');
      expect(component.data.phoneNumber).toBe('5551234567');
    });

    it('should close dialog with registration data', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = '5551234567';

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalledWith(component.data);
    });

    it('should set isRegister to true in data when registering', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';

      component.submit();

      expect(component.data.isRegister).toBe(true);
    });

    it('should handle empty phoneNumber by setting to empty string', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = '';

      component.submit();

      expect(component.data.phoneNumber).toBe('');
    });

    it('should handle undefined phoneNumber by setting to empty string', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = undefined as any;

      component.submit();

      expect(component.data.phoneNumber).toBe('');
    });

    it('should handle null phoneNumber by setting to empty string', () => {
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = null as any;

      component.submit();

      expect(component.data.phoneNumber).toBe('');
    });

    it('should populate firstName in data', () => {
      component.firstName = 'Jane';
      component.lastName = 'Smith';
      component.emailAddress = 'jane@example.com';

      component.submit();

      expect(component.data.firstName).toBe('Jane');
    });

    it('should populate lastName in data', () => {
      component.firstName = 'Jane';
      component.lastName = 'Smith';
      component.emailAddress = 'jane@example.com';

      component.submit();

      expect(component.data.lastName).toBe('Smith');
    });

    it('should populate emailAddress in data', () => {
      component.firstName = 'Jane';
      component.lastName = 'Smith';
      component.emailAddress = 'jane@example.com';

      component.submit();

      expect(component.data.emailAddress).toBe('jane@example.com');
    });

    it('should handle special characters in registration fields', () => {
      component.firstName = "O'Brien";
      component.lastName = "Van der Berg";
      component.emailAddress = 'test+alias@example.co.uk';
      component.phoneNumber = '+1-555-123-4567';

      component.submit();

      expect(component.data.firstName).toBe("O'Brien");
      expect(component.data.lastName).toBe("Van der Berg");
      expect(component.data.emailAddress).toBe('test+alias@example.co.uk');
      expect(component.data.phoneNumber).toBe('+1-555-123-4567');
    });

    it('should handle empty registration fields', () => {
      component.userID = '';
      component.userPass = '';
      component.firstName = '';
      component.lastName = '';
      component.emailAddress = '';
      component.phoneNumber = '';

      component.submit();

      expect(component.data.userID).toBe('');
      expect(component.data.userPass).toBe('');
      expect(component.data.firstName).toBe('');
      expect(component.data.lastName).toBe('');
      expect(component.data.emailAddress).toBe('');
      expect(component.data.phoneNumber).toBe('');
    });
  });

  describe('register()', () => {
    it('should set isRegister to true', () => {
      expect(component.isRegister).toBe(false);

      component.register();

      expect(component.isRegister).toBe(true);
    });

    it('should only change isRegister flag', () => {
      component.userID = 'testuser';
      component.userPass = 'password';
      component.firstName = 'John';

      component.register();

      expect(component.userID).toBe('testuser');
      expect(component.userPass).toBe('password');
      expect(component.firstName).toBe('John');
      expect(component.isRegister).toBe(true);
    });

    it('should allow multiple calls to register', () => {
      expect(component.isRegister).toBe(false);

      component.register();
      expect(component.isRegister).toBe(true);

      component.register();
      expect(component.isRegister).toBe(true);
    });

    it('should not affect data object when calling register', () => {
      const originalData = { ...component.data };

      component.register();

      expect(component.data).toEqual(originalData);
    });

    it('should allow switching from login to register mode', () => {
      expect(component.isRegister).toBe(false);

      component.register();

      expect(component.isRegister).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete login flow', () => {
      component.userID = 'testuser';
      component.userPass = 'password123';
      component.isRegister = false;

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const callData = mockDialogRef.close.calls.mostRecent().args[0];
      expect(callData.userID).toBe('testuser');
      expect(callData.userPass).toBe('password123');
      expect(callData.isRegister).toBe(false);
    });

    it('should handle complete registration flow', () => {
      component.register();
      component.userID = 'newuser';
      component.userPass = 'password123';
      component.firstName = 'John';
      component.lastName = 'Doe';
      component.emailAddress = 'john@example.com';
      component.phoneNumber = '5551234567';

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const callData = mockDialogRef.close.calls.mostRecent().args[0];
      expect(callData.isRegister).toBe(true);
      expect(callData.firstName).toBe('John');
      expect(callData.lastName).toBe('Doe');
      expect(callData.emailAddress).toBe('john@example.com');
      expect(callData.phoneNumber).toBe('5551234567');
    });

    it('should toggle from login to register mode', () => {
      expect(component.isRegister).toBe(false);

      component.register();

      expect(component.isRegister).toBe(true);

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const callData = mockDialogRef.close.calls.mostRecent().args[0];
      expect(callData.isRegister).toBe(true);
    });

    it('should handle login with special characters', () => {
      component.userID = 'user@company.com';
      component.userPass = 'P@ssw0rd!123';

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const callData = mockDialogRef.close.calls.mostRecent().args[0];
      expect(callData.userID).toBe('user@company.com');
      expect(callData.userPass).toBe('P@ssw0rd!123');
    });

    it('should handle registration with international characters', () => {
      component.register();
      component.firstName = 'François';
      component.lastName = 'Müller';
      component.emailAddress = 'françois@example.com';

      component.submit();

      expect(mockDialogRef.close).toHaveBeenCalled();
      const callData = mockDialogRef.close.calls.mostRecent().args[0];
      expect(callData.firstName).toBe('François');
      expect(callData.lastName).toBe('Müller');
    });

    it('should handle multiple submissions', () => {
      component.userID = 'user1';
      component.userPass = 'pass1';
      component.submit();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(1);

      component.userID = 'user2';
      component.userPass = 'pass2';
      component.submit();
      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
    });

    it('should maintain data integrity after registration flag change', () => {
      component.userID = 'testuser';
      component.userPass = 'password';
      component.firstName = 'John';
      component.lastName = 'Doe';

      component.register();

      expect(component.userID).toBe('testuser');
      expect(component.userPass).toBe('password');
      expect(component.firstName).toBe('John');
      expect(component.lastName).toBe('Doe');
    });
  });

  describe('Data Object', () => {
    it('should have correct initial data structure', () => {
      expect(component.data.hasOwnProperty('userID')).toBe(true);
      expect(component.data.hasOwnProperty('userPass')).toBe(true);
      expect(component.data.hasOwnProperty('isRegister')).toBe(true);
      expect(component.data.hasOwnProperty('firstName')).toBe(true);
      expect(component.data.hasOwnProperty('lastName')).toBe(true);
      expect(component.data.hasOwnProperty('emailAddress')).toBe(true);
      expect(component.data.hasOwnProperty('phoneNumber')).toBe(true);
    });

    it('should update data object on submit', () => {
      component.userID = 'newuser';
      component.userPass = 'newpass';

      component.submit();

      expect(component.data.userID).toBe('newuser');
      expect(component.data.userPass).toBe('newpass');
    });

    it('should preserve data across multiple property changes', () => {
      component.userID = 'user1';
      component.submit();
      expect(component.data.userID).toBe('user1');

      component.userID = 'user2';
      component.submit();
      expect(component.data.userID).toBe('user2');
    });
  });

  describe('Form Field Isolation', () => {
    it('should not affect userPass when changing userPass2', () => {
      component.userPass = 'originalpass';
      component.userPass2 = 'confirmpass';

      component.submit();

      expect(component.data.userPass).toBe('originalpass');
    });

    it('should handle long input strings', () => {
      const longString = 'a'.repeat(1000);
      component.userID = longString;

      component.submit();

      expect(component.data.userID).toBe(longString);
    });
  });
});