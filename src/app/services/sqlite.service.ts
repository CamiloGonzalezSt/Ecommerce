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
  private productosUrl = 'http://192.168.10.20:3000/productos'; // URL JSON Server
  public productsSubject = new BehaviorSubject<Producto[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private sqlite: SQLite, private router: Router, private http: HttpClient, private productservice: ProductServiceService) {
    this.init();
    this.loadInitialUsers();
  }

  async init() {
    // Inicializa la base de datos
    try {
      this.db = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default'
      });
      await this.createTable();
    } catch (error) {
      console.error('Error al inicializar la base de datos', error);
    }
  }

  async createTable() {
    // Crear tabla de productos
    await this.db.executeSql(`CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, descripcion TEXT, precio REAL, cantidad INTEGER)`, []);
  }
  // Sincroniza los productos desde JSON Server hacia SQLite
  async syncProductsFromServer() {
    const productos = await this.getProductsFromServer();
    for (const producto of productos) {
      await this.createProductInDb(producto);
    }
    this.productsSubject.next(await this.getLocalProducts());
  }

  // Obtiene productos del JSON Server
  async getProductsFromServer(): Promise<Producto[]> {
    try {
      const response = await this.http.get<Producto[]>(this.productosUrl).toPromise();
      return response || [];
    } catch (error) {
      console.error('Error al obtener productos del JSON Server:', error);
      return [];
    }
  }

  // Obtiene productos de SQLite
  async getLocalProducts(): Promise<Producto[]> {
    const results = await this.db.executeSql(`SELECT * FROM productos`, []);
    const productos: Producto[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      productos.push(results.rows.item(i));
    }
    return productos;
  }

  // Crear producto en SQLite
  public async createProductInDb(producto: Producto): Promise<void> {
    try {
      await this.db.executeSql(`INSERT INTO productos (id, nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?, ?)`, [
        producto.id, 
        producto.nombre, 
        producto.descripcion, 
        producto.precio, 
        producto.cantidad
      ]);
    } catch (error) {
      console.error('Error al guardar producto en SQLite:', error);
    }
  }

  // Crear producto en ambos (SQLite y JSON Server)
  async createProduct(producto: Producto): Promise<void> {
    try {
      // Guardar en SQLite
      const newProductId = await this.db.executeSql(`INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`, [
        producto.nombre, 
        producto.descripcion, 
        producto.precio, 
        producto.cantidad
      ]);

      // Guardar en JSON Server con el ID generado por SQLite
      producto.id = newProductId.insertId; 
      await this.http.post<Producto>(this.productosUrl, producto).toPromise();

      // Refresca la lista de productos
      this.productsSubject.next(await this.getLocalProducts());
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
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
      // Eliminar en SQLite
      await this.db.executeSql(`DELETE FROM productos WHERE id = ?`, [productId]);

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

  async loadInitialProducts() {
    // Cargar productos iniciales desde JSON Server en la base de datos local
    const productos = await this.getProducts();
    for (const producto of productos) {
      await this.createProductInDb(producto);
    }
  
    // Agregar un nuevo producto al final de cargar los iniciales
    this.productservice.addProduct('Producto nuevo', 100).subscribe(
      data => console.log('Producto agregado:', data),
      error => console.error('Error al agregar producto:', error)
    );
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

  async createOpenDatabase(): Promise<void> {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      this.db = db;
      await this.createTable();  
      console.log('Base de datos abierta con éxito');
    } catch (e) {
      console.error('Error al abrir la base de datos', e);
    }
  }

  createTable(): Promise<void> {
    return this.db.executeSql('CREATE TABLE IF NOT EXISTS productos(name VARCHAR(30), descripcion VARCHAR(100), precio REAL, cantidad INTEGER)', [])
      .then(() => {
        console.log('Tabla creada con éxito');
      }).catch(e => {
        console.error('Error al crear la tabla', e);
        return Promise.reject(e);
      });
  }

  async insertData(nombre: string, descripcion: string, precio: number, cantidad: number): Promise<void> {
    const query = 'INSERT INTO productos(name, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)';
    
    if (this.db) {
      return this.db.executeSql(query, [nombre, descripcion, precio, cantidad])
        .then(async () => {
          await this.saveProductToJsonServer({ nombre, descripcion, precio, cantidad }); // Guarda en JSON Server
          alert('Producto agregado con éxito');
          await this.selectData(); // Llama a selectData para actualizar la lista de productos
        })
        .catch(e => {
          console.error('Error al insertar producto', e);
          return Promise.reject(e);  
        });
    } else {
      return Promise.reject('Base de datos no inicializada');
    }
  }

  // Nueva función para guardar en JSON Server
  private async saveProductToJsonServer(producto: productos): Promise<void> {
    try {
      await this.http.post(`${this.apiUrl}/productos`, producto).toPromise();
      console.log('Producto guardado en JSON Server:', producto);
    } catch (error) {
      console.error('Error al guardar el producto en JSON Server', error);
    }
  }

  async selectData(): Promise<productos[]> {
    const productosList: productos[] = []; // Cambié el nombre a productosList para evitar confusión
    
    if (this.db) {
      return this.db.executeSql('SELECT * FROM productos', [])
        .then((result) => {
          for (let i = 0; i < result.rows.length; i++) {
            productosList.push({
              nombre: result.rows.item(i).name,
              descripcion: result.rows.item(i).descripcion,
              precio: result.rows.item(i).precio,
              cantidad: result.rows.item(i).cantidad,
            });
          }
          this.productosSubject.next(productosList); // Actualiza el BehaviorSubject
          return productosList;  
        })
        .catch(e => {
          console.error('Error al seleccionar productos', e);
          return Promise.reject(e);
        });
    } else {
      return Promise.reject('Base de datos no inicializada');
    }
  }

  async selectDataByName(nombre: string): Promise<productos | null> {
    if (this.db) {
      const query = 'SELECT * FROM productos WHERE name = ?';
      const result = await this.db.executeSql(query, [nombre]);
      
      if (result.rows.length > 0) {
        const item = result.rows.item(0);
        return {
          nombre: item.name,
          descripcion: item.descripcion,
          precio: item.precio,
          cantidad: item.cantidad
        };
      }
    }
    return null; 
  }

  async updateRecord(nombre: string, descripcion: string, precio: number, cantidad: number) {
    const query = 'UPDATE productos SET descripcion = ?, precio = ?, cantidad = ? WHERE name = ?';
    await this.db.executeSql(query, [descripcion, precio, cantidad, nombre]);
    await this.updateProductInJsonServer({ nombre, descripcion, precio, cantidad }); // Actualiza en JSON Server
    await this.selectData(); // Llama al método que actualiza el BehaviorSubject
  }

   // Nueva función para actualizar en JSON Server
   private async updateProductInJsonServer(producto: productos): Promise<void> {
    try {
      await this.http.put(`${this.apiUrl}/productos/${producto.nombre}`, producto).toPromise();
      console.log('Producto actualizado en JSON Server:', producto);
    } catch (error) {
      console.error('Error al actualizar el producto en JSON Server', error);
    }
  }

  async deleteRecord(nombre: string) {
    const query = 'DELETE FROM productos WHERE name = ?';
    await this.db.executeSql(query, [nombre]);
    await this.deleteProductFromJsonServer(nombre); // Elimina de JSON Server
    await this.selectData(); // Actualiza la lista de productos después de eliminar
  }

  // Nueva función para eliminar en JSON Server
  private async deleteProductFromJsonServer(nombre: string): Promise<void> {
    try {
      await this.http.delete(`${this.apiUrl}/productos/${nombre}`).toPromise();
      console.log('Producto eliminado de JSON Server:', nombre);
    } catch (error) {
      console.error('Error al eliminar el producto de JSON Server', error);
    }
  }

  
}

// Las clases se deben hacer afuera de todo
export class productos {
  public nombre: string;
  public descripcion: string; 
  public precio: number;
  public cantidad: number;
}
