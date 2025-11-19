import { Component, inject } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MaterialModule } from '../material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

export interface Item {
  quantity: number;
  size: string;
  sku: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatButton, MaterialModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  dialogRef = inject(MatDialogRef<CartComponent>);
  items: Item[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) {

  }

  ngOnInit() {
    this.items = this.productService.getCart();
  }

  close() {
    this.dialogRef.close();
  }

  checkout() {
    this.router.navigateByUrl("/checkout");
    this.dialogRef.close('TEST')
  }

}
