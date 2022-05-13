import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  public date = new Date();

  constructor() { }

  todayEnStr(): string {
    return this.date.toLocaleDateString('en-US');
  }

  todayEsStr(): string {
    return this.date.getDate() + '/' + (this.date.getMonth() + 1) + '/' + this.date.getFullYear();
  }

  utcSlice(date: Date = new Date(this.todayEnStr())) {
    return date.toJSON().slice(0, 10);
  }

  getType(type: string, language: string): string {
    switch (type) {
      case 'tithe':
        return language === 'ES' ? 'Diezmo' : 'Dízimo';
        break;
      case 'offering':
        return language === 'ES' ? 'Ofrenda' : 'Oferta';
        break;
      default:
        return language === 'ES' ? 'Otro' : 'Outro';
        break;
    }
  }
}
