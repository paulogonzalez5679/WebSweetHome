import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  AfterContentInit,
} from "@angular/core";
import { UsersService } from "app/services/users/users.service";
import { AuthService } from "app/services/auth/auth/auth.service";
import { Router } from "@angular/router";

declare var $: any;
//Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  // icon: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

export const ROUTES: RouteInfo[] = [
  {
    path: "/index",
    title: "Inicio",
    type: "link",
    icontype: "pe-7s-home",
  },
  {
    path: "/pages/list-prod",
    title: "Productos",
    type: "link",
    icontype: "pe-7s-box2",
  },
  
];

export const ROUTESADMIN: RouteInfo[] = [
  {
    path: "/orders",
    title: "Pedidos",
    type: "link",
    icontype: "pe-7s-box2",
  },
  {
    path: "/products",
    title: "Mis productos",
    type: "link",
    icontype: "pe-7s-box2",
  },
  {
    path: "/home",
    title: "Subcategorias",
    type: "link",
    icontype: "pe-7s-plugin",
  },
  {
    path: "/message",
    title: "Mensajes",
    type: "link",
    icontype: "pe-7s-mail",
  },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public infoUser: Users;
  public user: Users;

  constructor(
    private usersService: UsersService,
    private authSvc: AuthService,
    private router: Router
  ) {}

  isNotMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  ngOnInit(): void {
    var $sidebar = $(".sidebar-wrapper");
    var $bgLogo = $(".bgLogo");
    $sidebar.css("background-color", "#000000");
    $bgLogo.css("background-color", "#000000");

    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));
    this.user = {};
    this.getUsers();

    if (this.infoUser.user_type == 0) {
      this.user = {
        user_email: this.infoUser.user_email,
        user_name: this.infoUser.user_name,
        user_lastname: this.infoUser.user_lastname,
        user_product: this.infoUser.user_product,
      };
    } else {
      // this.disabled =  true;
      this.getUsers();
    }
    if (this.infoUser.user_type == 1) {
      this.menuItems = ROUTESADMIN.filter((menuItem) => menuItem);
    } else {
      this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }

    var isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;
    // this.menuItems = ROUTES.filter(menuItem => menuItem);

    isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;
    var $sidebar = $(".sidebar");
    $sidebar.css("background-color", "green");

    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar();
      $("html").addClass("perfect-scrollbar-on");
    } else {
      $("html").addClass("perfect-scrollbar-off");
    }
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

  ngAfterViewInit() {
    var $sidebarParent = $(".sidebar .nav > li.active .collapse li.active > a")
      .parent()
      .parent()
      .parent();
    var collapseId = $sidebarParent.siblings("a").attr("href");
    $(collapseId).collapse("show");
  }

  async logout() {
    await this.authSvc.logout();
    this.router.navigate([""]);
  }
}
