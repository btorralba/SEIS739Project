import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  filterOptions = {
    colors: ['Black', 'Tan'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large']
  };
  filters = this.fb.group({
    colors: [''],
    quantity: 1,
    sizes: ['']
  });

  product: Product;

  constructor(
    private readonly router: Router,
    private snack: MatSnackBar,
    private fb: FormBuilder,
    private readonly productService: ProductService
  ) {
    this.product = this.router.getCurrentNavigation().extras.state['product'];
  }

  addToCart() {
    let colorSelected = this.filters.controls['colors'].value;
    let quantitySelected = this.filters.controls['quantity'].value;
    let sizeSelected = this.filters.controls['sizes'].value;

    let selectedProduct = {
      color: colorSelected,
      quantity: quantitySelected,
      size: sizeSelected,
      name: this.product.productName,
      productImageId: this.product.productImageId,
      price: this.product.price
    };


    if (colorSelected && sizeSelected) {
      this.addProductToCart(selectedProduct);
      this.snack.open(`${quantitySelected} ${this.product.productName} added to cart`, 'Close', { duration: 2000 });
    } else {
      this.snack.open('Select a color, size, and quantity', 'Close', { duration: 2000 });
    }
  }

  addProductToCart(selectedProduct) {
    this.productService.getSKU(selectedProduct.name, selectedProduct.color, selectedProduct.size).subscribe((data: any) => {
      selectedProduct.sku = data.message;
      this.productService.addItemsToCart(selectedProduct);
    });
  }

  navigateHome() {
    this.router.navigateByUrl("/");
  }
}
