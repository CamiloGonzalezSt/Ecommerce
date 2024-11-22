import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactoPageRoutingModule } from './contacto-routing.module';

import { ContactoPage } from './contacto.page';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactoPageRoutingModule,
    MatFormFieldModule,  // Agrega aquí los módulos de Angular Material
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule 
  ],
  declarations: [ContactoPage]
})
export class ContactoPageModule {}
