import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { IndexComponent } from "../index.component";
declare var $: any;

@Component({
  selector: "app-carrito",
  templateUrl: "./carrito.component.html",
  styleUrls: ["./carrito.component.css"],
})
export class CarritoComponent implements OnInit {
  @Input() arrayProductCart: Product[];
  @Input() producto: Product;
  public payment: Payment;
  public cantidadTotal = 0;
  public precioTotal = 0;
  constructor(
    private router: Router,
    public indexComponent: IndexComponent
  ) {}

  ngOnInit(): void {
    this.payment = {
      payment_cvv: "234",
      payment_name: "JISBELY MALDONADO",
      payment_year: "22",
      payment_month: "06",
      payment_number_card: "4381085400426948",
      payment_identification: "1758685315",
      payment_phone: "0987654321",
      payment_email: "jisbelys@gmail.com",
    };
    this.recalcular();
    this.scrollTop();
  }

  /**
   * *** Abrimos el modal para iniciar el pago o para iniciar sesion ***
   * *** dependiendo si hay o no usuario logueado ***
   */
  initPayment() {
    if (this.indexComponent.infoUser) {
      // *** descomentar para realiazr pago con tarjea ***
      // $("#modalPayment").modal("show");
      $("#modalPaymentSendNotify").modal("show");
    } else {
      $("#modalLogin").modal("show");
    }
  }

  /**
   * *** funcion para hacer scroll al elemento con el id '#init' ***
   */
  scrollTop() {
    $("html, body").animate(
      {
        scrollTop: $("#init").offset().top,
      },
      400,
      function () {}
    );
  }

  /**
   * *** Funcion qu recalcula totales ***
   * *** Activmos esta funcion cada vez que se hace un cambio en la cantidad ***
   * *** se agrega o elimina productos ***
   */
  recalcular() {
    this.cantidadTotal = 0;
    this.precioTotal = 0;
    this.arrayProductCart.forEach((element) => {
      this.cantidadTotal += element.pro_pro_cantidadCarrito;
      if (element.pro_estado_descuento) {
        this.precioTotal =
          this.precioTotal +
          (element.pro_precio -
            (element.pro_discount_percentage * element.pro_precio) / 100) *
            element.pro_pro_cantidadCarrito;
      } else {
        this.precioTotal =
          this.precioTotal +
          element.pro_pro_cantidadCarrito * element.pro_precio;
      }
    });
  }

  /**
   * *** Detectamos cambio en la cantodad para recalcular totales ***
   * @param e 
   */
  onChangeCantidad(e) {
    this.recalcular();
  }

  /**
   * *** Seteamos el valor de showCart a false para ocultar el carrito ***
   */
  setState() {
    this.indexComponent.showCart = !this.indexComponent.showCart;
    window.scroll(0, 0);
  }

  /**
   * *** Eliminamos un producto del carrito ***
   * @param producto 
   */
  deleteProductCart(producto) {
    swal({
      title: "¿Estás seguro que quieres eliminar el producto?",
      text: "El producto se borrará permanentemente",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.arrayProductCart.splice(producto, 1);
        localStorage.setItem("arrayProductCartCache", JSON.stringify(this.arrayProductCart));

        this.recalcular();

        swal("Ok", "Producto Eliminado", "success");
        if (this.arrayProductCart.length == 0) {
          this.router.navigate(["/"]);
          window.scroll(0, 0);
        }
      } else {
        swal("Cancelado", "Producto NO eliminado", "error");
      }
    });
  }

  valorcero(producto: Product) {
    if (producto.pro_pro_cantidadCarrito == 0) {
      producto.pro_pro_cantidadCarrito = 1;
      swal("ERROR", "La cantiad del producto no puede ser cero", "error");
    }
  }
}
