import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Directive,
  Input,
  HostListener,
} from "@angular/core";
import { ROUTES } from "../.././sidebar/sidebar.component";
import { AuthService } from "app/services/auth/auth/auth.service";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { IndexComponent } from "../index.component";

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};
declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  // @ViewChild("xxx") xxx: ElementRef;

  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;

  @ViewChild("navbar-cmp") button;
  @Input() arrayCategory;
  @Input() arraySubCategory;
  afAuth: any;

  constructor(
    location: Location,
    private renderer: Renderer2,
    private element: ElementRef,
    private authSvc: AuthService,
    private router: Router,
    public indexComponent: IndexComponent
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    console.log('*** 1 ***');
    console.log(this.arrayCategory);
    console.log('*** 2 ***');
    console.log(this.arraySubCategory);
    


    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    if ($("body").hasClass("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }

    $("#minimizeSidebar").click(function () {
      var $btn = $(this);
      if (misc.sidebar_mini_active == true) {
        $("body").removeClass("sidebar-mini");
        misc.sidebar_mini_active = false;
      } else {
        setTimeout(function () {
          $("body").addClass("sidebar-mini");
          misc.sidebar_mini_active = true;
        }, 300);
      }

      var simulateWindowResize = setInterval(function () {
        window.dispatchEvent(new Event("resize"));
      }, 180);

      setTimeout(function () {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  }



  
  test(e,i:number) {
  
    // $('#menuCategory'+ i).hover(function(){
       $('#navbarDropdown'+i).trigger('click')
       console.log('hover');
    // }
    //)
  }
 ngAfterViewInit() {
  // $(this.xxx.nativeElement).on("show.bs.dropdown", function(event){
  //   console.log('*** Abriendo ***');
    
  // });
  // $(this.xxx.nativeElement).on("hide.bs.dropdown", function(event){
  //   console.log('*** Cerrando ***');
  // });
 }

  async logout() {
    await this.authSvc.logout();
    this.router.navigate([""]);
  }

  isMobileMenu() {
    if ($(window).width() < 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    this.sidebarVisible = true;
  }
  
  sidebarClose() {
    var body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }

  sidebarToggle() {
    if (this.sidebarVisible == false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    for (let i = 0; i < this.listTitles.length; i++) {
      if (
        this.listTitles[i].type === "link" &&
        this.listTitles[i].path === titlee
      ) {
        return this.listTitles[i].title;
      } else if (this.listTitles[i].type === "sub") {
        for (let j = 0; j < this.listTitles[i].children.length; j++) {
          let subtitle =
            this.listTitles[i].path + "/" + this.listTitles[i].children[j].path;
          if (subtitle === titlee) {
            return this.listTitles[i].children[j].title;
          }
        }
      }
    }
    return "Dashboard";
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }
}
