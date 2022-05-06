import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  constructor(
    private _router: Router,
    private _alert: AlertService
  ) { }

  signIn(user: string, password: string) {

    const data = JSON.stringify({ user, password });

    fetch(environment.api + "login.php", {
      method: "POST",
      body: data,
    })
    .then(response=>response.json())
    .then((user:User) => {
      console.log('user', user)
      if (user) {
        this.user.next(user);
        this._router.navigate(['']);
      } else {
        this._alert.showAlert('No tienes permisos para acceder')
      }
    })
    .catch((error) => this._alert.showAlert('Ocurrió un error al intentar acceder'));

  }

}
