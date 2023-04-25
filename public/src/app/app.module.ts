import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent }   from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FixedPluginModule } from './shared/fixedplugin/fixedplugin.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { PagesnavbarModule} from './shared/pagesnavbar/pagesnavbar.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AppRoutes } from './app.routing';
import {AngularFireModule} from '@angular/fire';
import { AngularFireAuthModule} from '@angular/fire/auth'
import { environment } from 'environments/environment';
import { AuthService } from './services/auth/auth/auth.service';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatSliderModule } from '@angular/material/slider';
import { ModalLoginComponent } from './index/modal-login/modal-login.component';
import { IndexComponent } from './index/index.component';
import { CarritoComponent } from './index/carrito/carrito.component';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './modules/payment/payment.component';
import { ListProductComponent } from './index/list-product/list-product.component';
import { ListWishlistComponent } from './index/list-wishlist/list-wishlist.component';
import { ModalDetailsComponent } from './index/modal-details/modal-details.component';
import { NavbarComponent } from './index/navbar/navbar.component';



@NgModule({
    imports:      [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(AppRoutes,{
          useHash: false
        }),
        HttpModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedPluginModule,
        PagesnavbarModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireStorageModule,
        MatSliderModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        ModalLoginComponent,
        ModalDetailsComponent,
        IndexComponent,
        CarritoComponent,
        PaymentComponent,
        ListProductComponent,
        ListWishlistComponent,
        NavbarComponent
    ],
    bootstrap:    [ AppComponent ],
    providers: [ AuthService ]

})

export class AppModule { }
