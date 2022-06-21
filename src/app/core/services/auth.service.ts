import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinct, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';
import { HttpCustomService } from './http-custom.service';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  constructor(
    private _router: Router,
    private _alert: AlertService,
    private _http: HttpCustomService,
    private _storage: StorageService
  ) {
    this.getSession();
  }

  signIn(user: string, password: string) {
    const path = 'login.php';
    const body = { user, password };

    this._http.post(path, body)
      .pipe(
        distinct(),
        tap({
          next: (userData: User) => {
            if (userData) {
              this.setSession(user, password);
              this.user.next(userData);
              this._router.navigate(['']);
            } else {
              this._alert.showAlert($localize `No tienes permisos para acceder`)
            }
          },
          error: (error) => this._alert.showAlert($localize `Ocurrió un error al intentar acceder`)
        })
      )
      .subscribe()

  }

  logout(){
    this.user.next({} as User);
    this._storage.clear();
    this._router.navigate(['//auth']);
  }

  setSession(user: string, password: string) {
    this._storage.set(environment.userEncrypted, user);
    this._storage.set(environment.passwordEncrypted, password);
  }

  getSession() {
    const user = this._storage.get(environment.userEncrypted);
    const password = this._storage.get(environment.passwordEncrypted);

    if (user && password) this.signIn(user, password);
  }


}
