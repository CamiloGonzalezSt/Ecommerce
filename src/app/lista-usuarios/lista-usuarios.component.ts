import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent  implements OnInit {
  users: any[] = [];

  constructor(private sqliteService: SqliteService, private modalController: ModalController) { }

  ngOnInit() {
    this.users = this.sqliteService.getUsers();
    
  }
  closeModal() {
    this.modalController.dismiss();
  }

}
