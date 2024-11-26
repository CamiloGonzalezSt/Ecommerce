import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MujerProductosPage } from './mujer-productos.page';

const routes: Routes = [
  {
    path: '',
    component: MujerProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MujerProductosPageRoutingModule {}
