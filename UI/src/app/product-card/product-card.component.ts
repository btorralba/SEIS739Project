import { Component, Input } from '@angular/core';
import { Product } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private snack: MatSnackBar,
    private readonly router: Router
  ) { }

  addToCart() {
    this.snack.open(`${this.product.productName} added to cart`, 'Close', { duration: 2000 });
  }

  handleProductClick() {
    this.router.navigate([`/product/${this.product.sku}`], { state: { product: this.product } });

  }
}
