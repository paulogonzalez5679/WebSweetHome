import { Routes } from "@angular/router";
import { IndexComponent } from "./index/index.component";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";


export const AppRoutes: Routes = [
  { path: "index", component: IndexComponent },
  { path: "", component: IndexComponent },
  {
    path: "",
    redirectTo: "pages/lock",
    pathMatch: "full",
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "orders",
        loadChildren: "./modules/orders/orders.module#OrdersModule",
      },
      
      {
        path: "home",
        loadChildren: "./modules/home/home.module#HomeModule",
      },
      {
        path: "products",
        loadChildren: "./modules/products/products.module#ProductsModule",
      },
      {
        path: "message",
        loadChildren: "./modules/message/message.module#MessageModule",
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "pages",
        loadChildren: "./pages/pages.module#PagesModule",
      },
      {
        path: "register",
        loadChildren: "./modules/register/register.module#RegisterModule",
      },
      {
        path: "perfil",
        loadChildren: "./modules/perfil/perfil.module#PerfilModule",
      },
    ],
  },
];
