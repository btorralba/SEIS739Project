import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  dialogRef = inject(MatDialogRef<LoginComponent>);
  data = {
    userID: '',
    userPass: '',
    isRegister: false,
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: ''
  };
  userID: string = "";
  userPass: string = "";
  userPass2: string = "";
  isRegister: boolean = false;
  firstName: string = "";
  lastName: string = "";
  emailAddress: string = "";
  phoneNumber: string = "";

  submit() {
    this.data.userID = this.userID;
    this.data.userPass = this.userPass;
    this.data.isRegister = this.isRegister;
    if (this.isRegister) {
      this.data.firstName = this.firstName;
      this.data.lastName = this.lastName;
      this.data.emailAddress = this.emailAddress;
      this.data.phoneNumber = this.phoneNumber ?? '';
    }
    this.dialogRef.close(this.data);
  }

  register() {
    this.isRegister = true;
  }
}
