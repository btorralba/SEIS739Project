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
    private readonly router: Router
  ) { }

  handleProductClick() {
    this.router.navigate([`/product/${this.product.sku}`], { state: { product: this.product } });

  }
}
