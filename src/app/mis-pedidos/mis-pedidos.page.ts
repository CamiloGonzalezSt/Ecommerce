import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SqliteService } from '../services/sqlite.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
})
export class MisPedidosPage {
  pedidos: any[] = [];
  isLoading: boolean = true;
  

  constructor(private dbService: SqliteService, private modalController: ModalController, private router: Router) {}

  async ionViewWillEnter() {
    await this.loadPedidos();
  }

  async loadPedidos() {
    this.isLoading = true;
    try {
      // Obtener todos los pedidos desde la base de datos
      this.pedidos = await this.dbService.getOrders();
      console.log('Todos los pedidos cargados:', this.pedidos);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.pedidos = [];
    } finally {
      this.isLoading = false;
    }
  }
  
  

  async viewDetails(orderId: number) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: { orderId },
    });
    await modal.present();
  }

  volverCliente() {
    this.router.navigate(['/home']); 
  }

  
}
