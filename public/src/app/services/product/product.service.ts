import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  public carrito = [];

  constructor(
    private product: AngularFirestore,
    private category: AngularFirestore
  ) {}

  getsubcategory( category: string, subcat: string){

  }

  //Guardar en el carrito
  getProductosCarrito(product: Product, users: Users) {
    return this.product
      .collection("users_collection")
      .doc(users.user_id)
      .collection("user_carrito")
      .doc(product.pro_id)
      .set(product);
  }
  //Crea una nueva categoria
  public createProduct(product: Product) {
    return this.product.collection("products").doc(product.pro_id).set(product);
  }
  //Obtiene una nueva categoria
  public getProduct(documentId: string) {
    return this.product
      .collection("products")
      .doc(documentId)
      .snapshotChanges();
  }

  //Obtiene todos productos normal
  public getProducts(category: string, campoDB: string) {
    if (category == "all") {
      if (campoDB == "all") {
        return this.product.collection("products").snapshotChanges();
      } else {
        return this.product
          .collection("products", (ref) => ref.where(campoDB, "==", true))
          .snapshotChanges();
      }
    }

    else 
    {
      if (campoDB == "all") {
        return this.product
          .collection("products", (ref) =>
            ref.where("pro_categoria", "==", category)
          )
          .snapshotChanges();
      } 
      // else if(campoDB2 != "all"){
      //   return this.product
      //     .collection("products", (ref) =>
      //       ref
      //         .where("pro_categoria", "==", category).where(campoDB2,"==",true)
      //     )
      //     .snapshotChanges();
      // }

      else  {
        return this.product
          .collection("products", (ref) =>
            ref
              .where("pro_categoria", "==", category)
              .where(campoDB, "==", true)
          )
          .snapshotChanges();
      }
      
      
    }

    
    
  }

  //Obtiene todos productos normal
  public getProductsBySubCategory(category: string, subcategory: string, campoDB: string) {
    console.log(category, subcategory,);
    
        return this.product
          .collection("products", (ref) => ref.where('pro_categoria','==',category).where('pro_subcategory', "==", subcategory))
          .snapshotChanges();
  }
  

  //Obtiene todos productos ascendente
  public getProductsAsc(category: string) {
    if (category == "all") {
      return this.product
        .collection("products", (ref) => ref.orderBy("pro_precio_desc", "asc"))
        .snapshotChanges();
    } else {
      return this.product
        .collection("products", (ref) =>
          ref.where("pro_categoria", "==", category).orderBy("pro_precio_desc", "asc"))
        .snapshotChanges();
    }
  }

  //Obtiene todos productos descendente
  public getProductsDes(category: string) {
    if (category == "all") {
      return this.product
        .collection("products", (ref) =>
          ref
            .orderBy("pro_precio_desc", "desc")
        )
        .snapshotChanges();
    } else {
      return this.product
        .collection("products", (ref) =>
          ref
            .where("pro_categoria", "==", category)
            .orderBy("pro_precio_desc", "desc")
        )
        .snapshotChanges();
    }
  }

  //Actualiza una nueva categoria
  public updateProduct(documentId: string, data: any) {
    return this.product.collection("products").doc(documentId).set(data);
  }
  //Actualiza una nueva categoria
  public updateProductState(product: Product) {
    return this.product
      .collection("products")
      .doc(product.pro_id)
      .update(product);
  }
  //Elimina una nueva categoria
  public deleteProduct(documentId: string) {
    return this.product.collection("products").doc(documentId).delete();
  }

  //Obtiene todos las categorias
  public getCategories() {
    return this.category.collection("category").snapshotChanges();
  }
  public updateCategories(category: string, e: boolean) {
    return this.category.collection("category").doc("rt1NmF0tR0qb8G10d8Kr").update({category_state:e});
  }
  public getSubCategory(category) {
    return this.category.collection('category').doc(category).collection('sub_category').snapshotChanges();
  }
}
