import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BalanzComponent } from './components/balanz/balanz.component';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';

const routes: Routes = [
  {
    path:'',component: DashboardLiveComponent
  },
  {
    path:'balanz',component: BalanzComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
