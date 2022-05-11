import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';
import { HttpCustomService } from './http-custom.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  constructor(
    private _router: Router,
    private _alert: AlertService,
    private _http: HttpCustomService
  ) { }

  signIn(user: string, password: string) {
    const path = 'login.php';
    const body = { user, password };

    this._http.post(path, body)
      .subscribe({
        next: (user: User) => {
          console.log(user);
          if (user) {
            this.user.next(user);
            this._router.navigate(['']);
          } else {
            this._alert.showAlert('No tienes permisos para acceder')
          }
        },
        error: (error) => this._alert.showAlert('Ocurrió un error al intentar acceder')
      })

  }


}
