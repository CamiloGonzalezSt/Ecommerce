import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HombrePageRoutingModule } from './hombre-routing.module';

import { HombrePage } from './hombre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HombrePageRoutingModule
  ],
  declarations: [HombrePage]
})
export class HombrePageModule {}
