import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  sku: string;
  productName: string;
  price: number;
  productImageId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_BASE_URL = 'http://localhost:8080/api';

  constructor(
    private readonly httpClient: HttpClient
  ) {}



  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.API_BASE_URL}/products`);
  }
}
