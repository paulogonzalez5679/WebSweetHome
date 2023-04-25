import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private category: AngularFirestore,
    private subCategory: AngularFirestore,
  ) { }

  //Crea una nueva Subcategoria dentro de la coleccion CATEGORIA
  public createSubCategory(subCategory: SubCategory, categoria: Category) {
    return this.category.collection('category').doc(categoria.id_category).collection('sub_category').doc(subCategory.subcat_id).set(subCategory);
  }
  //Obtiene todas las subcategorias
  public getSubCategory(categoriaID: string) {
    return this.category.collection('category').doc(categoriaID).collection('sub_category').snapshotChanges();
  }
  //Obtiene todas las subcategorias
  public deleteSubCategory(categoria: Category, subCategory: SubCategory) {
 
    return this.category.
    collection('category').
    doc(categoria.id_category).
    collection('sub_category').
    doc(subCategory.subcat_id).delete();
  }

  //Crea una nueva categoria
  public createCategory(category: Category) {
    return this.category.collection('category').doc(category.id_category).set(category);
  }
  //Obtiene una nueva categoria
  public getCategory(documentId: string) {
    return this.category.collection('category').doc(documentId).snapshotChanges();
  }
  //Obtiene todos las categorias
  public getCategories() {
    return this.category.collection('category').snapshotChanges();
  }
  //Actualiza una nueva categoria
  public updateCategory(documentId: string, data: any) {
    return this.category.collection('category').doc(documentId).set(data);
  }
  //Elimina una nueva categoria
  public deleteCategory(documentId: string) {
    return this.category.collection('category').doc(documentId).delete();
  }
}
