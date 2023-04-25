import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(
    private fb: AngularFirestore,
  ) { }

  /**
   * funcion para registrar wishlist a los usuarios,
   * @param user 
   * @param product 
   */
  async addWishlist(user: Users, product: Product) {
    return this.fb.collection('users_collection').doc(user.user_email).collection('wishlist').doc(product.pro_id).set({pro_id: product.pro_id});
  }

  getWishlist (user: Users) {
    return this.fb.collection('users_collection').doc(user.user_email).collection('wishlist').valueChanges();
  }

  getAllWishlist (pro_id: string) {
    return this.fb.collection('products').doc(pro_id).valueChanges();
  }

  deleteWishlist (pro_id: string, user: Users,) {
    return this.fb.collection('users_collection').doc(user.user_email).collection('wishlist').doc(pro_id).delete();
  }
}
