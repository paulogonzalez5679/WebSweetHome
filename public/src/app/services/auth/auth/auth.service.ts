import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";
import { first, take } from "rxjs/operators";
import swal from "sweetalert2";
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { IndexComponent } from "app/index/index.component";
declare var $: any;

@Injectable()
export class AuthService {
  public user: User;

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private fb: AngularFirestore,
    private nav: Location,
  ) { }

  async getUserByEmail(uid: string) {
    return this.fb.collection('users_collection').doc(uid).valueChanges();
  }

  async login(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      $("#modalLogin").modal("hide");

      var responseUser = (await this.getUserByEmail(result.user.email))
        .pipe(take(1))
        .toPromise();

      if (await responseUser) {
        var infoUser = {
          user_email: (await responseUser)["user_email"],
          user_name: (await responseUser)["user_name"],
          user_lastname: (await responseUser)["user_lastname"],
          user_product: (await responseUser)["user_product"],
          user_type: (await responseUser)["user_type"],
          user_city: (await responseUser)["user_city"],
          user_cell_phone: (await responseUser)["user_cell_phone"],
        };

        localStorage.setItem("infoUser", JSON.stringify(infoUser));
        if ((await responseUser)["user_type"] == 0) {
          /// *** Cliente ***
          this.router.navigate(["/index"]);
        }
        else if ((await responseUser)["user_type"] == 1) {
          this.router.navigate(["/orders"]);
        } 
        return result;
      }
    } catch (error) {
      $("#modalLogin").modal("hide");
      if (error.code == "auth/wrong-password") {
        swal(
          "Atención",
          "La contraseña no es válida o el usuario no tiene una contraseña",
          "error"
        );
      }
      if (error.code == "auth/user-not-found") {
        swal(
          "Atención",
          "No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado",
          "error"
        );
        // this.utilitiesService.showMessage('top', 'right', 4, "No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado");
      }
      if (error.code == "auth/invalid-email") {
        swal("Atención", "El email no tiene un formato válido.", "error");

        // this.utilitiesService.showMessage('top', 'right', 4, "Demasiados intentos de inicio de sesión fallidos.");
      }

      if (error.code == "auth/too-many-requests") {
        swal(
          "Atención",
          "Demasiados intentos de inicio de sesión fallidos.",
          "error"
        );
      }
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then((ok) => {
          swal("OK", "Registro Exitoso", "success");
          this.router.navigate(['/index']);
          return ok.user;
        })
        .catch((error) => {
          if (error.code == "auth/user-not-found") {
            swal(
              "Atención",
              "No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado",
              "error"
            );
          }

          if (error.code == "auth/email-already-in-use") {
            swal("Atención", "El email ingresado ya está en uso", "error");
          }

          if (error.code == "auth/wrong-password") {
            swal(
              "Atención",
              "La contraseña no es válida o el usuario no tiene una contraseña",
              "error"
            );
          }

          if (error.code == "auth/too-many-requests") {
            swal(
              "Atención",
              "Demasiados intentos de inicio de sesión fallidos.",
              "error"
            );
          }
          if (error.code == "auth/invalid-email") {
            swal("Atención", "El email no tiene un formato válido.", "error");
          }
        });
      return result;
    } catch (error) {
      if (error.code == "auth/user-not-found") {
        swal(
          "Atención",
          "No hay registro de usuario correspondiente a este email. El usuario puede haber sido eliminado",
          "error"
        );
      }

      if (error.code == "auth/email-already-in-use") {
        swal("Atención", "El email ingresado ya está en uso", "error");
      }
      if (error.code == "auth/wrong-password") {
        swal(
          "Atención",
          "La contraseña no es válida o el usuario no tiene una contraseña",
          "error"
        );
      }
      if (error.code == "auth/too-many-requests") {
        swal(
          "Atención",
          "Demasiados intentos de inicio de sesión fallidos.",
          "error"
        );
      }
      if (error.code == "auth/invalid-email") {
        swal("Atención", "El email no tiene un formato válido.", "error");
      }
      return error;
    }
  }

  async logout() {
    localStorage.clear();
    await this.afAuth.signOut();
    location.assign("/");
    // this.router.navigate([""]);
  }
  
  getCurrentUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  goBack() {
    this.nav.back();
  }
  async sendEmailRecoverPass(user: any) {
    /// *** validar que el email exista para enviar el correo ***
    var responseUser = (await this.getUserByEmail(user.email))
      .pipe(take(1))
      .toPromise();

    if (await responseUser) {

    }

    let code = new Date().getTime().toString().substring(7);
    var infoEmeil = {
      user_email: user.email,
    };
    await this.fb
      .collection("emails/recover_pass/send_email")
      .doc(user.email)
      .set(infoEmeil);
  }
}

