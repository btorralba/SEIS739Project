import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Order {
    orderSk: number,
    sku: number,
    status: string,
    shippingId: number,
    customerId: number,
    orderNumber: string
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    API_BASE_URL = 'http://localhost:8080/api';

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    submitPayment(request) {
        return this.httpClient.post(`${this.API_BASE_URL}/add/payment`, request);
    }

    submitShipping(request) {
        return this.httpClient.post(`${this.API_BASE_URL}/add/shipping`, request);
    }

    submitOrder(request) {
        return this.httpClient.post(`${this.API_BASE_URL}/add/order`, request);
    }

    getOrders() {
        return this.httpClient.get(`${this.API_BASE_URL}/ordersByParam?status=*`);
    }

    updateOrder(request) {
        return this.httpClient.post(`${this.API_BASE_URL}/update/order`, request);
    }

}
