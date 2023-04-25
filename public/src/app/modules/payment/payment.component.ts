import { Component, Input, OnInit } from "@angular/core";
import { PayphoneService } from "app/services/payphone/payphone.service";
import * as CryptoJS from "crypto-js";
import { PaymentService } from "app/services/payment/payment.service";
import { IndexComponent } from "app/index/index.component";
import { DatesService } from "app/services/dates/dates.service";
import swal from "sweetalert2";
import { OrdersService } from "app/services/orders/orders.service";
declare var $: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  @Input() precioTotal;
  public payment: Payment;
  public data_user: any;
  public months = [
    { nummonth: "01" },
    { nummonth: "02" },
    { nummonth: "03" },
    { nummonth: "04" },
    { nummonth: "05" },
    { nummonth: "06" },
    { nummonth: "07" },
    { nummonth: "08" },
    { nummonth: "09" },
    { nummonth: "10" },
    { nummonth: "11" },
    { nummonth: "12" },
  ];
  public years = new Array();

  constructor(
    private servicepayphone: PayphoneService,
    private paymentService: PaymentService,
    public indexComponent: IndexComponent,
    private datesService: DatesService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.payment = {};
    this.data_user = JSON.parse(sessionStorage.getItem("user"));
    this.get_data_select_year();
    // this.payment = {
    //   payment_cvv: "123",
    //   payment_name: "TEST USER",
    //   payment_year: "2022",
    //   payment_month: "06",
    //   payment_number_card: "0000-0000-0000-0000",
    //   payment_identification: "9999999999",
    //   payment_phone: "593988272222",
    //   payment_email: this.indexComponent.infoUser.user_email,
    //   payment_address: "Cuenca",
    // };
    this.payment = {
      payment_cvv: "",
      payment_year: "",
      payment_month: "",
      payment_number_card: "",
      payment_identification: "",
      payment_address: "",
      payment_phone: "",
      payment_reference:"",
      payment_email: this.indexComponent.infoUser.user_email,
      payment_name:
        this.indexComponent.infoUser.user_name +
        " " +
        this.indexComponent.infoUser.user_lastname,
    };
  }

  /**
   * *** Iniciamos el pago ***
   * *** llenamos y encriptamos la data para el envio a payphone ***
   * *** almacenamos la orden y la respuesta de payphone ***
   */
  paymentInit(model, valid) {
    var transaccion_id = new Date().getTime();

    /// *** Data de la tarjeta de credito ***
    var data_card = {
      cardNumber: this.get_number_card(),
      expirationMonth: this.payment.payment_month,
      expirationYear: this.payment.payment_year,
      holderName: this.payment.payment_name,
      securityCode: this.payment.payment_cvv,
    };

    /// *** Data del usuario usada ademas para generar la orden ***
    var data_user = {
      order_user_name: this.payment.payment_name,
      order_user_phone: this.payment.payment_phone,
      order_user_address: this.payment.payment_address,
      order_user_city: this.payment.payment_city,
      order_user_email: this.indexComponent.infoUser.user_email,
      order_user_document: this.payment.payment_identification,
      order_transaccion_id: transaccion_id.toString(),
      order_state_one: true,
      order_state_two: false,
      order_state_three: false,
      order_total: this.precioTotal,
      order_date: this.datesService.getDateCurrent(),
      order_time: this.datesService.getTimeCurrent(),
      order_reference: this.payment.payment_reference
    };

    /// *** preparamos la data para envio a PP ***
    var key = CryptoJS.enc.Utf8.parse("bb786f7984034068b4aa0913613f8d90");
    var iv = CryptoJS.enc.Utf8.parse("");
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data_card), key, {
      iv: iv,
    });
    var codificado = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

    /// *** Data que se envia a PP ***
    var data_send = {
      data: codificado,
      email: this.payment.payment_email,
      phoneNumber: this.payment.payment_phone,
      documentId: this.payment.payment_identification,
      amount: 0 * 100,
      amountWithTax: 0 * 100,
      amountWithoutTax: 0,
      tax: 0 * 100,
      service: 0,
      tip: 0,
      clientTransactionId: transaccion_id,
      deferredType: "",
    };

    /// *** Consumimos los servicios de PP ***
    this.servicepayphone
      .send_payment_payphone(JSON.stringify(data_send))
      .subscribe(
        (response) => {
          if (response["statusCode"] == 3) {
            this.paymentService.saveDataPayment(
              this.indexComponent.infoUser,
              data_user,
              this.indexComponent.arrayProductCart,
              response
            );
          } else {
          }
        },
        (error) => {
          this.paymentService.saveDataPayment(
            this.indexComponent.infoUser,
            data_user,
            this.indexComponent.arrayProductCart,
            error.error
          );
        }
      );

    /// *** guardamos la orden, esto hay que moverlo dentro de la respuesta del pago ***
    this.paymentService.saveSaveOrden(
      this.indexComponent.infoUser,
      data_user,
      this.indexComponent.arrayProductCart
    );

    $("#modalPayment").modal("hide");
    swal("Muchas gracias.", "Tu compra fue generada correctamente", "success");
    this.indexComponent.arrayProductCart = [];
    this.indexComponent.showCart = false;
  }

  /**
   * *** Metodo para optener el nimero de la tarjeta sin guiones ***
   */
  get_number_card(): string {
    var resultado = "";
    var number_card = "";
    number_card = this.payment.payment_number_card;
    var array = number_card.split("-");
    for (let i = 0; i < array.length; i++) {
      resultado = resultado.concat(array[i]);
    }
    return resultado;
  }

  /**
   * *** Llenamos el select de años ***
   */
  get_data_select_year() {
    var current_year = new Date().getFullYear() - 1;
    for (let i = 0; i < 10; i++) {
      current_year += 1;
      var data = { year: current_year };
      this.years.push(data);
    }
  }

  /**
   * *** Solo numeros ***
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /**
   * *** Solo caracteres ***
   */
  characteronly(event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode > 96 && charCode < 123) ||
      (charCode > 64 && charCode < 91) ||
      charCode === 32
    ) {
      return true;
    }
    return false;
  }

  /**
   * *** Método para agregar guion cada 4 caracteres al numero de la tarjeta ***
   * @param event
   */
  masksecuencial(event) {
    const charCode = event.which ? event.which : event.keyCode;
    var value_number_card = event.target.value;
    if (
      value_number_card.length == 4 ||
      value_number_card.length == 9 ||
      value_number_card.length == 14
    ) {
      if (charCode != 8) {
        this.payment.payment_number_card = this.payment.payment_number_card.concat(
          "-"
        );
      }
    }
  }

  sendEmailNewOrden(model, valid) {
    /// *** Data del usuario usada ademas para generar la orden ***
    if (valid) {
      var transaccion_id = new Date().getTime();

      var data_user = {
        order_user_name: this.payment.payment_name,
        order_user_phone: this.payment.payment_phone,
        order_user_address: this.payment.payment_address,
        order_user_city: this.payment.payment_city,
        order_user_email: this.indexComponent.infoUser.user_email,
        order_user_document: this.payment.payment_identification,
        order_transaccion_id: transaccion_id.toString(),
        order_state_one: true,
        order_state_two: false,
        order_state_three: false,
        order_total: this.precioTotal,
        order_date: this.datesService.getDateCurrent(),
        order_time: this.datesService.getTimeCurrent(),
        order_reference: this.payment.payment_reference,
        arrayProductCart: this.indexComponent.arrayProductCart,
      };

      console.log(
        this.indexComponent.infoUser,
        data_user,
        this.indexComponent.arrayProductCart
      );

      /// *** guardamos la orden, esto hay que moverlo dentro de la respuesta del pago ***
      this.paymentService.saveSaveOrden(
        this.indexComponent.infoUser,
        data_user,
        this.indexComponent.arrayProductCart
      );
      this.ordersService.sendEmailNewOrder(data_user);

      $("#modalPaymentSendNotify").modal("hide");
      this.indexComponent.arrayProductCart = [];
      this.indexComponent.showCart = false;
      localStorage.removeItem("arrayProductCartCache");
      
      swal({
        title: "Ok",
        text:
          "Tu orden de compra fue generada correctamente, se envió un correo electrónico a Sweet Home, desea enviar una notificación por Whatsapp?",
        type: "success",
        showCancelButton: true,
        confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
        cancelButtonClass: "btn btn-fill btn-danger",
        confirmButtonText: "Sí, enviar!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          var url =
            "https://api.whatsapp.com/send?phone=593997944069&text=Saludos, mi nombre es: " +
            this.payment.payment_name +
            ", %20acabo%20de%20generar%20la%20orden%20de%20compra%20Nro. " +
            transaccion_id +
            " en Sweet Home Ecuador";
          window.open(url, "_blank");
        }
      });

      // this.fb.collection('emails').doc(this.order.order_transaccion_id).set(
      //   order
      // );
    }
  }
}
