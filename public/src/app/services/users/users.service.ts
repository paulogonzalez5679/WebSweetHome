import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public user: Users;
  constructor(private fb: AngularFirestore) { }

  async getUserByEmails(uid: string) {
    return this.fb.collection<Users>("users_collection").doc(uid).valueChanges();
  }

  async getUserById(uid: string) {
    return this.fb.collection<Users>("users_collection",ref => ref.where('user_id', '==', uid)).valueChanges();
  }

  public getUserByEmail(user: Users) {
    return this.fb
      .collection<Users>("users_collection").doc(user.user_email)
      .snapshotChanges();
  }
  /**
   * *** consultamos todos los usuarios ***
   */
  async getAllUsers() {
    return this.fb.collection<Users>("users_collection").valueChanges();
  }

  public saveUser(user: Users, infoUser: Users) {
    this.user = user;
    localStorage.setItem("infoUser", JSON.stringify(infoUser));
    return this.fb.collection("users_collection").doc(infoUser.user_email).update(user);
  }

  public changeStateUsuer (user: Users, state: boolean) {
    if (state) {
      return this.fb.collection("users_collection").doc(user.user_email).update({user_state_account: state})
    } else {
      return this.fb.collection("users_collection").doc(user.user_email).update({user_state_account: state, user_state_validation: state})
    }
  }


  public changeStateUsuerValid (user: Users, state: boolean) {
      return this.fb.collection("users_collection").doc(user.user_email).update({user_state_account: state, user_state_validation: state})
  }
  public updateImagePerfil(infoUser: Users, imagePerfil: any) {
    const userPerfil = {
      user_image_perfil : imagePerfil,
    }
    this.fb.collection('users_collection').doc(infoUser.user_email).update(userPerfil)
  }
 
  public getAllUsersClient() {
    return this.fb.collection('users_collection', ref => ref.where('user_type_account', '==', 0)).valueChanges();
  }
}
