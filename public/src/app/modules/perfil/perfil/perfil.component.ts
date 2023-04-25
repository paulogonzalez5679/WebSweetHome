import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'app/services/users/users.service';
import { AuthService } from 'app/services/auth/auth/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public infoUser: Users;
  public user: Users;
  public category: Category;
  public arrayCategory: any[];
  public imageFile: any;
  public arrayCountries: any[];
  public categorySelect = '';
  public imageSrc: any ;
  public isContentToggled: Boolean;
  public arrayShowAllNotification: Array<Boolean> = [];
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser'));
    this.user = {};
    this.getUsers();
    
    if (this.infoUser.user_type == 0) {
      this.user = {
        user_email: this.infoUser.user_email,
        user_name: this.infoUser.user_name,
        user_lastname: this.infoUser.user_lastname,
        user_product: this.infoUser.user_product
      };
    } else {
      // this.disabled =  true;
      this.getUsers();
    }    
  }
  /**
   * *** obtenemos la data del usuario ***
   */
  async getUsers() {
    (await this.usersService.getUserByEmails(this.infoUser.user_email)).subscribe((user) => {
      this.user = user;
    });
  }

  saveUser(user: Users, valid: boolean) {
    this.usersService.saveUser(this.user, this.infoUser);
  }

  logout() {
    this.doLogout();
  };

  doLogout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }



  public toggleContent(i) {
    this.arrayShowAllNotification[i] = true ;
  }
  public toggleContentHiden(i) {
    this.arrayShowAllNotification[i] = false;
  }
}
