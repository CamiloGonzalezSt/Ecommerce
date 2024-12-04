import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from '../services/sqlite.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  @Input() orderId!: number; // ID del pedido recibido como entrada
  orderDetails: any = null;
  isLoading: boolean = true;

  constructor(private dbService: SqliteService, private modalController: ModalController) {}

  async ngOnInit() {
    await this.loadOrderDetails();
  }

  async loadOrderDetails() {
    try {
      this.isLoading = true;
  
      // Obtener detalles básicos del pedido por ID
      const allOrders = await this.dbService.getOrders(); // Cambia si es necesario para obtener pedidos desde la BD
      this.orderDetails = allOrders.find((order: any) => order.id === this.orderId);
  
      if (this.orderDetails) {
        // Obtener los productos asociados al pedido
        const products = await this.dbService.getOrderDetails(this.orderId);
        this.orderDetails.productos = products; // Añade los productos al pedido
      } else {
        alert('Pedido no encontrado');
      }
    } catch {
      alert('Error al cargar detalles del pedido:');
    } finally {
      this.isLoading = false;
    }
  }
  

  closeModal() {
    this.modalController.dismiss();
  }
}
