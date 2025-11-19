import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [
        ProductComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        MaterialModule,
        ReactiveFormsModule,
        AppRoutingModule,

    ]
})
export class ProductModule { }
