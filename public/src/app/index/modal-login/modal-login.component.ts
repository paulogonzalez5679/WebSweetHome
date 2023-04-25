import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "app/services/auth/auth/auth.service";
import swal from "sweetalert2";
declare var $: any;

declare interface UserLogin {
  email?: string;
  password?: string;
}

@Component({
  selector: "app-modal-login",
  templateUrl: "./modal-login.component.html",
  styleUrls: ["./modal-login.component.css"],
})
export class ModalLoginComponent implements OnInit {
  @ViewChild("modalLogin") modalLogin: ElementRef;

  public userLogin: UserLogin;

  array = [];
  loginForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
    ]),
    password: new FormControl("", Validators.required),
  });
  test: Date = new Date();
  loginService: any;

  constructor(private authservice: AuthService, public afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.userLogin = {};
  }

  /**
   * *** Manejo del modal login       ***
   * *** seteamos la variable a false ***
   * *** para ocultar el cargando     ***
   */
  ngAfterViewInit() {
    $(this.modalLogin.nativeElement).on("hidden.bs.modal", () => {});
    $(this.modalLogin.nativeElement).on("show.bs.modal", () => {});
  }

  /**
   * *** Funcion para loguear al usuario           ***
   * *** validamos el formulario si es valido      ***
   * *** llamamos el servicio login en authSevice  ***
   * @param userLogin
   * @param valid
   */
  async onLogin(userLogin: UserLogin, valid: boolean) {
    if (valid) {
      if (userLogin) {
        $("#modalLogin").modal("hide");
        console.log('*** AQUI ***');
        
        this.authservice.login(userLogin.email, userLogin.password);
      }
    }
  }

  async recoverPass(userLogin: UserLogin, valid: boolean) {
    // (userLogin, valid, "HASTA AQUI");

      await this.authservice.sendEmailRecoverPass(userLogin);
      // console.log(userLogin, valid, "HASTA AQUI 1");

      var auth = this.afAuth;
      // console.log(userLogin, valid, "HASTA AQUI 2" );

      var emailAddress = userLogin.email;
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        swal("Recuperando constraseña", "Por favor revisa tu correo electrónico para poder recuperar tu contraseña", "success");

        // console.log("entroooo!!!")
      }).catch(function(error) {
        swal("ERROR", "Algo salio mal", "success");

        // console.log("no entra")
      })
    

    // console.log("no entra! REVISA")
  }

}
