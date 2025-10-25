import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService, Customer, User } from '../services/authentication.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';


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
    private readonly router: Router
  ) {

  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((resp: User) => {
      this.authService.login(resp).subscribe((response: any) => {
        this.authService.getCustomerInfo(response.message).subscribe((customer: Customer) => {
          this.customer = customer;
          this.isLoggedIn = true;
        });
      });
    });
  }

  productSearch() {
    this.productService.getProductSearch(this.productName).subscribe((resp: any) => {
      if (resp) {
        this.router.navigate([`/product/${resp.sku}`], { state: { product: resp } });
      }
    });
  }

}
