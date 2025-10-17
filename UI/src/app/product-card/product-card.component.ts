import { Component, Input } from '@angular/core';
import { Product } from '../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private snack: MatSnackBar) {}

  addToCart() {
    this.snack.open(`${this.product.productName} added to cart`, 'Close', { duration: 2000 });
  }
}
