import { Component } from '@angular/core';
import { AuthenticationService, Customer } from '../services/authentication.service';
import { Product, ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  isLoggedIn: boolean = false;
  cartTotal = 0;
  finalTotal = 0;
  shipping = 0;
  taxes = 0;
  cart: any = [];
  isOrderSubmitted: boolean = false;
  currCustomer: Customer;
  orderNumber;

  shippingInfo = this.fb.group({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    zipCode: '',
    city: '',
    state: '',
    customerId: ''
  });

  paymentInfo = this.fb.group({
    firstName: '',
    lastName: '',
    creditCardNumber: '',
    cardExpiration: '',
    cardCVV: ''
  });

  constructor(
    private readonly authService: AuthenticationService,
    private readonly productService: ProductService,
    private readonly snack: MatSnackBar,
    private readonly orderService: OrderService,
    private fb: FormBuilder,
    private readonly router: Router
  ) {

  }

  ngOnInit() {
    this.isLoggedIn = this.getIsLoggedIn();
    this.cart = this.productService.getCart();
    this.calculateCartTotal();
    this.currCustomer = this.authService.getLoggedInUserCustomer();
    this.paymentInfo.controls['firstName'].setValue(this.currCustomer.firstName);
    this.paymentInfo.controls['lastName'].setValue(this.currCustomer.lastName);
    this.shippingInfo.controls['firstName'].setValue(this.currCustomer.firstName);
    this.shippingInfo.controls['lastName'].setValue(this.currCustomer.lastName);
  }

  calculateCartTotal() {
    this.cartTotal = 0;
    this.cart.forEach(element => {
      this.cartTotal += element.price;
    });
    this.calculateFinalTotal();
  }

  getIsLoggedIn() {
    return this.authService.getIsLoggedIn();
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    this.productService.setCart(this.cart);
    this.calculateCartTotal();
  }

  calculateFinalTotal() {
    if (this.cartTotal > 100) {
      this.finalTotal = this.cartTotal * 1.075;
      this.shipping = 0;
      this.taxes = this.cartTotal * 0.075;
    } else {
      this.finalTotal = (this.cartTotal * 1.075) + 10;
      this.shipping = 10;
      this.taxes = this.cartTotal * 0.075;
    }
  }

  submit() {
    let paymentRequest;
    let shippingRequest;
    if (this.paymentInfo.valid) {
      paymentRequest = {
        customerId: this.currCustomer.customerId,
        cardNumber: this.paymentInfo.controls['creditCardNumber'].value,
        expiration: this.paymentInfo.controls['cardExpiration'].value,
        cvv: this.paymentInfo.controls['cardCVV'].value
      };
    }

    if (this.shippingInfo.valid) {
      shippingRequest = {
        customerId: this.currCustomer.customerId,
        addressLine1: this.shippingInfo.controls['addressLine1'].value,
        addressLine2: this.shippingInfo.controls['addressLine2'].value,
        addressLine3: this.shippingInfo.controls['addressLine3'].value,
        city: this.shippingInfo.controls['city'].value,
        zipCode: this.shippingInfo.controls['zipCode'].value,
        stateAbbr: this.shippingInfo.controls['state'].value,
      };
    }

    if (paymentRequest && shippingRequest) {
      this.orderService.submitPayment(paymentRequest).subscribe((resp: any) => {
        this.orderService.submitShipping(shippingRequest).subscribe((response: any) => {
          if (response) {
            let orderNumber = new Date().getTime();
            this.orderNumber = orderNumber;
            for (let i = 0; i < this.cart.length; i++) {
              let orderRequest = {
                orderNumber: orderNumber,
                sku: this.cart[i].sku,
                status: 'ORDERED',
                shippingId: response.message,
                customerId: this.currCustomer.customerId
              };
              this.orderService.submitOrder(orderRequest).subscribe((resp) => {
                if (i == this.cart.length - 1) {
                  this.isOrderSubmitted = true;
                }
              });
            }
          }
        });
      }, (error => {
        console.error(error)
      }));
    } else {
      this.snack.open('Enter all required fields', 'close', { duration: 2000 })
    }
  }

  navigateHome() {
    this.router.navigateByUrl("/");
    this.cart = [];
    this.productService.setCart(this.cart);
  }
}
