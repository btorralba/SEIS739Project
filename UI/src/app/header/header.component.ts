import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService, Customer, User } from '../services/authentication.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartComponent } from '../cart/cart.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  dialog = inject(MatDialog);
  isLoggedIn: boolean = false;
  customer: Customer;
  productName: string;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private snack: MatSnackBar
  ) {

  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data && data.isRegister) {
        this.authService.register(data).subscribe((response: any) => {
          let newCustomer = {
            customerId: response.message,
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            phoneNumber: data.phoneNumber
          }
          this.authService.addCustomer(newCustomer).subscribe((resp: any) => {
            this.getCustomerInfo(resp);
          });
        });
      } else if (data) {
        this.authService.login(data).subscribe((response: any) => {
          this.getCustomerInfo(response);
        });
      }

    });
  }

  getCustomerInfo(response) {
    this.authService.getCustomerInfo(response.message).subscribe((customer: Customer) => {
      this.customer = customer;
      this.isLoggedIn = true;
      this.authService.setIsLoggedIn();
      this.authService.setLoggedInUserCustomer(customer);
      this.router.navigateByUrl("/");
    });
  }

  productSearch() {
    let mostLikelySearchMap = new Map([
      ["s", "St Michael"],
      ["g", "Guardian Of Shadows"],
      ["p", "Phantom Recon"],
      ["m", "Modern Crusader"],
      ["n", "Night Reaper"]
    ]);
    let productName = mostLikelySearchMap.get(this.productName[0].toLowerCase());
    this.productService.getProductSearch(productName).subscribe((resp: any) => {
      if (resp) {
        this.router.navigate([`/product/${resp.sku}`], { state: { product: resp } });
      } else {
        this.snack.open('No products found!', 'Close', { duration: 2000 })
      }
    });
  }

  openCart() {
    const dialogRef = this.dialog.open(CartComponent, {
      position: { right: '20px', top: '80px' }
    });
  }
}
