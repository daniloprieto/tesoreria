import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let logged = new BehaviorSubject<boolean>(false);

    this._auth.user
    .pipe(
      tap(
        (user: User) => {
          logged.next(!user.name || !user.role ? false : true);
          if (!logged.value) this._router.navigate(['/auth']);
        }
      )
    )
      .subscribe()

    return logged;

  }

}
