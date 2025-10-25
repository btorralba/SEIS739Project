import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
    userId: string;
    userPass: string;
}

export interface Customer {
    customerId: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    API_BASE_URL = 'http://localhost:8080/api';

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    login(request) {
        return this.httpClient.post(`${this.API_BASE_URL}/login`, request);
    }

    getCustomerInfo(customerId) {
        return this.httpClient.get(`${this.API_BASE_URL}/customer?customerID=${customerId}`);
    }

}
