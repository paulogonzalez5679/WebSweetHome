import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
// import { User } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private firestore: AngularFirestore

  ) { }

  /**
   * crear una funcion
   * que reciba el usuario
   * imprimir el usuario que recibe solo para cer que funcione
   */

  /**
   * funcion para registrar un usuario en la base de datos,
   * recibe toda la informacion del usuario(todo el formulario )
   * @param user 
   */
  async registrarUsuario(user: Users) {
    return this.firestore.collection('users_collection').doc(user.user_email).set(user);
  }

  async otra(otro) {

  }

}
