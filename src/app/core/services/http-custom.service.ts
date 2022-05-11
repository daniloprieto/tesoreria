import { HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HttpCustomService {

  constructor() { }

  post(path: string, data: any):Observable<any> {

    const url = environment.api + path
    const body = JSON.stringify(data);

    return new Observable((observer: Observer<any>) => {
      fetch(url, { method: "POST", body: body })
        .then((r) => r.json().then((b) => { observer.next(b) }))
        .catch((error) => observer.error(error))
    })

  }
}
