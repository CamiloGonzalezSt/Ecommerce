import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalEnviadoComponent } from '../modal-enviado/modal-enviado.component';
import { IonicModule } from '@ionic/angular';

import { RestablecerPageRoutingModule } from './restablecer-routing.module';

import { RestablecerPage } from './restablecer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestablecerPageRoutingModule
  ],
  declarations: [RestablecerPage, ModalEnviadoComponent]
})
export class RestablecerPageModule {}
