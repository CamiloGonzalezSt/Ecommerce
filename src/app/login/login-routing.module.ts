import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },  {
    path: 'client-profile',
    loadChildren: () => import('./profiles/client-profile/client-profile.module').then( m => m.ClientProfilePageModule)
  },
  {
    path: 'admin-profile',
    loadChildren: () => import('./profiles/admin-profile/admin-profile.module').then( m => m.AdminProfilePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
