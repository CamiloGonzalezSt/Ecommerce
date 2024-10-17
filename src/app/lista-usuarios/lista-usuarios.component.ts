import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent implements OnInit {
  users: any[] = [];
  private usersSubscription!: Subscription; // Para gestionar la suscripción

  constructor(private sqliteService: SqliteService, private modalController: ModalController) {}

  ngOnInit() {
    // Suscríbete al observable de usuarios
    this.usersSubscription = this.sqliteService.users$.subscribe(users => {
      this.users = users;
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    // Desuscribirse para evitar fugas de memoria
    this.usersSubscription.unsubscribe();
  }
}
