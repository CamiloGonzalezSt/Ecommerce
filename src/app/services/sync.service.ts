import { Injectable } from "@angular/core";
import { SqliteService } from './sqlite.service';
import { HttpClient } from "@angular/common/http";
import { productos } from './sqlite.service'; // Asegúrate de importar la clase productos


@Injectable({
    providedIn: 'root'
})
export class SyncService {
    private apiUrl = 'https://5d9c-190-153-153-125.ngrok-free.app/productos'; // URL de tu JSON Server



    constructor(private http: HttpClient, private sqliteService: SqliteService) {}

    async syncData() {
    // Obtener productos de JSON Server
    const response = await this.http.get<productos[]>(this.apiUrl).toPromise();
    const productos: productos[] = response || [];

    // Obtener productos existentes en SQLite
    const existingProducts = await this.sqliteService.selectData();

    for (let producto of productos) {
        // Verifica si el producto ya existe en SQLite
        const exists = existingProducts.some(p => p.nombre === producto.nombre);
        if (!exists) {
            await this.sqliteService.insertData(producto.nombre, producto.descripcion, producto.precio, producto.cantidad);
        }
    }
}

    async addProduct(producto: productos) {
        // Agregar a SQLite
        await this.sqliteService.insertData(producto.nombre, producto.descripcion, producto.precio, producto.cantidad);
        
        // Agregar a JSON Server
        try {
            await this.http.post(this.apiUrl, producto).toPromise();
        } catch (error) {
            console.error('Error al agregar producto a JSON Server', error);
        }
    }

    async updateProduct(producto: productos) {
        // Actualizar en SQLite
        await this.sqliteService.updateRecord(producto.nombre, producto.descripcion, producto.precio, producto.cantidad);

        // Actualizar en JSON Server
        await this.http.put(`${this.apiUrl}/${producto.nombre}`, producto).toPromise();
    }

    async deleteProduct(nombre: string) {
        // Eliminar de SQLite
        await this.sqliteService.deleteRecord(nombre);

        // Eliminar de JSON Server
        await this.http.delete(`${this.apiUrl}/${nombre}`).toPromise();
    }
}
