import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService, User, Customer } from './authentication.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpMock: HttpTestingController;
    const API_BASE_URL = 'http://localhost:8080/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthenticationService]
        });

        service = TestBed.inject(AuthenticationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should have API_BASE_URL defined', () => {
            expect(service.API_BASE_URL).toBe('http://localhost:8080/api');
        });

        it('should initialize isLoggedIn as false', () => {
            expect(service.isLoggedIn).toBe(false);
        });

        it('should initialize loggedInUserAsCustomer as undefined', () => {
            expect(service.loggedInUserAsCustomer).toBeUndefined();
        });

        it('should have httpClient injected', () => {
            expect(service['httpClient']).toBeDefined();
        });
    });

    describe('login()', () => {
        it('should make POST request to login endpoint', () => {
            const loginRequest = {
                userID: 'testuser',
                userPass: 'password123'
            };

            service.login(loginRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/login`);
            expect(req.request.method).toBe('POST');
            req.flush({ message: 1 });
        });

        it('should send login credentials in request body', () => {
            const loginRequest = {
                userID: 'testuser@example.com',
                userPass: 'securePassword123'
            };

            service.login(loginRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/login`);
            expect(req.request.body).toEqual(loginRequest);
            req.flush({ message: 1 });
        });

        it('should handle successful login response', () => {
            const loginRequest = { userID: 'testuser', userPass: 'password' };
            const mockResponse = { message: 456 };

            service.login(loginRequest).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/login`);
            req.flush(mockResponse);
        });

        it('should construct correct endpoint URL', () => {
            const loginRequest = { userID: 'user', userPass: 'pass' };

            service.login(loginRequest).subscribe();

            const req = httpMock.expectOne(req => req.url === `${API_BASE_URL}/login`);
            expect(req.request.url).toBe(`${API_BASE_URL}/login`);
            req.flush({});
        });

        it('should handle multiple login attempts', () => {
            const loginRequest1 = { userID: 'user1', userPass: 'pass1' };
            const loginRequest2 = { userID: 'user2', userPass: 'pass2' };

            service.login(loginRequest1).subscribe();
            service.login(loginRequest2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/login`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({ message: 1 }));
        });

        it('should handle login with special characters', () => {
            const loginRequest = {
                userID: 'user@domain.com',
                userPass: 'P@$$w0rd!#%'
            };

            service.login(loginRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/login`);
            expect(req.request.body.userID).toBe('user@domain.com');
            expect(req.request.body.userPass).toBe('P@$$w0rd!#%');
            req.flush({});
        });

        it('should handle login error response', () => {
            const loginRequest = { userID: 'user', userPass: 'wrong' };

            service.login(loginRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(401);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/login`);
            req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
        });
    });

    describe('getCustomerInfo()', () => {
        it('should make GET request to customer endpoint', () => {
            service.getCustomerInfo(1).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        });

        it('should return customer data', () => {
            const mockCustomer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.getCustomerInfo(1).subscribe(response => {
                expect(response).toEqual(mockCustomer);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req.flush(mockCustomer);
        });

        it('should handle different customer ids', () => {
            const customerIds = [1, 123, 999, 10000];

            for (const id of customerIds) {
                service.getCustomerInfo(id).subscribe();
                const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=${id}`);
                expect(req.request.url).toContain(`customerID=${id}`);
                req.flush({});
            }
        });

        it('should construct correct endpoint URL', () => {
            service.getCustomerInfo(1).subscribe();

            const req = httpMock.expectOne(req => req.url.includes('/customer'));
            expect(req.request.url).toBe(`${API_BASE_URL}/customer?customerID=1`);
            req.flush({});
        });

        it('should handle multiple customer info requests', () => {
            service.getCustomerInfo(1).subscribe();
            service.getCustomerInfo(2).subscribe();

            const reqs = httpMock.match(req => req.url.includes('/customer'));
            expect(reqs.length).toBe(2);
            reqs.forEach(req => req.flush({}));
        });

        it('should handle error response', () => {
            service.getCustomerInfo(999).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(404);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=999`);
            req.flush({ error: 'Customer not found' }, { status: 404, statusText: 'Not Found' });
        });

        it('should pass customerId as string to query parameter', () => {
            service.getCustomerInfo(456).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=456`);
            expect(req.request.url).toContain('customerID=456');
            req.flush({});
        });
    });

    describe('register()', () => {
        it('should make POST request to register endpoint', () => {
            const registerRequest = {
                userID: 'newuser',
                userPass: 'password123',
                firstName: 'John',
                lastName: 'Doe'
            };

            service.register(registerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            expect(req.request.method).toBe('POST');
            req.flush({ message: 1 });
        });

        it('should send registration data in request body', () => {
            const registerRequest = {
                userID: 'newuser',
                userPass: 'secure123',
                firstName: 'Jane',
                lastName: 'Smith'
            };

            service.register(registerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            expect(req.request.body).toEqual(registerRequest);
            req.flush({});
        });

        it('should return Observable response with user id', () => {
            const registerRequest = {
                userID: 'testuser',
                userPass: 'password',
                firstName: 'Test',
                lastName: 'User'
            };

            service.register(registerRequest).subscribe((response: any) => {
                expect(response.message).toBe(123);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            req.flush({ message: 123 });
        });

        it('should construct correct endpoint URL', () => {
            const registerRequest = { userID: 'user', userPass: 'pass' };

            service.register(registerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            expect(req.request.url).toBe(`${API_BASE_URL}/add/user`);
            req.flush({});
        });

        it('should handle multiple registration requests', () => {
            const request1 = { userID: 'user1', userPass: 'pass1' };
            const request2 = { userID: 'user2', userPass: 'pass2' };

            service.register(request1).subscribe();
            service.register(request2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/add/user`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({ message: 1 }));
        });

        it('should handle registration with all fields', () => {
            const registerRequest = {
                userID: 'john.doe@company.com',
                userPass: 'SecurePass123!',
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@company.com',
                phoneNumber: '5551234567'
            };

            service.register(registerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            expect(req.request.body).toEqual(registerRequest);
            req.flush({});
        });

        it('should handle registration error', () => {
            const registerRequest = { userID: 'user', userPass: 'pass' };

            service.register(registerRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(400);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            req.flush({ error: 'User already exists' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('addCustomer()', () => {
        it('should make POST request to add customer endpoint', () => {
            const customerRequest: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.addCustomer(customerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('should send customer data in request body', () => {
            const customerRequest: Customer = {
                customerId: 123,
                firstName: 'Jane',
                lastName: 'Smith',
                emailAddress: 'jane@example.com',
                phoneNumber: '5559876543'
            };

            service.addCustomer(customerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            expect(req.request.body).toEqual(customerRequest);
            req.flush({});
        });

        it('should return Observable response', () => {
            const customerRequest: Customer = {
                customerId: 1,
                firstName: 'Test',
                lastName: 'Customer',
                emailAddress: 'test@example.com',
                phoneNumber: '5551111111'
            };

            service.addCustomer(customerRequest).subscribe(response => {
                expect(response).toBeDefined();
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            req.flush({ message: 'Customer added' });
        });

        it('should construct correct endpoint URL', () => {
            const customerRequest: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.addCustomer(customerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            expect(req.request.url).toBe(`${API_BASE_URL}/add/customer`);
            req.flush({});
        });

        it('should handle multiple add customer requests', () => {
            const customer1: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551111111'
            };

            const customer2: Customer = {
                customerId: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                emailAddress: 'jane@example.com',
                phoneNumber: '5552222222'
            };

            service.addCustomer(customer1).subscribe();
            service.addCustomer(customer2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/add/customer`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({}));
        });

        it('should handle add customer error', () => {
            const customerRequest: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.addCustomer(customerRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(409);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            req.flush({ error: 'Customer already exists' }, { status: 409, statusText: 'Conflict' });
        });

        it('should handle customer with all fields populated', () => {
            const customerRequest: Customer = {
                customerId: 999,
                firstName: 'Complete',
                lastName: 'Customer',
                emailAddress: 'complete@example.com',
                phoneNumber: '5559999999'
            };

            service.addCustomer(customerRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            expect(req.request.body.customerId).toBe(999);
            expect(req.request.body.firstName).toBe('Complete');
            expect(req.request.body.lastName).toBe('Customer');
            req.flush({});
        });
    });

    describe('setLoggedInUserCustomer()', () => {
        it('should set loggedInUserAsCustomer property', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.setLoggedInUserCustomer(customer);

            expect(service.loggedInUserAsCustomer).toBe(customer);
        });

        it('should replace previous customer with new one', () => {
            const customer1: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551111111'
            };

            const customer2: Customer = {
                customerId: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                emailAddress: 'jane@example.com',
                phoneNumber: '5552222222'
            };

            service.setLoggedInUserCustomer(customer1);
            expect(service.loggedInUserAsCustomer).toBe(customer1);

            service.setLoggedInUserCustomer(customer2);
            expect(service.loggedInUserAsCustomer).toBe(customer2);
        });

        it('should maintain customer reference', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'Test',
                lastName: 'Customer',
                emailAddress: 'test@example.com',
                phoneNumber: '5551234567'
            };

            service.setLoggedInUserCustomer(customer);

            expect(service.loggedInUserAsCustomer === customer).toBe(true);
        });

        it('should allow setting to null or undefined', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.setLoggedInUserCustomer(customer);
            service.setLoggedInUserCustomer(null);

            expect(service.loggedInUserAsCustomer).toBeNull();
        });

        it('should update loggedInUserAsCustomer with correct data', () => {
            const customer: Customer = {
                customerId: 123,
                firstName: 'Custom',
                lastName: 'User',
                emailAddress: 'custom@example.com',
                phoneNumber: '5559876543'
            };

            service.setLoggedInUserCustomer(customer);

            expect(service.loggedInUserAsCustomer.customerId).toBe(123);
            expect(service.loggedInUserAsCustomer.firstName).toBe('Custom');
            expect(service.loggedInUserAsCustomer.lastName).toBe('User');
        });
    });

    describe('getLoggedInUserCustomer()', () => {
        it('should return loggedInUserAsCustomer', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.setLoggedInUserCustomer(customer);

            expect(service.getLoggedInUserCustomer()).toBe(customer);
        });

        it('should return undefined when not set', () => {
            expect(service.getLoggedInUserCustomer()).toBeUndefined();
        });

        it('should return the exact customer that was set', () => {
            const customer: Customer = {
                customerId: 456,
                firstName: 'Jane',
                lastName: 'Smith',
                emailAddress: 'jane@example.com',
                phoneNumber: '5559876543'
            };

            service.setLoggedInUserCustomer(customer);
            const retrieved = service.getLoggedInUserCustomer();

            expect(retrieved.customerId).toBe(456);
            expect(retrieved.firstName).toBe('Jane');
            expect(retrieved.lastName).toBe('Smith');
            expect(retrieved.emailAddress).toBe('jane@example.com');
            expect(retrieved.phoneNumber).toBe('5559876543');
        });

        it('should return the same reference', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'Test',
                lastName: 'User',
                emailAddress: 'test@example.com',
                phoneNumber: '5551111111'
            };

            service.setLoggedInUserCustomer(customer);

            expect(service.getLoggedInUserCustomer() === customer).toBe(true);
        });

        it('should return null after being set to null', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.setLoggedInUserCustomer(customer);
            service.setLoggedInUserCustomer(null);

            expect(service.getLoggedInUserCustomer()).toBeNull();
        });
    });

    describe('setIsLoggedIn()', () => {
        it('should set isLoggedIn to true', () => {
            service.setIsLoggedIn();

            expect(service.isLoggedIn).toBe(true);
        });

        it('should change isLoggedIn from false to true', () => {
            expect(service.isLoggedIn).toBe(false);

            service.setIsLoggedIn();

            expect(service.isLoggedIn).toBe(true);
        });

        it('should maintain true state when called multiple times', () => {
            service.setIsLoggedIn();
            expect(service.isLoggedIn).toBe(true);

            service.setIsLoggedIn();
            expect(service.isLoggedIn).toBe(true);
        });
    });

    describe('getIsLoggedIn()', () => {
        it('should return false initially', () => {
            expect(service.getIsLoggedIn()).toBe(false);
        });

        it('should return true after setIsLoggedIn is called', () => {
            service.setIsLoggedIn();

            expect(service.getIsLoggedIn()).toBe(true);
        });

        it('should return current isLoggedIn state', () => {
            expect(service.getIsLoggedIn()).toBe(false);

            service.setIsLoggedIn();

            expect(service.getIsLoggedIn()).toBe(true);
        });

        it('should return boolean value', () => {
            const result = service.getIsLoggedIn();

            expect(typeof result).toBe('boolean');
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete login flow', () => {
            const loginRequest = { userID: 'user', userPass: 'pass' };
            const mockCustomer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.login(loginRequest).subscribe((response: any) => {
                expect(response.message).toBe(1);
            });

            const loginReq = httpMock.expectOne(`${API_BASE_URL}/login`);
            loginReq.flush({ message: 1 });

            service.getCustomerInfo(1).subscribe(customer => {
                expect(customer).toEqual(mockCustomer);
            });

            const customerReq = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            customerReq.flush(mockCustomer);

            service.setLoggedInUserCustomer(mockCustomer);
            service.setIsLoggedIn();

            expect(service.getIsLoggedIn()).toBe(true);
            expect(service.getLoggedInUserCustomer()).toEqual(mockCustomer);
        });

        it('should handle complete registration flow', () => {
            const registerRequest = {
                userID: 'newuser',
                userPass: 'password',
                firstName: 'John',
                lastName: 'Doe'
            };

            const customerRequest: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.register(registerRequest).subscribe();
            const registerReq = httpMock.expectOne(`${API_BASE_URL}/add/user`);
            registerReq.flush({ message: 1 });

            service.addCustomer(customerRequest).subscribe();
            const customerReq = httpMock.expectOne(`${API_BASE_URL}/add/customer`);
            customerReq.flush({});

            service.setLoggedInUserCustomer(customerRequest);
            service.setIsLoggedIn();

            expect(service.getIsLoggedIn()).toBe(true);
            expect(service.getLoggedInUserCustomer()).toEqual(customerRequest);
        });

        it('should maintain logged in state across operations', () => {
            const customer: Customer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                phoneNumber: '5551234567'
            };

            service.setIsLoggedIn();
            service.setLoggedInUserCustomer(customer);

            expect(service.getIsLoggedIn()).toBe(true);
            expect(service.getLoggedInUserCustomer()).toEqual(customer);

            // Make another API call
            service.getCustomerInfo(1).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req.flush(customer);

            // Verify state remains
            expect(service.getIsLoggedIn()).toBe(true);
            expect(service.getLoggedInUserCustomer()).toEqual(customer);
        });
    });
});