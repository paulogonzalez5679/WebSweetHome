import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    public fb: AngularFirestore
  ) { }
  
  /**
   * *** Retorna todas las ordenes/pedidos realizadas por los clientes ***
   */
  getOrders () {
    // return this.fb.collection('orders').valueChanges();
    return this.fb.collection('orders', ref => ref.orderBy("order_date","desc")).valueChanges();
  }

  /**
   * *** Retorna todas las ordenes/pedidos realizadas por los clientes ***
   */
  getOrdersByUser (infoUser: Users) {
    return this.fb.collection('orders', ref => ref.where('order_user_email', '==', infoUser.user_email)).valueChanges();
  }

  /**
   * *** Metodo para cambiar el estado del pedido segun se el caso ***
   * *** Aceptado/enviado ***
   * @param order 
   * @param step 
   */
  setState (order: Orders, step: string) {
    return this.fb.collection('orders').doc(order.order_transaccion_id).update({
      [step]: true,
    });
  }

  /**
   * *** Enviamos un emeil al usuario cuando SH acepta el pedido ***
   * @param order 
   * @param step 
   */
  sendEmailAceptOrder (order: Orders, step: string) {
    order[step] = true;
    console.log(order);
    return this.fb.collection('emails').doc('acept_order').collection('orders').doc(order.order_transaccion_id).set(
      order
    );
  }


  /**
   * *** Enviamos un emeil al usuario cuando SH envia el pedido ***
   * @param order 
   * @param step 
   */
  sendEmailSendOrder (order: Orders, step: string) {
    order[step] = true;
    console.log(order);
    return this.fb.collection('emails').doc('send_order').collection('orders').doc(order.order_transaccion_id).set(
      order
    );
  }



  /**
   * *** Enviamos un emeil al usuario cuando SH acepta el pedido ***
   * @param order 
   * @param step 
   */
  sendEmailNewOrder (order: Orders) {
    return this.fb.collection('emails').doc('new_order').collection('orders').doc(order.order_transaccion_id).set(
      order
    );
  }
}
