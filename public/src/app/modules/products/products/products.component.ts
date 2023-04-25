import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import * as firebase from "firebase/app";
import { ProductService } from "../../../services/product/product.service";
import { take } from "rxjs/operators";


declare var $: any;
export interface DataTable {
  headerRow: string[];
  footerRow?: string[];
  dataRows: string[][];
}
@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  public dataTable: DataTable;
  public product: Product;
  public subCategory: SubCategory;
  public category: Category;
  public arrayproduct: Product[];
  public arrayCategory: Category[];
  public arraySubcategory: SubCategory[];
  public documentId = null;
  public isEdit = false;
  public tablaDatos;
  public imageFile: any;
  public imageSrc: any;
  public imageSrc2: any;
  public disabled: boolean = false;
  public cont = 0;
  public cont2 = 0;
  public stateSw = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.category ={}
    this.product = {};
    this.dataTable = {
      headerRow: [
        "#",
        "ID",
        "ID Interno",
        "Nombre",
        "Categoría",
        "Descripción",
        "Stock",
        "Precio",
        "Imagen",
        "Editar",
        "Eliminar",
      ],
      dataRows: [],
    };
    this.tablaDatos = $("#datatablesProduct").DataTable({});
    this.getProducts();
    this.getCategory();
  }

  onChange (e) {}

  /**
   * EVENTO CARGA DE IMAGEN.
   * @param event.
   */
  public onChangeImage(event, v: number) {
    swal({
      title: "Cargando imágen...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      onOpen: () => {
        swal.showLoading();
      },
    });
    const files = event.srcElement.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if(v==1)
        {
          this.imageSrc = e.target.result;
        }
        else if(v==2){
          this.imageSrc2 = e.target.result;
        }
        
      };
      reader.readAsDataURL(files[0]);
    }
    this.upload(event,v);
  }

  /**
   * *** Recibimos el archivo y lo enviamos a subir al storage ***
   * @param event
   */
  public upload(event, v: number): void {
    const file = event.target.files[0];
    this.imageFile = file;
    this.uploadDocumentToStorage(v);
  }

  /**
   * Optenemos el id de la nueva categoria
   */
  newProduct() {
    this.cont;
    this.isEdit = false;
    var id = new Date().getTime();
    this.product = {
      pro_id: id.toString(),
      pro_description: "",
      pro_categoria: "",
      pro_stock: null,
      pro_nombre: "",
      pro_precio: null,
      pro_url: "",
      pro_url2:"",
      pro_estado_novedad: false,
      pro_estado_nuevo: false,
      pro_estado_descuento: false,
      pro_precio_desc: 0,
      pro_id_internal: "",
      pro_estado_mas_vendido: false,
      pro_estado_pro_nuevo: false,
      pro_estado_temporada: false,
    };
  }

  /**
   * para agregar categorias
   * @param product
   * @param valid
   */

  addProduct(product: Product, valid: boolean) {
    if (valid) {
      console.log(product);
      product.pro_categoria=this.category.nombre
      product.pro_estado_nuevo = this.product.pro_estado_nuevo;
      if( product.pro_estado_pro_nuevo==undefined )
      {
        product.pro_estado_pro_nuevo=false
      }
      if( product.pro_estado_mas_vendido==undefined )
      {
        product.pro_estado_mas_vendido=false
      }
     
      product.pro_precio_desc = product.pro_precio-((product.pro_discount_percentage*product.pro_precio)/100);
      if(product.pro_estado_descuento==false)
      {
        product.pro_precio_desc=product.pro_precio
      }
      this.productService.createProduct(product).then(() => {
        swal("OK", "Registro Exitoso", "success");
        this.product = {};
        $("#modalProduct").modal("hide");
        
      });
    }
    
    
  }

  /**
   * *** Obtenemos todos los productos de la DB ***
   */
  async getProducts() {
    await this.productService.getProducts('all', 'all').subscribe((prductSnapshot) => {
      this.arrayproduct = [];
      prductSnapshot.forEach((categoryData) => {
        this.arrayproduct.push(categoryData.payload.doc.data());
        if (prductSnapshot.length == this.arrayproduct.length) {
          this.initDataTable();
        }
      });
    });
  }

  async getCategory() {
    await this.productService.getCategories().subscribe((categorySnapshot) => {
      this.arrayCategory = [];
      categorySnapshot.forEach((categoryData) => {
        this.arrayCategory.push(categoryData.payload.doc.data());
        if (categorySnapshot.length == this.arrayCategory.length) {
          // this.initDataTable();
        }
      });
    });
  }

  selectCategories(e) {
    this.category = this.arrayCategory[e];
    // this.category = e.target.value
    this.estadoNuevo('e');
    this.subgetCategory();
  }


  sCategory (e) {
    this.arrayCategory.forEach(element => {
      if (element.nombre == e) {
        this.category = element;
      }
    });
    this.subgetCategory();
  }


  async subgetCategory() {
    this.arraySubcategory = [];
    await this.productService.getSubCategory(this.category.id_category).pipe(take(1)).subscribe((categorySnapshot) => {
      this.arraySubcategory = [];
      if (categorySnapshot.length == 0) {
        this.product.pro_subcategory = '';
      }
      categorySnapshot.forEach((categoryData) => {
        this.arraySubcategory.push(categoryData.payload.doc.data());
        if (categorySnapshot.length == this.arraySubcategory.length) {
        }
      });
    });
  }

  selectSubCategories(e) {
    this.arraySubcategory.forEach(element => {
      if (element.subcat_nombre==e) {
        this.subCategory = element;
      }
    });
    
    // this.subCategory = this.arraySubcategory[e.target.value];
    // this.estadoNuevo('e');
  }


  /**
   * *** Seleccionamos una producto para la edicion ***
   * @param category
   */
  selectProduct(product: Product) {
    this.isEdit = true;
    this.product = product;
    this.sCategory(this.product.pro_categoria);
    // this.estadoNuevo('e');
    this.subgetCategory();
  }

  /**
   *
   * @param id
   */
  public editProduct(id) {
    let editSubscribe = this.productService
      .getProduct(id)
      .subscribe((categoria) => {
        editSubscribe.unsubscribe();
      });
  }

  public deleteProduct(id) {
    this.productService.deleteProduct(id).then(
      () => {},
      (error) => {
        console.error(error);
      }
    );
  }

  initDataTable() {
    let aaa = this.tablaDatos;
    $("#datatablesProducts").DataTable().destroy();
    setTimeout(function () {
      /*
       * Opciones del datatable
       */
      aaa = $("#datatablesProducts").DataTable({
        paging: true,
        ordering: true,
        info: true,
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"],
        ],
        responsive: true,
        retrieve: true,
        language: {
          search: "",
          searchPlaceholder: "Buscar",
        },
      });
    }, 10);
  }

  uploadDocumentToStorage(file: number) {
    // let serviceGlobal = this.registerService;
    let categoryLocal = this.product;
    var storageService = firebase.storage();
    var refStorage = storageService.ref("/product/img_"+file).child(this.product.pro_id);
    var uploadTask = refStorage.put(this.imageFile);
    uploadTask.on(
      "state_changed",
      null,
      function (error) {},
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          if(file==1)
          {
            console.log(file);
            categoryLocal.pro_url = downloadURL;
          }
          else if(file==2)
          {
            categoryLocal.pro_url2 = downloadURL;
          }
         
          swal({
            title: "Muy bien",
            text: "Información adicional guardada correctamente",
            buttonsStyling: false,
            confirmButtonClass: "btn btn-fill btn-success",
            type: "success",
          }).catch(swal.noop);
        });
      }
    );
  }

  estadoNuevo(e) {
    var cont = 0;
    var productAux = this.product;
    this.arrayproduct.forEach((element) => {
      if (this.product.pro_categoria == element.pro_categoria) {
        if (element.pro_estado_nuevo == true) {
          // this.product.pro_estado_pro_nuevo = true;
          cont++;
        }
        // else if(element.pro_estado_nuevo == false)
        // {
        //   this.product.pro_estado_pro_nuevo = false;
        // }
        
         


        // if (cont==4)
        // {
        //   swal('Error','NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN ESTA CATEGORÍA','error')
        //   this.product.pro_estado_nuevo = false;
        // }
        // else if(cont<4)
        // {
        //   swal('Error',' RECUERDE QUE DEBE AGREGAR 3 PRODUCTOS EN LO MAS NUEVO','error')
        //   this.product.pro_estado_nuevo = false;
        // }
      }
    });
    this.cont = cont;

    if (cont > 3) {
      swal(
        "Error",
        "NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN LA CATEGORÍA: " + this.product.pro_categoria,
        "error"
      );
      this.product.pro_estado_nuevo = false;
      $('#modalProduct').modal('hide');
      this.product = {};
      // this.product = productAux;
      // this.selectCategory(this.product);
    } else {
      if (this.product.pro_nombre != '') {
        if (this.product.pro_estado_nuevo) {
          this.product.pro_estado_pro_nuevo = true;
        }
        this.productService.updateProductState(this.product);
      }
    }
  }

  estadoNuevoTotal(e) {
 
    console.log(this.product);
    this.product.pro_estado_pro_nuevo=e.currentValue;
    console.log(e);
    
    
  this.productService.updateProductState(this.product);
  }

  estadoLoMasVendido(e) {
    var cont2 = 0;
    var productAux2 = this.product;
    this.arrayproduct.forEach((element) => {
      if (this.product.pro_categoria == element.pro_categoria) {
        if (element.pro_estado_novedad == true) {
          cont2++;
         
        }
  
        // if (cont==4)
        // {
        //   swal('Error','NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN ESTA CATEGORÍA','error')
        //   this.product.pro_estado_nuevo = false;
        // }
        // else if(cont<4)
        // {
        //   swal('Error',' RECUERDE QUE DEBE AGREGAR 3 PRODUCTOS EN LO MAS NUEVO','error')
        //   this.product.pro_estado_nuevo = false;
        // }
      }
    });
    this.cont2 = cont2;
  
    if (cont2 > 3) {
      swal(
        "Error",
        "NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN LA CATEGORÍA: " + this.product.pro_categoria,
        "error"
      );
      this.product.pro_estado_novedad = false;
      $('#modalProduct').modal('hide');
      this.product = {};
      // this.product = productAux;
      // this.selectCategory(this.product);
      // else {
      //   if (this.product.pro_nombre != '') {
      //     if (this.product.pro_estado_nuevo) {
      //       this.product.pro_estado_pro_nuevo = true;
      //     }
      //     this.productService.updateProductState(this.product);
      //   }
    } else {
      if (this.product.pro_nombre != '') {
        if(this.product.pro_estado_novedad)
        {
          this.product.pro_estado_mas_vendido = true;
        }
        this.productService.updateProductState(this.product);
      }
    }
  }

  3
  estadoLoMasVendidoTotal(e) {
    this.productService.updateProductState(this.product);
  }
  estadoTemporada(e)
  {
    this.productService.updateProductState(this.product);
  }

  estadoDecuento(eD) {
    var cont3 = 0;

    this.product.pro_estado_descuento = eD.currentValue;
    this.arrayproduct.forEach((element) => {
      if (this.product.pro_categoria == element.pro_categoria) {
        if (element.pro_estado_descuento == true) {
          cont3++;
        }
        if (cont3 == 3) {
          swal(
            "Error",
            "NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN ESTA CATEGORÍA",
            "error"
          );
          this.product.pro_estado_descuento = false;
        }
      }
    });
  }
  estadoDecuentoTotal(eD) {
    // var cont3 = 0;

    this.product.pro_estado_descuento = eD.currentValue;
    // this.arrayproduct.forEach((element) => {
    //   if (this.product.pro_categoria == element.pro_categoria) {
    //     if (element.pro_estado_descuento == true) {
    //       cont3++;
    //     }
    //     if (cont3 == 3) {
    //       swal(
    //         "Error",
    //         "NO SE PUEDE AGREGAR MAS PRODUCTOS NUEVOS EN ESTA CATEGORÍA",
    //         "error"
    //       );
    //       this.product.pro_estado_descuento = false;
    //     }
    //   }
    // });
  }
}
