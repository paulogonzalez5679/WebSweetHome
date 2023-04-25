import { Component, Input, OnInit } from "@angular/core";
import { CategoryService } from "app/services/categorias/categorias.service";
import { ProductService } from "app/services/product/product.service";
import { IndexComponent } from "../index.component";

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"],
})
export class ListProductComponent implements OnInit {
  @Input() showCategory: string;
  @Input() category: string;
  @Input() subcategory: string;
  @Input() campoDB: string;
  @Input() arrayCategory: Category[];
  @Input() index: number;
  public arraySubCategory: any[];
  public arrayproduct: Product[];
  public arrayproductAux: Product[];
  public arraySubCategoryAux: Category[];

  constructor(
    private productService: ProductService,
    public indexComponent: IndexComponent,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.arrayproduct = [];
    this.getProducts();
    // this.getSubcategories();
    this.arraySubCategory = [];

  }

  getSubcategories() {
    var respuestaCategory = this.categoryService.getCategories();
    respuestaCategory.subscribe((categorys) => {
      var cont = 0;
      this.arrayCategory = [];
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
  

  /**
   * *** Detectamos cambios en el componente para actualizar la lista de productos ***
   * @param changes 
   */
  ngOnChanges(changes) {
    this.getProducts();
  }

  /**
   * *** Obtenemos todos los productos de la DB sin orden especifica ***
   */
  async getProducts() {
    if (this.subcategory == "") {
      await this.productService
        .getProducts(this.category, this.campoDB)
        .subscribe((prductSnapshot) => {
          this.arrayproduct = [];
          this.arrayproductAux = [];
          prductSnapshot.forEach((categoryData) => {
            this.arrayproduct.push(categoryData.payload.doc.data());
            this.arrayproductAux.push(categoryData.payload.doc.data());
            if (prductSnapshot.length == this.arrayproduct.length) {
              this.getFilter();
            }
          });
        });
    } else {
      await this.productService
        .getProductsBySubCategory(this.category, this.subcategory, this.campoDB)
        .subscribe((prductSnapshot) => {
          this.arrayproduct = [];
          this.arrayproductAux = [];
          prductSnapshot.forEach((categoryData) => {
            this.arrayproduct.push(categoryData.payload.doc.data());
            this.arrayproductAux.push(categoryData.payload.doc.data());
            if (prductSnapshot.length == this.arrayproduct.length) {
              this.getFilter();
            }
          });
        });
    }
  }

  /**
   * *** Obtenemos todos los productos de la DB filtrados por subcategoria ***
   */


  async getProductsBySelection(campoDB: string) {
    this.productService
      .getProducts(this.category, campoDB)
      .subscribe((prductSnapshot) => {
        this.arrayproduct = [];
        this.arrayproductAux = [];

        prductSnapshot.forEach((categoryData) => {
          this.arrayproduct.push(categoryData.payload.doc.data());
          this.arrayproductAux.push(categoryData.payload.doc.data());
          if (prductSnapshot.length == this.arrayproduct.length) {
            this.getFilter();
          }
        });
      });
  }

  /**
   * *** Buscador de productos ***
   */
  getFilter() {
    this.arrayproduct = [];
    this.arrayproductAux.forEach((element) => {
      if (
        element.pro_nombre
          .toUpperCase()
          .includes(this.indexComponent.searchText.toUpperCase()) || element.pro_description
          .toUpperCase()
          .includes(this.indexComponent.searchText.toUpperCase())
      ) {
        this.arrayproduct.push(element);
      }
    });
  }

  /**
   * *** Obtenemos todos los productos de la DB ordenados de forma ascendente ***
   */
  async getProductsAsc() {
    this.productService
      .getProductsAsc(this.category)
      .subscribe((prductSnapshot) => {
        this.arrayproduct = [];
        this.arrayproductAux = [];
        prductSnapshot.forEach((categoryData) => {
          this.arrayproduct.push(categoryData.payload.doc.data());
          this.arrayproductAux.push(categoryData.payload.doc.data());
        });
      });
  }

  /**
   * *** Obtenemos todos los productos de la DB ordenados de forma descendente ***
   */
  async getProductsDesc() {
    await this.productService
      .getProductsDes(this.category)
      .subscribe((prductSnapshot) => {
        this.arrayproduct = [];
        this.arrayproductAux = [];
        prductSnapshot.forEach((categoryData) => {
          this.arrayproduct.push(categoryData.payload.doc.data());
          this.arrayproductAux.push(categoryData.payload.doc.data());
        });
      });
  }

  /**
   * *** Seteamos a false showAllProducts para ocultar el carrito y volver al home  ***
   */
  homeNavigate() {
    this.indexComponent.showAllProducts = false;
  }
}
