import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductServiceService } from '../producto/product-service.service';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private db: SQLiteObject;
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  private authenticated: boolean = false;
  private productosUrl = 'https://f8ba-190-153-153-125.ngrok-free.app/productos'; // URL JSON Server
  private productsSubject = new BehaviorSubject<Producto[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private sqlite: SQLite, private router: Router, private http: HttpClient, private productservice: ProductServiceService) {
    this.init();
    this.loadInitialUsers();
    this.loadInitialProducts();
  }

  async init() {
    // Inicializa la base de datos
    try {
      this.db = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default'
      });
      //await this.clearDatabase();
      await this.createTable();
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
    }
  }

  async createTable() {
    // Crear tabla de productos
    await this.db.executeSql(`CREATE TABLE IF NOT EXISTS productos (id TEXT PRIMARY KEY AUTOINCREMENT, nombre TEXT, descripcion TEXT, precio REAL, cantidad INTEGER)`, []);
  }

  // Método para limpiar la tabla de productos
 // async clearDatabase(): Promise<void> {
 //   try {
 //     await this.db.executeSql(`DELETE FROM productos`, []);
 //     console.log('Base de datos SQLite limpiada');
 //   } catch (error) {
 //     console.error('Error al limpiar la base de datos:', error);
 //   }
 // }


 async loadInitialProducts() {
  try {
    const localProducts = await this.getLocalProducts();
    const serverProducts = await this.getProductsFromServer();

    // Combinar productos locales y del servidor sin duplicados
    const combinedProducts = [...localProducts, ...serverProducts.filter(sp => !localProducts.some(lp => lp.id === sp.id))];

    // Emitir la lista combinada
    this.productsSubject.next(combinedProducts);
  } catch (error) {
    console.error('Error al cargar productos iniciales', error);
  }
}

async getProductsFromServer(): Promise<Producto[]> {
  try {
    const response = await this.http.get<Producto[]>(this.productosUrl).toPromise();
    return response || [];
  } catch (error) {
    console.error('Error al obtener productos del JSON Server:', error);
    return [];
  }
}

async createProductInDb(producto: Producto): Promise<void> {
  try {
    await this.db.executeSql(
      `INSERT INTO productos (id, nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?, ?)`, 
      [producto.id, producto.nombre, producto.descripcion, producto.precio, producto.cantidad]
    );
  } catch (error) {
    console.error('Error al guardar producto en SQLite:', error);
  }
}

async getLocalProducts(): Promise<Producto[]> {
  const results = await this.db.executeSql(`SELECT * FROM productos`, []);
  const productos: Producto[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    productos.push(results.rows.item(i));
  }
  return productos;
}

async createProduct(producto: Producto): Promise<void> {
  try {
    const newProductId = await this.db.executeSql(
      `INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`, 
      [producto.nombre, producto.descripcion, producto.precio, producto.cantidad]
    );

    producto.id = newProductId.insertId.toString();
    await this.http.post<Producto>("https://f8ba-190-153-153-125.ngrok-free.app/productos", producto).toPromise();

    this.productsSubject.next(await this.getLocalProducts());
  } catch (error) {
    console.error('Error al crear producto:', error);
  }
}

async syncProductsFromServer() {
  const serverProducts = await this.getProductsFromServer();
  for (const producto of serverProducts) {
    await this.createProductInDb(producto);
  }
  this.productsSubject.next(await this.getLocalProducts());
}


  // Actualizar producto en ambos (SQLite y JSON Server)
  async updateProduct(producto: Producto): Promise<void> {
    try {
      // Actualizar en SQLite
      await this.db.executeSql(`UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?`, [
        producto.nombre, 
        producto.descripcion, 
        producto.precio, 
        producto.cantidad, 
        producto.id
      ]);

      // Actualizar en JSON Server
      await this.http.put(`${this.productosUrl}/${producto.id}`, producto).toPromise();

      // Refresca la lista de productos
      this.productsSubject.next(await this.getLocalProducts());
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  }

  // Eliminar producto en ambos (SQLite y JSON Server)
  async deleteProduct(productId: string): Promise<void> {
    try {
        // Convertir el ID a número para SQLite
        const id = Number(productId);

        // Eliminar en SQLite
        await this.db.executeSql(`DELETE FROM productos WHERE id = ?`, [id]);

        // Eliminar en JSON Server
        await this.http.delete(`${this.productosUrl}/${productId}`).toPromise();

        // Refresca la lista de productos
        this.productsSubject.next(await this.getLocalProducts());
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}


  async getProducts(): Promise<Producto[]> {
    try {
      // Obtener productos desde el JSON Server
      const response = await this.http.get<Producto[]>(this.productosUrl).toPromise();
      const productos: Producto[] = response || [];
      
      // Emitir los productos cargados
      this.productsSubject.next(productos);
      return productos;
    } catch (error) {
      console.error('Error al obtener los productos del JSON Server:', error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

 

  
///////////////////////////////////////////////////

  generateToken(usuario: string): string {
    return btoa(`${usuario}:${new Date().getTime()}`);
  }

  logout() {
    this.authenticated = false;
    localStorage.removeItem('authenticated');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  async createUser(usuario: string, password: string): Promise<boolean> {
    const exists = this.usersSubject.getValue().some(u => u.usuario === usuario);
    if (exists) {
      return false; 
    }

    const newUser = { usuario, password };
    const currentUsers = this.usersSubject.getValue();
    currentUsers.push(newUser); 
    this.usersSubject.next(currentUsers); 

    await this.saveUserToDb(newUser); 
    return true;
  }

  private async saveUserToDb(user: any): Promise<void> {
    try {
      await this.db.executeSql(`INSERT INTO usuarios (usuario, password) VALUES (?, ?)`, [
        user.usuario,
        user.password,
      ]);
      console.log('Usuario guardado en la base de datos:', user);
    } catch (error) {
      console.log('Error al guardar el usuario en la base de datos', error);
    }
  }

  login(usuario: string, password: string): string | null {
    const user = this.usersSubject.getValue().find(u => u.usuario === usuario && u.password === password);
    
    if (user) {
      this.authenticated = true;
      const token = this.generateToken(usuario);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('isAuthenticated', 'true');
      return token;
    }
    
    return null; 
   }

  updateUser(updatedUser: any) {
    const currentUsers = this.usersSubject.getValue();
    const index = currentUsers.findIndex(user => user.usuario === updatedUser.usuario);
    
    if (index !== -1) {
      currentUsers[index] = updatedUser; 
      this.usersSubject.next(currentUsers); 
      this.saveUserToDb(updatedUser); 
    }
  }

  getUsers() {
    return this.usersSubject.getValue();
  }

  isAuthenticated(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }

  private loadInitialUsers() {
    this.usersSubject.next([
      { usuario: 'camilo gonzalez', password: 'Cami3740' },
      { usuario: 'alexander patiño', password: 'Alex2024' },
    ]);
  }
}