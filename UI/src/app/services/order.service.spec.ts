import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService, Order } from './order.service';

describe('OrderService', () => {
    let service: OrderService;
    let httpMock: HttpTestingController;
    const API_BASE_URL = 'http://localhost:8080/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [OrderService]
        });

        service = TestBed.inject(OrderService);
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

    describe('submitPayment()', () => {
        it('should make POST request to payment endpoint', () => {
            const paymentRequest = {
                customerId: 1,
                cardNumber: '4111111111111111',
                expiration: '12/25',
                cvv: '123'
            };

            service.submitPayment(paymentRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            expect(req.request.method).toBe('POST');
            req.flush({ message: 'Payment submitted' });
        });

        it('should send payment data in request body', () => {
            const paymentRequest = {
                customerId: 1,
                cardNumber: '4111111111111111',
                expiration: '12/25',
                cvv: '123'
            };

            service.submitPayment(paymentRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            expect(req.request.body).toEqual(paymentRequest);
            req.flush({});
        });

        it('should return Observable response', () => {
            const paymentRequest = { customerId: 1, cardNumber: '4111111111111111' };
            const mockResponse = { message: 'success' };

            service.submitPayment(paymentRequest).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            req.flush(mockResponse);
        });

        it('should construct correct endpoint URL', () => {
            const paymentRequest = { customerId: 1 };

            service.submitPayment(paymentRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            expect(req.request.url).toBe(`${API_BASE_URL}/add/payment`);
            req.flush({});
        });

        it('should handle payment with all fields', () => {
            const paymentRequest = {
                customerId: 1,
                cardNumber: '5555555555554444',
                expiration: '06/26',
                cvv: '456',
                cardholderName: 'John Doe'
            };

            service.submitPayment(paymentRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            expect(req.request.body).toEqual(paymentRequest);
            req.flush({});
        });

        it('should handle multiple payment submissions', () => {
            const payment1 = { customerId: 1, cardNumber: '4111111111111111' };
            const payment2 = { customerId: 2, cardNumber: '5555555555554444' };

            service.submitPayment(payment1).subscribe();
            service.submitPayment(payment2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/add/payment`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({}));
        });

        it('should handle payment error response', () => {
            const paymentRequest = { customerId: 1, cardNumber: 'invalid' };

            service.submitPayment(paymentRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(400);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            req.flush({ error: 'Invalid card' }, { status: 400, statusText: 'Bad Request' });
        });

        it('should handle payment declined', () => {
            const paymentRequest = { customerId: 1, cardNumber: '4111111111111111' };

            service.submitPayment(paymentRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(402);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            req.flush({ error: 'Payment declined' }, { status: 402, statusText: 'Payment Required' });
        });
    });

    describe('submitShipping()', () => {
        it('should make POST request to shipping endpoint', () => {
            const shippingRequest = {
                customerId: 1,
                addressLine1: '123 Main St',
                city: 'Springfield',
                zipCode: '62701',
                stateAbbr: 'IL'
            };

            service.submitShipping(shippingRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            expect(req.request.method).toBe('POST');
            req.flush({ message: 1 });
        });

        it('should send shipping data in request body', () => {
            const shippingRequest = {
                customerId: 1,
                addressLine1: '456 Oak Ave',
                city: 'Chicago',
                zipCode: '60601',
                stateAbbr: 'IL'
            };

            service.submitShipping(shippingRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            expect(req.request.body).toEqual(shippingRequest);
            req.flush({});
        });

        it('should return Observable response with shipping id', () => {
            const shippingRequest = { customerId: 1, addressLine1: '123 Main St' };
            const mockResponse = { message: 1 };

            service.submitShipping(shippingRequest).subscribe((response: any) => {
                expect(response.message).toBe(1);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            req.flush(mockResponse);
        });

        it('should construct correct endpoint URL', () => {
            const shippingRequest = { customerId: 1 };

            service.submitShipping(shippingRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            expect(req.request.url).toBe(`${API_BASE_URL}/add/shipping`);
            req.flush({});
        });

        it('should handle shipping with all fields', () => {
            const shippingRequest = {
                customerId: 1,
                addressLine1: '123 Main St',
                addressLine2: 'Apt 4',
                addressLine3: 'Suite 100',
                city: 'Springfield',
                stateAbbr: 'IL',
                zipCode: '62701'
            };

            service.submitShipping(shippingRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            expect(req.request.body).toEqual(shippingRequest);
            req.flush({});
        });

        it('should handle multiple shipping submissions', () => {
            const shipping1 = { customerId: 1, addressLine1: '123 Main St' };
            const shipping2 = { customerId: 2, addressLine1: '456 Oak Ave' };

            service.submitShipping(shipping1).subscribe();
            service.submitShipping(shipping2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/add/shipping`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({}));
        });

        it('should handle shipping error response', () => {
            const shippingRequest = { customerId: 1, addressLine1: '' };

            service.submitShipping(shippingRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(400);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            req.flush({ error: 'Invalid address' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('submitOrder()', () => {
        it('should make POST request to order endpoint', () => {
            const orderRequest = {
                orderNumber: 12345,
                sku: 'SKU001',
                status: 'ORDERED',
                shippingId: 1,
                customerId: 1
            };

            service.submitOrder(orderRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('should send order data in request body', () => {
            const orderRequest = {
                orderNumber: 67890,
                sku: 'SKU002',
                status: 'ORDERED',
                shippingId: 2,
                customerId: 2
            };

            service.submitOrder(orderRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            expect(req.request.body).toEqual(orderRequest);
            req.flush({});
        });

        it('should return Observable response', () => {
            const orderRequest = { orderNumber: 12345, sku: 'SKU001' };
            const mockResponse = { message: 'Order created' };

            service.submitOrder(orderRequest).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            req.flush(mockResponse);
        });

        it('should construct correct endpoint URL', () => {
            const orderRequest = { orderNumber: 12345 };

            service.submitOrder(orderRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            expect(req.request.url).toBe(`${API_BASE_URL}/add/order`);
            req.flush({});
        });

        it('should handle multiple order submissions', () => {
            const order1 = { orderNumber: 12345, sku: 'SKU001' };
            const order2 = { orderNumber: 67890, sku: 'SKU002' };

            service.submitOrder(order1).subscribe();
            service.submitOrder(order2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/add/order`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({}));
        });

        it('should handle order error response', () => {
            const orderRequest = { orderNumber: 12345 };

            service.submitOrder(orderRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(400);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            req.flush({ error: 'Invalid order' }, { status: 400, statusText: 'Bad Request' });
        });

        it('should handle order with all fields', () => {
            const orderRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'ORDERED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.submitOrder(orderRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            expect(req.request.body).toEqual(orderRequest);
            req.flush({});
        });
    });

    describe('getOrders()', () => {
        it('should make GET request to orders endpoint', () => {
            service.getOrders().subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('should return Observable with orders array', () => {
            const mockOrders: Order[] = [
                {
                    orderSk: 1,
                    sku: 123,
                    status: 'ORDERED',
                    shippingId: 1,
                    customerId: 1,
                    orderNumber: '12345'
                },
                {
                    orderSk: 2,
                    sku: 456,
                    status: 'SHIPPED',
                    shippingId: 2,
                    customerId: 2,
                    orderNumber: '67890'
                }
            ];

            service.getOrders().subscribe(orders => {
                expect(orders).toEqual(mockOrders);
                expect(Array.isArray(orders)).toBe(true);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush(mockOrders);
        });

        it('should construct correct endpoint URL with wildcard status', () => {
            service.getOrders().subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            expect(req.request.url).toBe(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush([]);
        });

        it('should handle empty orders list', () => {
            service.getOrders().subscribe((orders: any) => {
                expect(orders).toEqual([]);
                expect(orders.length).toBe(0);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush([]);
        });

        it('should handle single order response', () => {
            const mockOrder: Order = {
                orderSk: 1,
                sku: 123,
                status: 'ORDERED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.getOrders().subscribe((orders: any) => {
                expect(orders.length).toBe(1);
                expect(orders[0]).toEqual(mockOrder);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush([mockOrder]);
        });

        it('should handle multiple orders response', () => {
            const mockOrders: Order[] = Array.from({ length: 5 }, (_, i) => ({
                orderSk: i + 1,
                sku: i + 1,
                status: 'ORDERED',
                shippingId: i + 1,
                customerId: i + 1,
                orderNumber: `${12345 + i}`
            }));

            service.getOrders().subscribe((orders: any) => {
                expect(orders.length).toBe(5);
                expect(orders).toEqual(mockOrders);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush(mockOrders);
        });

        it('should handle error response', () => {
            service.getOrders().subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(500);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            req.flush(null, { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('updateOrder()', () => {
        it('should make POST request to update order endpoint', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('should send order data in request body', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'DELIVERED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.body).toEqual(updateRequest);
            req.flush({});
        });

        it('should return Observable response', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };
            const mockResponse = { message: 'Order updated' };

            service.updateOrder(updateRequest).subscribe(response => {
                expect(response).toEqual(mockResponse);
            });

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            req.flush(mockResponse);
        });

        it('should construct correct endpoint URL', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.url).toBe(`${API_BASE_URL}/update/order`);
            req.flush({});
        });

        it('should handle multiple update requests', () => {
            const update1: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            const update2: Order = {
                orderSk: 2,
                sku: 123,
                status: 'DELIVERED',
                shippingId: 2,
                customerId: 2,
                orderNumber: '67890'
            };

            service.updateOrder(update1).subscribe();
            service.updateOrder(update2).subscribe();

            const requests = httpMock.match(`${API_BASE_URL}/update/order`);
            expect(requests.length).toBe(2);
            requests.forEach(req => req.flush({}));
        });

        it('should handle status change from ORDERED to SHIPPED', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.body.status).toBe('SHIPPED');
            req.flush({});
        });

        it('should handle status change to DELIVERED', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'DELIVERED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe();

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.body.status).toBe('DELIVERED');
            req.flush({});
        });

        it('should handle error response', () => {
            const updateRequest: Order = {
                orderSk: 1,
                sku: 123,
                status: 'SHIPPED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            service.updateOrder(updateRequest).subscribe(
                () => { },
                error => {
                    expect(error.status).toBe(404);
                }
            );

            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            req.flush(null, { status: 404, statusText: 'Not Found' });
        });
    });

    describe('Order Interface', () => {
        it('should have Order interface with all required properties', () => {
            const order: Order = {
                orderSk: 1,
                sku: 123,
                status: 'ORDERED',
                shippingId: 1,
                customerId: 1,
                orderNumber: '12345'
            };

            expect(order.orderSk).toBe(1);
            expect(order.sku).toBe(123);
            expect(order.status).toBe('ORDERED');
            expect(order.shippingId).toBe(1);
            expect(order.customerId).toBe(1);
            expect(order.orderNumber).toBe('12345');
        });


    });

    describe('Integration Tests', () => {
        it('should handle complete order submission flow', () => {
            const paymentRequest = { customerId: 1, cardNumber: '4111111111111111' };
            const shippingRequest = { customerId: 1, addressLine1: '123 Main St', city: 'Springfield' };
            const orderRequest = {
                orderNumber: 12345,
                sku: 'SKU001',
                status: 'ORDERED',
                shippingId: 1,
                customerId: 1
            };

            service.submitPayment(paymentRequest).subscribe();
            const paymentReq = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            paymentReq.flush({ message: 'success' });

            service.submitShipping(shippingRequest).subscribe();
            const shippingReq = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            shippingReq.flush({ message: 1 });

            service.submitOrder(orderRequest).subscribe();
            const orderReq = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            orderReq.flush({});

            expect(paymentReq.request.method).toBe('POST');
            expect(shippingReq.request.method).toBe('POST');
            expect(orderReq.request.method).toBe('POST');
        });

        it('should retrieve orders and update order status', () => {
            const mockOrders: Order[] = [
                {
                    orderSk: 1,
                    sku: 123,
                    status: 'ORDERED',
                    shippingId: 1,
                    customerId: 1,
                    orderNumber: '12345'
                }
            ];

            service.getOrders().subscribe((orders: any) => {
                expect(orders.length).toBe(1);
            });

            const getReq = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            getReq.flush(mockOrders);

            const updatedOrder: Order = {
                ...mockOrders[0],
                status: 'SHIPPED'
            };

            service.updateOrder(updatedOrder).subscribe();
            const updateReq = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            updateReq.flush({});

            expect(updateReq.request.body.status).toBe('SHIPPED');
        });

        it('should handle multiple order operations in sequence', () => {
            service.submitOrder({ orderNumber: 1 }).subscribe();
            service.submitOrder({ orderNumber: 2 }).subscribe();
            service.getOrders().subscribe();
            service.updateOrder({ orderNumber: 1, status: 'SHIPPED' }).subscribe();

            const allReqs = httpMock.match(req => req.url.includes(API_BASE_URL));
            expect(allReqs.length).toBe(4);
            allReqs.forEach(req => req.flush({}));
        });
    });

    describe('HTTP Method Verification', () => {
        it('submitPayment should use POST method', () => {
            service.submitPayment({}).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/add/payment`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('submitShipping should use POST method', () => {
            service.submitShipping({}).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/add/shipping`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('submitOrder should use POST method', () => {
            service.submitOrder({}).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/add/order`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });

        it('getOrders should use GET method', () => {
            service.getOrders().subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/ordersByParam?status=*`);
            expect(req.request.method).toBe('GET');
            req.flush([]);
        });

        it('updateOrder should use POST method', () => {
            service.updateOrder({} as Order).subscribe();
            const req = httpMock.expectOne(`${API_BASE_URL}/update/order`);
            expect(req.request.method).toBe('POST');
            req.flush({});
        });
    });
});