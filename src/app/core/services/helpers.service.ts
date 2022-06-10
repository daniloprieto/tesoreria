import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})

export class HelpersService {

  constructor() { }

  dateEnStr(date = new Date()): string {
    return date.toLocaleDateString('en-US');
  }

  dateEsStr(date = new Date()): string {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  utcSlice(date: Date = new Date(this.dateEnStr())) {
    return date.toJSON().slice(0, 10);
  }

  getType(type: string, language: string): string {
    switch (type) {
      case TYPE.TITHE:
        return language === 'ES' ? 'Diezmo' : 'Dízimo';
        break;
      case TYPE.OFFERING:
        return language === 'ES' ? 'Ofrenda' : 'Oferta';
        break;
      case TYPE.INGRESS:
        return language === 'ES' ? 'Ingreso' : 'Ingresso';
        break;
      case TYPE.EGRESS:
        return language === 'ES' ? 'Salida' : 'Saída';
        break;
      default:
        return language === 'ES' ? 'Otro' : 'Outro';
        break;
    }
  }

  getTotalActives(tickets: Ticket[]): number {
    let ingress = tickets
      .map(t => (
        +t.status! === STATUS.ACTIVED
        || +t.status! === STATUS.CLOSED
        || +t.status! === STATUS.REPORTED)
        && (t.type !== TYPE.EGRESS)
            ? +t.amount
            : 0)
      .reduce((acc, value) => acc + value, 0);

    let egress = tickets
      .map(t => (
        +t.status! === STATUS.ACTIVED
        || +t.status! === STATUS.CLOSED
        || +t.status! === STATUS.REPORTED)
        && (t.type === TYPE.EGRESS)
            ? +t.amount
            : 0)
      .reduce((acc, value) => acc + value, 0);

    return (ingress - egress);
  }

  getActiveTickets(tickets: Ticket[]): Ticket[] {
    let activeTickets = tickets.filter(t => (Number(t.status) === STATUS.ACTIVED));
    return activeTickets;
  }
}

export const STATUS = {
  CANCEL: 0, // Ticket Cancelado
  ACTIVED: 1, //Ticket creado que no esta en ningun reporte todavia
  CLOSED: 3, //ticket que se agrego correctamente a un reporte
  REPORTED: 4,
  EXPORTED: 5
}

export const TYPE = {
  INGRESS: 'Ingress',
  EGRESS: 'Egress',
  OFFERING: 'offering',
  TITHE: 'tithe'
}
