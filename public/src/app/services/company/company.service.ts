import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private fb: AngularFirestore
  ) { }
  //Crea una nueva categoria
  // public saveCompany(category: Category, company: Company, infoUser) {
  //   this.fb.collection('users_sale').doc(infoUser.id).update({category: category.id, company_id: company.id});
  //   return this.fb.collection('categorias').doc(category.id).collection('lugares').doc(company.id).set(company);
  // }
  // public getCompany(infoUser) {
  //   return this.fb.collection('categorias').doc(infoUser.category).collection('lugares').doc(infoUser.company_id).valueChanges();
  // }
  

}
