import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { ClProducto } from '../producto/model/ClProducto';
import axios from 'axios';


@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  [x: string]: any;
  private db!: SQLiteConnection;

  private users = [
    { usuario: 'camilo gonzalez', password: 'Cami3740' },
    { usuario: 'alexander patiño', password: 'Alex2024' },
  ];

  private authenticated: boolean = false;

  constructor() {
    this.init();

  }



  // Método init que incluye la creación de la base de datos
  async init() {
    try {
      // Abre la conexión con la base de datos
      this.db = new SQLiteConnection(CapacitorSQLite); // Inicializa la conexión SQLite
      await this.db.open('ecommerce.db');
      console.log('Base de datos abierta correctamente');

      // Crear la tabla de productos si no existe
      await this.createDatabase();
    } catch (error) {
      console.log('Error durante la inicialización de la base de datos', error);
    }
  }

  // Crear la base de datos
  private async createDatabase() {
    try {
      await this.db.execute(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        precio INTEGER,
        description TEXT,
        cantidad INTEGER,
        fecha DATE
      )`);
      console.log("Tabla productos creada");
    } catch (error) {
      console.log("Error al crear la base de datos", error);
    }
  }

  // Añadir productos a la base de datos
  async addProduct(product: ClProducto): Promise<void> {
    try {
      await this.db.run(`INSERT INTO productos (nombre, precio, description, cantidad, fecha) VALUES (?, ?, ?, ?, ?)`, [
        product.nombre,
        product.precio,
        product.descripcion,
        product.cantidad,
        product.fecha,
      ]);
      console.log("Producto añadido:", JSON.stringify(product));

      // Sincronizar después de agregar el producto
      await this.syncWithJsonServer(); 
    } catch (error) {
      console.log('Error al agregar producto a la base de datos', error);
    }
  }

  // Obtener todos los productos
  async getProducts(): Promise<ClProducto[]> {
    try {
      const result = await this.db.query('SELECT * FROM productos');
      return result.values as ClProducto[];
    } catch (error) {
      console.log('Error al obtener productos', error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  }

  // Sincronizar productos con JSON Server
  async syncWithJsonServer() {
    try {
      const products = await this.getProducts(); 
      const syncPromises = products.map(product =>
        axios.post('http://10.0.2.2:3000/products', product)
      );
      await Promise.all(syncPromises);
      console.log('Sincronización completa con JSON Server');
    } catch (error) {
      console.error('Error al sincronizar con JSON Server', error);
    }
  }

  // Sincronizar usuarios con JSON Server
  async syncUsersWithJsonServer() {
    try {
      const users = this.getUsers(); 
      const syncPromises = users.map(user =>
        axios.post('http://10.0.2.2:3000/users', user)
      );
      await Promise.all(syncPromises);
      console.log('Sincronización de usuarios completa');
    } catch (error) {
      console.error('Error al sincronizar usuarios con JSON Server', error);
    }
  }

  getUsers() {
    return this.users;
  }

  // Método para verificar el estado de autenticación
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Método para verificar credenciales
  login(usuario: string, password: string): string | null {
    const user = this.users.find(u => u.usuario === usuario && u.password === password);
    if (user) {
      this.authenticated = true; // Establecer el estado de autenticación
      localStorage.setItem('authenticated', 'true'); // Guardar el estado en localStorage
      return 'generated_token'; // Reemplazar por el token real
    }
    return null; // Devuelve null si las credenciales son incorrectas
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false; 
    localStorage.removeItem('authenticated'); 
  }

  // Crear un nuevo usuario
  createUser(usuario: string, password: string): boolean {
    const exists = this.users.some(u => u.usuario === usuario);
    if (exists) {
      return false; // El usuario ya existe
    }

    this.users.push({ usuario, password }); // Agregar nuevo usuario
    return true;
  }

   // Actualiza un producto en la base de datos
   async updateProduct(id: number, product: ClProducto): Promise<void> {
    try {
        await this.db.run(`UPDATE productos SET nombre = ?, precio = ?, description = ?, cantidad = ?, fecha = ? WHERE id = ?`, [
            product.nombre,
            product.precio,
            product.descripcion,
            product.cantidad,
            product.fecha,
            id,
        ]);
        console.log(`Producto con id ${id} actualizado`);

      
      // Sincronizar después de actualizar el producto
      await this.syncWithJsonServer();
    } catch (error) {
      console.log('Error al actualizar el producto en la base de datos', error);
    }
  }

  // Elimina un producto de la base de datos
  async deleteProduct(id: number): Promise<void> {
    try {
      await this.db.run(`DELETE FROM productos WHERE id = ?`, [id]);
      console.log(`Producto con id ${id} eliminado`);
      
      // Sincronizar después de eliminar el producto
      await this.syncWithJsonServer();
    } catch (error) {
      console.log('Error al eliminar el producto de la base de datos', error);
    }
  }

 }
