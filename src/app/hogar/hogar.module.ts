import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HogarPageRoutingModule } from './hogar-routing.module';

import { HogarPage } from './hogar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HogarPageRoutingModule
  ],
  declarations: [HogarPage]
})
export class HogarPageModule {}
