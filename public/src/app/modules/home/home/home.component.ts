import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { CategoryService } from '../../../services/categorias/categorias.service';
import { CompanyService } from '../../../services/company/company.service';
import * as  firebase from 'firebase/app'
import { ProductService } from '../../../services/product/product.service';

/*se inicializa la tabla*/
declare var $: any;
export interface DataTable {
  headerRow: string[];
  footerRow?: string[];
  dataRows: string[][];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public dataTable: DataTable;
  public category: Category;
  public subCategory: SubCategory;
  public arrayCategory: any[];
  public arraySubCategory: any[];
  public arraySubCategoryAux: Category[];
  public documentId = null;
  public isEdit = false;
  public tablaDatos;
  public disabled: boolean = false;
  public stateSw = false;
  public cont = 0;
  public index: number;

  constructor(
    private categoryService: CategoryService, private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.subCategory = {}
    this.dataTable = {
      headerRow: [
        "#",
        "Categorías",
        "SubCategorías",
        "Crear/Editar",
      ],
      dataRows: [],
    };
    this.tablaDatos = $("#datatablesSubCategories").DataTable({});
    this.getSubcategories();
    this.arraySubCategory = [];
    this.category={}
  }

  initDataTable() {
    let aaa = this.tablaDatos;
    $("#datatablesProduct").DataTable().destroy();
    setTimeout(function () {
      /*
       * Opciones del datatable
       */
      aaa = $("#datatablesProduct").DataTable({
        paging: true,
        ordering: true,
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        responsive: true,
        language: {
          search: "",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }
  
  stateVisible(e){
   console.log(e.currentValue);
   
   this.productService.updateCategories("Navidad", e.currentValue);
   
    
  }


  newSubCategory() {
    this.cont;
    this.isEdit = false;
    var id = new Date().getTime();
    this.subCategory = {
      subcat_id: id.toString(),
      subcat_nombre: "",
      sub_cat_categoria: "",
    };
  }
   /**
   * *** seleccionamos y seteamos la data de la subcategoria  ***
   * @param subcat
   */
  async editSubcat(subcat: SubCategory) {
    this.subCategory = subcat;
    this.isEdit = true;
  }

   /**
   * *** Eliminamos la subcategoria ***
   * @param subcat
   */
  async deleteSubcat(subcat: SubCategory) {
    this.subCategory = subcat;
    swal({
      title: "Alerta",
      text: "¿Está seguro que desea eliminar esta subcategoria?",
      type: "warning",
      showCancelButton: true,
      confirmButtonClass: "btn btn-fill btn-success btn-mr-5",
      cancelButtonClass: "btn btn-fill btn-danger",
      confirmButtonText: "Sí, eliminar!",
      buttonsStyling: false,
    }).then((result) => {
      if (result.value) {
        this.categoryService.deleteSubCategory( this.category, this.subCategory);
        this.cleanSubcat();
      }
    });
  }
  /**
   * *** Metodo para limpiar la data de la ciudad seleccionada ***
   */
  cleanSubcat() {
    this.isEdit = false;
    this.subCategory = {};
  }

  
  /**
   * para agregar Subcategorias
   * @param subcategoria
   * @param valid
   */
  addSubcategory(subcategoria: SubCategory, valid: boolean) {

    if (valid) {
      this.categoryService.createSubCategory(subcategoria, this.category).then(() => {
        var id = new Date().getTime();
        this.subCategory = {
          subcat_id: id.toString(),
          subcat_nombre: "",
          sub_cat_categoria: "",
        };
      });
    }
  }

    /**
   * *** Obtenemos todas las Subcategorias de la DB ***
   */


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




  async getSubcategoriess() {
    this.arraySubCategory = [];
    var i = 0;
   await this.arrayCategory.forEach(async categoria => {
    var aux = [];
     await this.categoryService.getSubCategory(categoria.id_category).subscribe(async (prductSnapshot) => {
      await prductSnapshot.forEach((SubcategoryData) => {
        aux.push(SubcategoryData.payload.doc.data());
      });
      // this.arraySubCategory[i] = aux;
    });
    i++;
   });
  }

  async getCategory() {
    await this.productService.getCategories().subscribe((categorySnapshot) => {
      this.arrayCategory = [];
      categorySnapshot.forEach((categoryData) => {
        this.arrayCategory.push(categoryData.payload.doc.data());
        if (categorySnapshot.length == this.arrayCategory.length) {
        }
      });
    });
  }

  selectCategories(e) {
    this.category = this.arrayCategory[e.target.value];
    this.getSubcategories();
    
    
  }

   /**
   * *** Seleccionamos una categoria para la edicion ***
   * @param category
   */
  selectCategory(category: Category, index: number) {
    this.isEdit = true;
    this.category = category;
    this.index=index;
    this.cont;
    this.isEdit = false;
    var id = new Date().getTime();
    this.subCategory = {
      subcat_id: id.toString(),
      subcat_nombre: "",
      sub_cat_categoria: "",
    };


  }

  



}
