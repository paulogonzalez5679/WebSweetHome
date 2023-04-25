import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", component: ListarComponent}
];

@NgModule({
  declarations: [ListarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class TestModule { }
