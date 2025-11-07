import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

export interface Product {
  sku: number;
  productName: string;
  price: number;
  productImageId: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  product: Product;

  constructor(private readonly router: Router, private snack: MatSnackBar) {
    this.product = this.router.getCurrentNavigation().extras.state['product'];
  }

  addToCart() {
    this.snack.open(`${this.product.productName} added to cart`, 'Close', { duration: 2000 });
  }

  navigateHome() {
    this.router.navigateByUrl("/");
  }
}
