import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Directive,
  Input,
} from "@angular/core";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { ProductService } from "../services/product/product.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { CategoryService } from "app/services/categorias/categorias.service";
import { UsersService } from "app/services/users/users.service";
import { AuthService } from "app/services/auth/auth/auth.service";
import { HostListener } from "@angular/core";
import { ListProductComponent } from "./list-product/list-product.component";
import { WishlistService } from "app/services/wishlist/wishlist.service";
import { take } from "rxjs/operators";
import { MessageService } from "app/services/message/message.service";
import { DatesService } from "app/services/dates/dates.service";
import { Form, NgForm } from "@angular/forms";

declare var $: any;

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {
  public infoUser: Users;
  public user: Users;
  @ViewChild("modalLogin") modalLogin: ElementRef;
  @HostListener("window:popstate", ["$event"])
  test: Date = new Date();
  public imgSrc1: string = "../../assets/img/salas.svg";
  public imgSrc2: string = "../../assets/img/comedores.svg";
  public imgSrc3: string = "../../assets/img/dormitorios.svg";
  public imgSrc4: string = "../../assets/img/decoracion.svg";
  public imgSrc5: string = "../../assets/img/escritorios.svg";
  public imgSrc6: string = "../../assets/img/exteriores.svg";
  public imgSrc7: string = "../../assets/img/alfombras.svg";
  public imgSrc8: string = "../../assets/img/iluminacion.svg";
  public imgSrc9: string = "../../assets/img/bar.svg";
  public imgSrc10: string = "../../assets/img/ninos.svg";
  public arrayProduct: Product[];
  public arrayProductCart: Product[];
  public arrayProductCartCache: Product[];
  public arrayProductAux: Product[];
  productos: Observable<any[]>;
  public showAllProducts = false;
  public showCategory = "";
  public showCart = false;
  public showWishlist = false;
  public show = 1;
  public show2 = 1;
  public show3 = 1;
  public show4 = 1;

  public category = "all";
  
  public categories: Category;
  public subcategory = "all";
  public campoDB = "all";
  public arrayCategory: any[];
  public arraySubCategory: any[];
  public arraySubCategoryAux: Category[];
  public precio: number;
  public cantidad: number;
  public product: Product;
  public searchText = "";
  public arrayWishlist: any[];
  public message: Message;
  public index: number;
  public respuestaCategory: any;

  constructor(
    private router: Router,
    private element: ElementRef,
    private ProductService: ProductService,
    private wishlistServices: WishlistService,
    private categoryService: CategoryService,
    private usersService: UsersService,
    private authService: AuthService,
    private messageService: MessageService,
    private datesService: DatesService
  ) {}

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.arrayProductCartCache = JSON.parse(localStorage.getItem("arrayProductCartCache"));
    console.log(this.arrayProductCartCache);
    if (this.arrayProductCartCache) {
      this.arrayProductCart = this.arrayProductCartCache;
    } else {
      this.arrayProductCart = [];
    }

    this.user = {};
    this.product = {};
    this.message = {
      message_city: "",
    };

    this.getProducts();
    this.arrayWishlist = [];
    this.getSubcategories();
    this.arraySubCategory = [];

    if (this.infoUser) {
      if (this.infoUser.user_type == 0) {
        this.getWishlist();
        this.user = {
          user_email: this.infoUser.user_email,
          user_name: this.infoUser.user_name,
          user_lastname: this.infoUser.user_lastname,
          user_product: this.infoUser.user_product,
        };
      } else {
        this.getUsers();
      }
    }

    $(".fixed-plugin a").click(function (event) {
      // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
      if ($(this).hasClass("switch-trigger")) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (window.event) {
          window.event.cancelBubble = true;
        }
      }
    });
  }

  /**
   * *** Mostramos el carrito y ocultamos las demas opciones ***
   * *** Ocultamos productos index y wishlist ***
   */
  public viewCart() {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    if (this.infoUser) {
      this.showCart = !this.showCart;
      this.showWishlist = false;
      this.showAllProducts = false;
    } else {
      $("#modalLogin").modal("show");
    }
  }

  /**
   * *** Mostramos wishlist y ocultamos las demas opciones ***
   * *** Ocultamos productos index y carrito ***
   */
  public viewWishlist() {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    
    if (this.infoUser) {
      if (this.arrayWishlist.length==0) {
        this.getWishlist();
      }
      this.showWishlist = !this.showWishlist;
      this.showCart = false;
      this.showAllProducts = false;
      this.scrollTop();
    } else {
      $("#modalLogin").modal("show");
    }
  }

  /**
   * *** navegacion ***
   */
  public viewRouter(opt: string, time: number) {
    var body = document.getElementsByTagName("body")[0];
    // this.toggleButton.classList.remove("toggled");
    // this.sidebarVisible = false;
    body.classList.remove("nav-open");
    setTimeout(function () {
      $("html, body").animate(
        {
          scrollTop: $(opt).position().top,
        },
        time,
        function () {}
      );
    }, 500);
  }

  /**
   * *** Optenemos todos los wishlist del usuario logueado ***
   */
  getWishlist() {
    this.wishlistServices.getWishlist(this.infoUser).subscribe((wishlist) => {
      this.arrayWishlist = [];
      this.arrayWishlist = wishlist;
    });
  }

  /**
   * *** obtenemos la data del usuario ***
   */
  async getUsers() {
    (
      await this.usersService.getUserByEmails(this.infoUser.user_email)
    ).subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * *** obtenemos las categorias ***
   */
  getSubcategories() {
    this.respuestaCategory = this.categoryService.getCategories();

    
    this.respuestaCategory.subscribe((categorys) => {
      var cont = 0;
      this.arrayCategory = [];
      console.log(this.arrayCategory);
      
      categorys.forEach((categoryData: any) => {
        this.arrayCategory.push(categoryData.payload.doc.data());
        var responseCity = this.categoryService.getSubCategory(
          categoryData.payload.doc.id
        );
        let contAux = cont;
        responseCity.subscribe((c) => {
          this.arraySubCategoryAux = [];
          c.forEach((cData) => {
            this.arraySubCategoryAux.push(cData.payload.doc.data());
          });
          this.arraySubCategory[contAux] = this.arraySubCategoryAux;
        });
        cont++;
      });
    });
  }

  tests(id) {
    if (id == "icoServ1") {
      return (this.imgSrc1 = "../../assets/img/salas_blanco.svg");
    } else if (id == "icoServ2") {
      return (this.imgSrc2 = "../../assets/img/comedores_blanco.svg");
    } else if (id == "icoServ3") {
      return (this.imgSrc3 = "../../assets/img/dormitorios_blanco.svg");
    } else if (id == "icoServ4") {
      return (this.imgSrc4 = "../../assets/img/decoracion_blanco.svg");
    } else if (id == "icoServ5") {
      return (this.imgSrc5 = "../../assets/img/escritorios_blanco.svg");
    } else if (id == "icoServ6") {
      return (this.imgSrc6 = "../../assets/img/exteriores_blanco.svg");
    } else if (id == "icoServ7") {
      return (this.imgSrc7 = "../../assets/img/alfombra_blanco.svg");
    } else if (id == "icoServ8") {
      return (this.imgSrc8 = "../../assets/img/iluminacion_blanco.svg");
    } else if (id == "icoServ9") {
      return (this.imgSrc9 = "../../assets/img/bar_blanco.svg");
    } else if (id == "icoServ10") {
      return (this.imgSrc10 = "../../assets/img/ninos_blanco.svg");
    }
  }

  tests2(id) {
    if (id == "icoServ1") {
      return (this.imgSrc1 = "../../assets/img/salas.svg");
    } else if (id == "icoServ2") {
      return (this.imgSrc2 = "../../assets/img/comedores.svg");
    } else if (id == "icoServ3") {
      return (this.imgSrc3 = "../../assets/img/dormitorios.svg");
    } else if (id == "icoServ4") {
      return (this.imgSrc4 = "../../assets/img/decoracion.svg");
    } else if (id == "icoServ5") {
      return (this.imgSrc5 = "../../assets/img/escritorios.svg");
    } else if (id == "icoServ6") {
      return (this.imgSrc6 = "../../assets/img/exteriores.svg");
    } else if (id == "icoServ7") {
      return (this.imgSrc7 = "../../assets/img/alfombras.svg");
    } else if (id == "icoServ8") {
      return (this.imgSrc8 = "../../assets/img/iluminacion.svg");
    } else if (id == "icoServ9") {
      return (this.imgSrc9 = "../../assets/img/bar.svg");
    } else if (id == "icoServ10") {
      return (this.imgSrc10 = "../../assets/img/ninos.svg");
    }
  }

  async getProducts() {
    await this.ProductService.getProducts("all", "all").subscribe(
      (productSnapshot) => {
        this.arrayProduct = [];
        this.arrayProductAux = [];
        productSnapshot.forEach((categoryData) => {
          this.arrayProduct.push(categoryData.payload.doc.data());
          this.arrayProductAux.push(categoryData.payload.doc.data());
        });
      }
    );
  }

  agregarCarrito(producto: Product) {
    if (this.arrayProductCart.includes(producto)) {
      let i = this.arrayProductCart.indexOf(producto);
      this.arrayProductCart[i].pro_pro_cantidadCarrito =
        this.arrayProductCart[i].pro_pro_cantidadCarrito + 1;
      swal(
        "OK",
        "Cantidad de " +
          producto.pro_nombre.toUpperCase() +
          " aumentada correctamente",
        "success"
      );
    } else {
      producto.pro_pro_cantidadCarrito = 1;
      this.arrayProductCart.push(producto);
      swal("OK", "Producto agreado correctamente", "success");
    }
    this.arrayProductCartCache = this.arrayProductCart;
    localStorage.setItem("arrayProductCartCache", JSON.stringify(this.arrayProductCartCache));

  }

  addWishList(product: Product) {
    if (this.infoUser) {
      this.wishlistServices.addWishlist(this.infoUser, product);
      swal("Ok", "Producto agregado a tu wishlist", "success");
    } else {
      $("#modalLogin").modal("show");
    }
  }

  viewDetails(product: Product) {
    this.product = product;
    $("#modalDetails").modal("show");
  }

  trackByFn(index, obj) {
    return obj.uid;
  }

  carrito(id: any) {
    this.router.navigate([`carrito`]);
  }

  cambioMasvendido(opt) {
    this.show = opt;
  }

  cambioMasvendido2(opt) {
    this.show2 = opt;
  }

  cambioMasvendido3(opt) {
    this.show3 = opt;
  }

  cambioMasvendido4(opt) {
    this.show4 = opt;
  }

  showAllProductComponent(
    category: string,
    subcategory: string,
    campoDB: string,
    index_category?: number
  ) {
    this.showAllProducts = true;
    this.showCart = false;
    this.showWishlist = false;
    this.subcategory = subcategory;
    this.category = category;
    this.campoDB = campoDB;
    this.showCategory = category;
    this.scrollTop();
    this.index=index_category;
  }
  showAllProductbySubcategory(
    category: string,
    subcategory: string,
    campoDB: string) {
    this.showAllProducts = true;
    this.showCart = false;
    this.showWishlist = false;
    this.subcategory = subcategory;
    this.category = category;
    this.campoDB = campoDB;
    this.showCategory = category;
    this.scrollTop();
    // this.index=index_category;
  }

  shorAlert() {
    swal("Atención", "Agrega tu primer producto al carrito", "info");
  }

  rutaproducts() {
    this.router.navigate(["/pages/list-prod"]);
    window.scroll(0, 0);
  }

  scrollTop() {
    $("html, body").animate(
      {
        scrollTop: $("#init").offset().top,
      },
      800,
      function () {}
    );
  }

  /**
   * *** Funcion para almacenar los mensajes del usuario ***
   * *** Se obtine la información del formulario de contacto ***
   * @param message
   * @param valid
   */
  onSaveMessage(message: Message, valid: boolean, form: NgForm) {
    message.message_date = this.datesService.getDateCurrent();
    message.message_id = new Date().getTime().toString();
    message.message_time = this.datesService.getTimeCurrent();
    message.message_state = false;
    if (valid) {
      this.messageService.createMessage(message).then(() => {
        swal("OK", "Mensaje enviado correctamente", "success");
        form.resetForm();
        this.message = {
          message_city: "",
        };
      });
    }
  }

  logout() {
    console.log('*** Cerrando sesion... ***');
    swal({
      title: "Cerrando Sesión...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      onOpen: () => {
        swal.showLoading();
      },
    });
    this.authService.logout();
  }
  setIndex() {
    this.showCart = false;
    this.showAllProducts = false;
    this.showCart = false;
    this.showWishlist = false;
  }
}
