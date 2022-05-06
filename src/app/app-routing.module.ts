import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'tesoreria',
    loadChildren: () => import('./tesoreria/tesoreria.module').then(m => m.TesoreriaModule),
  },
  {
    path: '',
    loadChildren: () => import('./tesoreria/tesoreria.module').then(m => m.TesoreriaModule),
    canActivate:[AuthGuard]
  },
  {
    path:'**',
    redirectTo:'',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
