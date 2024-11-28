import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HogarPage } from './hogar.page';

const routes: Routes = [
  {
    path: '',
    component: HogarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HogarPageRoutingModule {}
