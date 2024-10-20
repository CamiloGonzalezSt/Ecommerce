import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { ProductServiceService } from '../producto/product-service.service';
import { productos } from '../producto/model/ClProducto';

@Injectable({
  providedIn: 'root'
})
export class SincronizarService {

  constructor(
    private sqlite: SqliteService,
    private productoService: ProductServiceService
  ) {}

  // Sincronizar productos entre SQLite y el servidor JSON
  async syncProducts() {
    // Obtener productos locales desde SQLite
    const localProducts = await this.sqlite.selectData();

    // Obtener productos del servidor JSON
    this.productoService.getProducts().subscribe(async (remoteProducts) => {
      // Sincronizar productos de SQLite con el servidor
      for (const localProduct of localProducts) {
        const existsInServer = remoteProducts.find(
          (product: any) => product.nombre === localProduct.nombreProducto
        );
        if (!existsInServer) {
          // Si no existe en el servidor, lo convertimos al formato correcto y lo agregamos
          const productToAdd = {
            nombre: localProduct.nombreProducto,
            descripcion: localProduct.descripcion,
            precio: localProduct.precio,
            cantidad: localProduct.cantidad
          };
          await this.productoService.addProduct(productToAdd);
        }
      }

      // Sincronizar productos del servidor con SQLite
      for (const remoteProduct of remoteProducts) {
        const existsInLocal = localProducts.find(
          (product: any) => product.nombreProducto === remoteProduct.nombre
        );
        if (!existsInLocal) {
          // Si no existe en local, lo agregamos
          await this.sqlite.insertData(
            remoteProduct.nombre,
            remoteProduct.descripcion,
            remoteProduct.precio,
            remoteProduct.cantidad
          );
        }
      }
    });
  }

  // Sincronizar al crear un producto
  async syncAddProduct(producto: productos) {
    await this.sqlite.insertData(producto.nombreProducto, producto.descripcion, producto.precio, producto.cantidad);
    await this.productoService.addProduct(producto);
  }

  // Sincronizar al actualizar un producto
  async syncUpdateProduct(producto: productos) {
    await this.sqlite.updateRecord(producto.nombreProducto, producto.descripcion, producto.precio, producto.cantidad);
    await this.productoService.updateProduct( 1, producto);

  }

  // Sincronizar al eliminar un producto
  async syncDeleteProduct(nombreProducto: string) {
    await this.sqlite.deleteRecord(nombreProducto);
    await this.productoService.deleteProduct(nombreProducto);
  }
}

