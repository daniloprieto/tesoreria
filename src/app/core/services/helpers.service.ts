import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';

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
      case 'Ingress':
        return language === 'ES' ? 'Ingreso' : 'Ingresso';
        break;
      case 'Egress':
        return language === 'ES' ? 'Salida' : 'Saída';
        break;
      default:
        return language === 'ES' ? 'Otro' : 'Outro';
        break;
    }
  }

  getTotalActives(tickets: Ticket[]): number {
    let ingress = tickets
      .map(t => (Number(t.status) === 1 || Number(t.status) === 4) && (t.type !== 'Egress') ? Number(t.amount) : 0)
      .reduce((acc, value) => acc + value, 0);

    let egress = tickets
      .map(t => (Number(t.status) === 1 || Number(t.status) === 4) && (t.type === 'Egress') ? Number(t.amount) : 0)
      .reduce((acc, value) => acc + value, 0);

    return (ingress - egress);
  }

  getActiveTickets(tickets: Ticket[]): Ticket[] {
    let activeTickets = tickets.filter(t => (Number(t.status) === 1 || Number(t.status) === 4));
    return activeTickets;
  }
}
