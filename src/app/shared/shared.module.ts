import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { CoreModule } from '../core/core.module';
import { TicketsTableComponent } from './components/atoms/tables/tickets-table/tickets-table.component';


@NgModule({
  declarations: [
    HeaderComponent,
    TicketsTableComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    HeaderComponent,
    TicketsTableComponent
  ]
})
export class SharedModule { }
