import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

const routes: Routes = [{ path: "", component: ProductsComponent }];

@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    JwBootstrapSwitchNg2Module,
  ]
})
export class ProductsModule { }
