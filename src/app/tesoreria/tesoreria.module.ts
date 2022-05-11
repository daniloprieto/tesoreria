import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';
import { CoreModule } from '../core/core.module';
import { IngressTithesAndOffersComponent } from './components/ingress-tithes-and-offers/ingress-tithes-and-offers.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { ModalDeleteTicketDialog } from './components/modal-delete-ticket/modal-delete-ticket.dialog';


@NgModule({
  declarations: [
    DashboardLiveComponent,
    IngressTithesAndOffersComponent,
    TicketsListComponent,
    ModalDeleteTicketDialog,
  ],
  imports: [
    CommonModule,
    CoreModule,
    TesoreriaRoutingModule
  ]
})
export class TesoreriaModule { }
