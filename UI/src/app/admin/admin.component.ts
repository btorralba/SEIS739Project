import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { MaterialModule } from "../material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { variables } from '../environment/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order, OrderService } from '../services/order.service';
import { Product, ProductService } from '../services/product.service';
import { Customer } from '../services/authentication.service';
import { CustomerService } from '../services/customer.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AdminComponent {
  username: string;
  password: string;
  isValid: boolean = false;
  productsDataSource = new MatTableDataSource<Product>([]);
  ordersDataSource = new MatTableDataSource<Order>([]);
  products: Product[] = [];
  orders: Order[] = [];
  customers: Customer[] = [];
  productTableOpen = signal(true);
  orderTableOpen = signal(false);
  customerTableOpen = signal(false);

  @ViewChild('productSort') productSort: MatSort;
  @ViewChild('orderSort') orderSort: MatSort;

  productsDisplayedColumns = ["productName", "size", "color", "sku", "price", "quantity"];
  customerDisplayedColumns = ["firstName", "lastName", "emailAddress"];
  orderDisplayedColumns = ["orderSk", "status", "orderNumber", "sku", "customerName", "shippingAddress"];

  originalProductData: any = [];
  originalOrderData: any = [];

  constructor(
    private readonly snack: MatSnackBar,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly customerSerivce: CustomerService
  ) {
  }

  validateCreds() {
    this.isValid = this.username == variables.adminUsername && this.password == variables.adminPassword;

    if (!this.isValid) {
      this.snack.open("Incorrect...", "close", { duration: 2000 });
    } else {
      this.setTables();
    }
  }

  setTables() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      const sortedProducts = [...data].sort((a: Product, b: Product) => {
        const skuA = typeof a.sku === 'string' ? parseInt(a.sku) : a.sku;
        const skuB = typeof b.sku === 'string' ? parseInt(b.sku) : b.sku;
        return skuA - skuB;
      });
      this.productsDataSource.data = sortedProducts;
      // keep legacy array for tests and other code that uses it
      this.products = sortedProducts;
      if (this.productSort) {
        this.productsDataSource.sort = this.productSort;
      }
    });

    this.customerSerivce.getCustomers().subscribe((data: Customer[]) => {
      this.customers = data;
    });

    this.orderService.getOrders().subscribe((data: Order[]) => {
      let orders = [];
      data.forEach((order) => {
        this.customerSerivce.getCustomerById(order.customerId).subscribe((resp: any) => {
          order['customerName'] = resp.firstName + ' ' + resp.lastName;
        });
        this.customerSerivce.getShippingAddressByCustomerId(order.customerId).subscribe((resp: any) => {
          let suiteNum = resp.addressLine2 ?? '';
          let attn = resp.addressLine3 ? resp.addressLine3 + ', ' : '';
          order['shippingAddress'] = resp.addressLine1 + ', ' + suiteNum + attn + resp.city + ', ' + resp.stateAbbr + ', ' + resp.zipCode
        });
        orders.push(order);
      });
      const sortedOrders = [...orders].sort((a: Order, b: Order) => {
        const orderSkA = typeof a.orderSk === 'string' ? parseInt(a.orderSk) : a.orderSk;
        const orderSkB = typeof b.orderSk === 'string' ? parseInt(b.orderSk) : b.orderSk;
        return orderSkA - orderSkB;
      });
      this.ordersDataSource.data = sortedOrders;
      // keep legacy array for tests and other code that uses it
      this.orders = sortedOrders;
      if (this.orderSort) {
        this.ordersDataSource.sort = this.orderSort;
      }
    });
  }

  submitChanges() {
    let isDataUpdate = false;

    this.productService.getProducts().subscribe((data: Product[]) => {
      this.originalProductData = [...data];
      for (let i = 0; i < this.originalProductData.length; i++) {
        if (this.originalProductData[i].price != this.products[i].price ||
          this.originalProductData[i].quantity != this.products[i].quantity
        ) {
          this.productService.updateProduct(this.products[i]).subscribe((resp) => {
            isDataUpdate = true;
          });
        }
      }
    });

    this.orderService.getOrders().subscribe((data: Order[]) => {
      this.originalOrderData = [...data];
      for (let i = 0; i < this.originalOrderData.length; i++) {
        if (this.originalOrderData[i].status != this.orders[i].status) {
          this.orderService.updateOrder(this.orders[i]).subscribe((resp) => {
            isDataUpdate = true;

          });
        }
      }
    });

    if (isDataUpdate) {
      this.setTables();
    }
  }
}
