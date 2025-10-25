import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './product.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        ProductComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
    ]
})
export class ProductModule { }
