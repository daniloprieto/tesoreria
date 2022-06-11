import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'angular-web-storage';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const SECRET_KEY = environment.hashCode;

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(
    private local: LocalStorageService,
    private session: SessionStorageService,
    private _router: Router
  ) { }

  encrypt(data: any) {

    data = CryptoJS.AES.encrypt(data, SECRET_KEY);

    data = data.toString();

    return data;

  }

  decrypt(data: any) {

    data = CryptoJS.AES.decrypt(data, SECRET_KEY);

    data = data.toString(CryptoJS.enc.Utf8);

    return data;

  }

  set(key: string, data: any) {

    const expired: number = 24;

    this.local.set(key, this.encrypt(data), expired, 'h');

  }

  get(key: string) {

    let tokenized = localStorage.getItem(key) ? localStorage.getItem(key) : null;

    if (!tokenized) return tokenized; //token doesn't exist in localStorage return null

    if (!tokenized?.includes('_expired')) {

      this.remove(key);

      window.location.reload();

    }

    if (tokenized) {

      let data = JSON.parse(tokenized);

      if (Number(data._expired) < Number(new Date().getTime())) {

        this.remove(key);

        window.location.reload();

      }

    }

    return this.decrypt(this.local.get(key));
  }

  remove(key:string) {
    this.local.remove(key);
  }

  clear() {
    this.local.clear();
    this._router.navigate(['/'])
  }

}
