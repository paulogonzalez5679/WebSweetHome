import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { User } from "firebase";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private db: AngularFirestore) {}

  saveSaveOrden (infoUser: Users,
    data_user: any,
    arrayProductCart: Product[]) {
      this.db
      .collection("orders")
      .doc(data_user.order_transaccion_id.toString())
      .set(
         data_user,
      );
      return this.db
      .collection("orders")
      .doc(data_user.order_transaccion_id.toString())
      .update({
        arrayProductCart: arrayProductCart,
      });
  }


  saveDataPayment(
    infoUser: Users,
    data_user: Orders,
    arrayProductCart: Product[],
    response
  ) {
    this.db
      .collection("users_collection")
      .doc(infoUser.user_email)
      .collection("payments")
      .doc(data_user.order_transaccion_id.toString())
      .set(data_user);

    return this.db
      .collection("users_collection")
      .doc(infoUser.user_email)
      .collection("payments")
      .doc(data_user.order_transaccion_id.toString())
      .update({
        arrayProductCart: arrayProductCart,
        response: response,
      });
  }

  save_data_config_account_user(emailuser: string, data: any) {
    return this.db
      .collection("users")
      .doc(emailuser)
      .collection("account_private")
      .doc("config")
      .set(data);
  }

  update_flag_show_plan(emailuser: string) {
    return this.db
      .collection("users")
      .doc(emailuser)
      .update({ user_show_plans: false });
  }
}
