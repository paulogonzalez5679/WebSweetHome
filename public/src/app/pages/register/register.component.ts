import { Component, OnInit, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Router } from "@angular/router";
import { RegisterService } from "app/services/register/register.service";
import swal from "sweetalert2";
import { AuthService } from "app/services/auth/auth/auth.service";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: "register-cmp",
  templateUrl: "./register.component.html",
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  test: Date = new Date();
  public userRegister: Users;
   registerForm = new FormGroup({
    
    user_name: new FormControl(""),
    user_lastname: new FormControl(""),
    user_email: new FormControl(""),
    user_password: new FormControl(""),
    user_confirPassword: new FormControl(""),
    user_cell_phone: new FormControl(""),
    user_city: new FormControl(""),
    user_type: new FormControl(0),
  });

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private registerService: RegisterService
  ) { }


  ngOnInit() {
    this.userRegister = {};

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700);
  }

  /**
   * Con esta funcion se guarda los datos en la base de datos,
   * y en html debo form [formGroup]= "registerForm" (ngSubmit)= "save()">
   */
  async save() {
    this.registerService.registrarUsuario(this.registerForm.value);

  }

  async onRegister(userRegister:Users, isValid) {
    var email = userRegister.user_email;
    var password = userRegister.user_password;

    if (isValid) {
      if (userRegister.user_confirPassword == userRegister.user_password) {
        try {
          
          /// consumir el servicio para crear un usuario con email pass
          /// const user = await this.authSvc.register(email, password);v
          /// *** si se crea el usuario registramos toda la data en la base de datos ***

          if (userRegister) {
            userRegister.user_type = 0;
            this.authSvc.register(email, password);

            this.registerService.registrarUsuario(userRegister);
            // this.router.navigate(['/index']);
          }
        } catch (error) {
        }
      } else {
        swal('Verifique las contraseñas', 'LAs contreseñas ingresadas no coinciden', 'error')
      }
    }





  }

}

