import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    API_BASE_URL = 'http://localhost:8080/api';

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    getCustomers() {
        return this.httpClient.get(`${this.API_BASE_URL}/customers`);
    }

    getCustomerById(id) {
        return this.httpClient.get(`${this.API_BASE_URL}/customer?customerID=${id}`);
    }

    getShippingAddressByCustomerId(id) {
        return this.httpClient.get(`${this.API_BASE_URL}/shippingAddressByCustomerId?customerID=${id}`);
    }

}
