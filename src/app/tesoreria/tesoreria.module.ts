import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesoreriaRoutingModule } from './tesoreria-routing.module';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';
import { CoreModule } from '../core/core.module';
import { IngressTithesAndOffersComponent } from './components/ingress-tithes-and-offers/ingress-tithes-and-offers.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { ModalDeleteTicketDialog } from './components/modal-delete-ticket/modal-delete-ticket.dialog';
import { ReportsComponent } from './components/reports/reports.component';
import { IngressComponent } from './components/ingress/ingress.component';
import { EgressComponent } from './components/egress/egress.component';
import { BalanzComponent } from './components/balanz/balanz.component';


@NgModule({
  declarations: [
    DashboardLiveComponent,
    IngressTithesAndOffersComponent,
    TicketsListComponent,
    ModalDeleteTicketDialog,
    ReportsComponent,
    IngressComponent,
    EgressComponent,
    BalanzComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    TesoreriaRoutingModule
  ]
})
export class TesoreriaModule { }
