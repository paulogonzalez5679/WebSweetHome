import { Component, Input, OnInit } from "@angular/core";
import { OrdersService } from "app/services/orders/orders.service";
import { WishlistService } from "app/services/wishlist/wishlist.service";
import { take } from "rxjs/operators";
import { IndexComponent } from "../index.component";

@Component({
  selector: "app-list-wishlist",
  templateUrl: "./list-wishlist.component.html",
  styleUrls: ["./list-wishlist.component.css"],
})
export class ListWishlistComponent implements OnInit {
  @Input() arrayWishlist: string[];
  public arrayAllWishlist: Product[];
  public arrayOrders: Orders[];
  public order: Orders;
  public infoUser: Users;
  public show: number = 1;
  public precioTotal = 0;

  constructor(
    private wishlistService: WishlistService,
    public indexComponent: IndexComponent,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.arrayOrders = [];
    this.order = {};
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.getWishlist();
    this.getOrders();
  }

  /**
   * *** Detectamos cambios en el componente para actualizar la lista de wislist ***
   * @param changes
   */
  ngOnChange(changes) {
    this.getWishlist();
  }

  /**
   * *** Selecionamos una orden para ver los detalles ***
   * @param order
   */
  public selectOrder(order: Orders) {
    this.order = order;
    this.recalcular();
  }

  /**
   * *** Calculamos totales de la orden ***
   */
  recalcular() {
    this.precioTotal = 0;
    this.order.arrayProductCart.forEach((element) => {
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
   * *** Obtenemos todos los wishlist del usuario logueado ***
   */
  getWishlist() {
    this.arrayAllWishlist = [];
    this.arrayWishlist.forEach((pro_id) => {
      this.wishlistService
        .getAllWishlist(pro_id["pro_id"])
        .pipe(take(1))
        .subscribe((product) => {
          this.arrayAllWishlist.push(product);
        });
    });
  }

  /**
   * *** Obtenemos todas los ordenes del usuario logueado ***
   */
  getOrders() {
    this.arrayOrders = [];
    this.ordersService
      .getOrdersByUser(this.indexComponent.infoUser)
      .subscribe((order) => {
        this.arrayOrders = order;
      });
  }

  /**
   * *** Funcion para eliminar un wishlist ***
   * @param pro_id 
   */
  async deleteWishlist(pro_id: string) {
    await this.wishlistService.deleteWishlist(
      pro_id,
      this.indexComponent.infoUser
    );
    this.getWishlist();
  }

  /**
   * *** Seteamos la variable show para mostrar wislist o pedidos ***
   * show = 1 = ver wishlist / show = 2 = ver ordenes
   * @param opt 
   */
  showSection(opt) {
    this.show = opt;
  }
}
