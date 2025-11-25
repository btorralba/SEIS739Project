import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
    let service: CustomerService;
    let httpMock: HttpTestingController;
    const API_BASE_URL = 'http://localhost:8080/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CustomerService]
        });

        service = TestBed.inject(CustomerService);
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

        it('should have correct API base URL', () => {
            expect(service.API_BASE_URL).toContain('localhost:8080');
            expect(service.API_BASE_URL).toContain('/api');
        });

        it('should have httpClient injected', () => {
            expect(service['httpClient']).toBeDefined();
        });
    });

    describe('getCustomers()', () => {
        it('should make GET request to customers endpoint', () => {
            service.getCustomers().subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('should return array of customers', () => {
            const mockCustomers = [
                {
                    customerId: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    emailAddress: 'john@example.com'
                },
                {
                    customerId: 2,
                    firstName: 'Jane',
                    lastName: 'Smith',
                    emailAddress: 'jane@example.com'
                }
            ];

            service.getCustomers().subscribe(customers => {
                expect(customers).toEqual(mockCustomers);
                expect(Array.isArray(customers)).toBe(true);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush(mockCustomers);
        });

        it('should handle empty customer list', () => {
            service.getCustomers().subscribe((customers: any) => {
                expect(customers).toEqual([]);
                expect(customers.length).toBe(0);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush([]);
        });

        it('should construct correct endpoint URL', () => {
            service.getCustomers().subscribe();

            const req = httpMock.expectOne(req => req.url === `${API_BASE_URL}/customers`);
            expect(req.request.url).toBe(`${API_BASE_URL}/customers`);
            req.flush([]);
        });

        it('should handle single customer in response', () => {
            const mockCustomer = {
                customerId: 1,
                firstName: 'Single',
                lastName: 'Customer',
                emailAddress: 'single@example.com'
            };

            service.getCustomers().subscribe((customers: any) => {
                expect(customers.length).toBe(1);
                expect(customers[0]).toEqual(mockCustomer);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush([mockCustomer]);
        });

        it('should handle multiple customers in response', () => {
            const mockCustomers = Array.from({ length: 5 }, (_, i) => ({
                customerId: i + 1,
                firstName: `Customer${i + 1}`,
                lastName: `Last${i + 1}`,
                emailAddress: `customer${i + 1}@example.com`
            }));

            service.getCustomers().subscribe((customers: any) => {
                expect(customers.length).toBe(5);
                expect(customers).toEqual(mockCustomers);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush(mockCustomers);
        });

        it('should handle error response', () => {
            service.getCustomers().subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(500);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush({ error: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
        });

        it('should handle 404 error', () => {
            service.getCustomers().subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(404);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            req.flush(null, { status: 404, statusText: 'Not Found' });
        });

        it('should not send request body', () => {
            service.getCustomers().subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            expect(req.request.body).toBeNull();
            req.flush([]);
        });
    });

    describe('getCustomerById()', () => {
        it('should make GET request to customer endpoint with id', () => {
            service.getCustomerById(1).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        });

        it('should include customerId as query parameter', () => {
            service.getCustomerById(123).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=123`);
            expect(req.request.url).toContain('customerID=123');
            req.flush({});
        });

        it('should return customer data', () => {
            const mockCustomer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com'
            };

            service.getCustomerById(1).subscribe(customer => {
                expect(customer).toEqual(mockCustomer);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req.flush(mockCustomer);
        });

        it('should construct correct endpoint URL for different ids', () => {
            const customerIds = [1, 100, 999, 10000];

            for (const id of customerIds) {
                service.getCustomerById(id).subscribe();
                const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=${id}`);
                expect(req.request.url).toContain(`customerID=${id}`);
                req.flush({});
            }
        });

        it('should handle multiple requests with different ids', () => {
            service.getCustomerById(1).subscribe();
            service.getCustomerById(2).subscribe();

            const reqs = httpMock.match(req => req.url.includes('/customer') && req.url.includes('customerID'));
            expect(reqs.length).toBe(2);
            expect(reqs[0].request.url).toContain('customerID=1');
            expect(reqs[1].request.url).toContain('customerID=2');
            reqs.forEach(req => req.flush({}));
        });

        it('should handle error response', () => {
            service.getCustomerById(999).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(404);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=999`);
            req.flush(null, { status: 404, statusText: 'Not Found' });
        });

        it('should handle 500 server error', () => {
            service.getCustomerById(1).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(500);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req.flush(null, { status: 500, statusText: 'Internal Server Error' });
        });

        it('should return customer with all properties', () => {
            const mockCustomer = {
                customerId: 1,
                firstName: 'Complete',
                lastName: 'Customer',
                emailAddress: 'complete@example.com',
                phoneNumber: '5551234567',
                address: '123 Main St'
            };

            service.getCustomerById(1).subscribe((customer: any) => {
                expect(customer.customerId).toBe(1);
                expect(customer.firstName).toBe('Complete');
                expect(customer.lastName).toBe('Customer');
                expect(customer.emailAddress).toBe('complete@example.com');
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req.flush(mockCustomer);
        });

        it('should handle customer id as number', () => {
            const customerId = 123;
            service.getCustomerById(customerId).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=${customerId}`);
            expect(req.request.url).toContain(`customerID=${customerId}`);
            req.flush({});
        });
    });

    describe('getShippingAddressByCustomerId()', () => {
        it('should make GET request to shipping address endpoint', () => {
            service.getShippingAddressByCustomerId(1).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        });

        it('should include customerId as query parameter', () => {
            service.getShippingAddressByCustomerId(123).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=123`);
            expect(req.request.url).toContain('customerID=123');
            req.flush({});
        });

        it('should return shipping address data', () => {
            const mockShippingAddress = {
                shippingId: 1,
                customerId: 1,
                addressLine1: '123 Main St',
                addressLine2: 'Apt 4',
                addressLine3: 'Suite 100',
                city: 'Springfield',
                stateAbbr: 'IL',
                zipCode: '62701'
            };

            service.getShippingAddressByCustomerId(1).subscribe(address => {
                expect(address).toEqual(mockShippingAddress);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            req.flush(mockShippingAddress);
        });

        it('should construct correct endpoint URL', () => {
            service.getShippingAddressByCustomerId(1).subscribe();

            const req = httpMock.expectOne(req => req.url.includes('/shippingAddressByCustomerId'));
            expect(req.request.url).toBe(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            req.flush({});
        });

        it('should handle multiple requests with different ids', () => {
            service.getShippingAddressByCustomerId(1).subscribe();
            service.getShippingAddressByCustomerId(2).subscribe();

            const reqs = httpMock.match(req => req.url.includes('/shippingAddressByCustomerId'));
            expect(reqs.length).toBe(2);
            reqs.forEach(req => req.flush({}));
        });

        it('should handle error response', () => {
            service.getShippingAddressByCustomerId(999).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(404);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=999`);
            req.flush(null, { status: 404, statusText: 'Not Found' });
        });

        it('should handle 500 server error', () => {
            service.getShippingAddressByCustomerId(1).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(500);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            req.flush(null, { status: 500, statusText: 'Internal Server Error' });
        });

        it('should handle different customer ids', () => {
            const customerIds = [1, 50, 100, 999];

            for (const id of customerIds) {
                service.getShippingAddressByCustomerId(id).subscribe();
                const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=${id}`);
                expect(req.request.url).toContain(`customerID=${id}`);
                req.flush({});
            }
        });

        it('should return shipping address with all fields', () => {
            const mockShippingAddress = {
                shippingId: 1,
                customerId: 1,
                addressLine1: '123 Main St',
                addressLine2: 'Apt 4',
                addressLine3: 'Suite 100',
                city: 'Springfield',
                stateAbbr: 'IL',
                zipCode: '62701',
                country: 'USA'
            };

            service.getShippingAddressByCustomerId(1).subscribe((address: any) => {
                expect(address.addressLine1).toBe('123 Main St');
                expect(address.city).toBe('Springfield');
                expect(address.stateAbbr).toBe('IL');
                expect(address.zipCode).toBe('62701');
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            req.flush(mockShippingAddress);
        });

        it('should handle shipping address with optional fields', () => {
            const mockShippingAddress = {
                shippingId: 1,
                customerId: 1,
                addressLine1: '123 Main St',
                addressLine2: null,
                addressLine3: null,
                city: 'Springfield',
                stateAbbr: 'IL',
                zipCode: '62701'
            };

            service.getShippingAddressByCustomerId(1).subscribe((address: any) => {
                expect(address.addressLine2).toBeNull();
                expect(address.addressLine3).toBeNull();
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            req.flush(mockShippingAddress);
        });
    });

    describe('Integration Tests', () => {
        it('should get all customers and then get individual customer', () => {
            const mockCustomers = [
                { customerId: 1, firstName: 'John', lastName: 'Doe' },
                { customerId: 2, firstName: 'Jane', lastName: 'Smith' }
            ];

            service.getCustomers().subscribe((customers: any) => {
                expect(customers.length).toBe(2);
            });

            const getAllReq = httpMock.expectOne(`${API_BASE_URL}/customers`);
            getAllReq.flush(mockCustomers);

            const mockCustomer = mockCustomers[0];
            service.getCustomerById(1).subscribe(customer => {
                expect(customer).toEqual(mockCustomer);
            });

            const getByIdReq = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            getByIdReq.flush(mockCustomer);
        });

        it('should get customer and then get their shipping address', () => {
            const mockCustomer = {
                customerId: 1,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com'
            };

            const mockShippingAddress = {
                shippingId: 1,
                customerId: 1,
                addressLine1: '123 Main St',
                city: 'Springfield',
                stateAbbr: 'IL',
                zipCode: '62701'
            };

            service.getCustomerById(1).subscribe((customer: any) => {
                expect(customer.customerId).toBe(1);
            });

            const customerReq = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            customerReq.flush(mockCustomer);

            service.getShippingAddressByCustomerId(1).subscribe((address: any) => {
                expect(address.city).toBe('Springfield');
            });

            const addressReq = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            addressReq.flush(mockShippingAddress);
        });

        it('should handle multiple customer operations', () => {
            service.getCustomers().subscribe();
            service.getCustomerById(1).subscribe();
            service.getCustomerById(2).subscribe();
            service.getShippingAddressByCustomerId(1).subscribe();

            const allReqs = httpMock.match(req => req.url.includes(API_BASE_URL));
            expect(allReqs.length).toBe(4);
            allReqs.forEach(req => req.flush({}));
        });

        it('should maintain service state across multiple calls', () => {
            const mockCustomer1 = { customerId: 1, firstName: 'John', lastName: 'Doe' };
            const mockCustomer2 = { customerId: 2, firstName: 'Jane', lastName: 'Smith' };

            service.getCustomerById(1).subscribe((customer: any) => {
                expect(customer.firstName).toBe('John');
            });

            const req1 = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            req1.flush(mockCustomer1);

            service.getCustomerById(2).subscribe((customer: any) => {
                expect(customer.firstName).toBe('Jane');
            });

            const req2 = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=2`);
            req2.flush(mockCustomer2);

            // Verify API_BASE_URL still exists
            expect(service.API_BASE_URL).toBe(API_BASE_URL);
        });
    });

    describe('HTTP Method Verification', () => {
        it('getCustomers should use GET method', () => {
            service.getCustomers().subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/customers`);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('getCustomerById should use GET method', () => {
            service.getCustomerById(1).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/customer?customerID=1`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        });

        it('getShippingAddressByCustomerId should use GET method', () => {
            service.getShippingAddressByCustomerId(1).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/shippingAddressByCustomerId?customerID=1`);
            expect(req.request.method).toBe('GET');
            req.flush({});
        });
    });

    describe('URL Construction', () => {
        it('should construct correct base URL for customers endpoint', () => {
            service.getCustomers().subscribe();
            const req = httpMock.expectOne(req => req.url.includes('customers'));
            expect(req.request.url).toContain(API_BASE_URL);
            expect(req.request.url).toContain('customers');
            req.flush([]);
        });

        it('should construct correct URL with query parameters', () => {
            service.getCustomerById(123).subscribe();
            const req = httpMock.expectOne(req => req.url.includes('customer'));
            expect(req.request.url).toContain(API_BASE_URL);
            expect(req.request.url).toContain('customerID=123');
            req.flush({});
        });

        it('should construct correct shipping address URL', () => {
            service.getShippingAddressByCustomerId(456).subscribe();
            const req = httpMock.expectOne(req => req.url.includes('shippingAddressByCustomerId'));
            expect(req.request.url).toContain(API_BASE_URL);
            expect(req.request.url).toContain('customerID=456');
            req.flush({});
        });
    });
});