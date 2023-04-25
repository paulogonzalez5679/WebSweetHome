import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'app/services/orders/orders.service';
import swal from 'sweetalert2';
import { DatesService } from '../../../services/dates/dates.service';
declare var $: any;
export interface DataTable {
  headerRow: string[];
  footerRow?: string[];
  dataRows: string[][];
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public dataTable: DataTable;
  public tablaDatos;
  public arrayproduct: Orders[];
  public order: Orders;
  public precioTotal = 0;

  constructor(
    private ordersService: OrdersService,
    private dateservice: DatesService
  ) { }

  ngOnInit(): void {
    this.order = {};
    this.dataTable = {
      headerRow: [
        "#",
        "#Orden",
        "Cliente",
        "Ciudad",
        // "Dirección",
        // "Referencia",
        // "Email",
        // "Teléfono",
        "Pecio",
        "Fecha",
        "Detalles",
        "Acciones",
      ],
      dataRows: [],
    };
    this.tablaDatos = $("#datatablesOrders").DataTable({});
    this.getOrders();
  }

  /**
   * *** Obtenemos todos los productos de la DB ***
   */
  async getOrders() {
    await this.ordersService.getOrders().subscribe((prductSnapshot) => {
      this.arrayproduct = [];
      prductSnapshot.forEach((categoryData) => {
        this.arrayproduct.push(categoryData);
        if (prductSnapshot.length == this.arrayproduct.length) {
          this.initDataTable();
        }
      });
    });
  }

  recalcular() {
    this.precioTotal = 0;
    this.order.arrayProductCart.forEach((element) => {
      if (element.pro_estado_descuento) {
        this.precioTotal =
          this.precioTotal +
          ((element.pro_precio -
          (element.pro_discount_percentage * element.pro_precio) / 100))*element.pro_pro_cantidadCarrito;
      } else {
        this.precioTotal =
          this.precioTotal +
          element.pro_pro_cantidadCarrito * element.pro_precio;
      }
    });
  }

  public selectOrder (order: Orders) {
    this.order = order;
    this.recalcular();
  }

  public setState (order: Orders, step: string) {
    var message = '';
    this.ordersService.setState(this.order, step);
    if (step == 'order_state_two') {
      this.order.order_time_accepted= this.dateservice.getTimeCurrent();
      this.ordersService.sendEmailAceptOrder(this.order, step);
    }
    if (step == 'order_state_three') {
      this.order.order_time_accepted= this.dateservice.getTimeCurrent();
      this.ordersService.sendEmailSendOrder(this.order, step);
    }
    
    step == 'order_state_two' ? message = 'aceptado' : message = 'enviado'
    $('#modalDetails').modal('hide');
    swal('Ok', 'Pedido Nro. #' + this.order.order_transaccion_id.substring(8) + ' ' + message + ' correctamente', 'success');
  }


  initDataTable() {
    let aaa = this.tablaDatos;
    $("#datatablesOrders").DataTable().destroy();
    setTimeout(function () {
      /*
       * Opciones del datatable
       */
      aaa = $("#datatablesOrders").DataTable({
        paging: true,
        retrieve: true,
        ordering: true,
     
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        responsive: false,
        language: {
          search: "",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }

}
