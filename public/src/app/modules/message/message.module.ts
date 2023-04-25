import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { MessageComponent } from './message/message.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message/message.component'
const routes: Routes = [{ path: "", component:  MessageComponent}];


@NgModule({
  declarations: [MessageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MessageModule { }
