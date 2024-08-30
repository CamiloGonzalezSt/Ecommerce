import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Importa el RouterModule si no está ya importado

import { ProductDetailPage } from './product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ProductDetailPage }]) // Define la ruta para este componente
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
