import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLiveComponent } from './components/dashboard-live/dashboard-live.component';

const routes: Routes = [
  {
    path:'',component: DashboardLiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TesoreriaRoutingModule { }
