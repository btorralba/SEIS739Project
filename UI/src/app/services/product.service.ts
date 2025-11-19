import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  sku: string;
  productName: string;
  price: number;
  productImageId: number;
  size: string;
  color: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API_BASE_URL = 'http://localhost:8080/api';
  products = [];

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.API_BASE_URL}/products`);
  }

  getProductSearch(productName) {
    return this.httpClient.get(`${this.API_BASE_URL}/product?productName=${productName}`);
  }

  getSKU(name, color, size) {
    return this.httpClient.get(`${this.API_BASE_URL}/product/sku?name=${name}&color=${color}&size=${size}`);
  }

  addItemsToCart(product) {
    this.products.push(product);
  }

  getCart() {
    return this.products;
  }

  setCart(cart) {
    this.products = cart;
  }

  updateProduct(request) {
    return this.httpClient.post(`${this.API_BASE_URL}/update/product`, request);
  }
}
