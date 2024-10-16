import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { ClProducto } from '../producto/model/ClProducto';

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private db!: SQLiteConnection;

  private users = [
    { usuario: 'camilo gonzalez', password: 'Cami3740' },
    { usuario: 'alexander patiño', password: 'Alex2024' },
    { usuario: 'juan perez', password: 'Juan2024' },
  ];
  
  private authenticated: boolean = false;

  constructor() {
    this.createDatabase();
    this.db = new SQLiteConnection(CapacitorSQLite);
  }
  
  getUsers() {
    return this.users;
  }

  // Método para simular la autenticación
  isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Método para verificar credenciales
  login(usuario: string, password: string): boolean {
    const user = this.users.find(u => u.usuario === usuario && u.password === password);
    if (user) {
      this.authenticated = true; // Establece el estado de autenticación
      return true;
    }
    return false;
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false; // Resetea el estado de autenticación
  }

  
  createUser(usuario: string, password: string): boolean {
    // Verificar si el usuario ya existe
    const exists = this.users.some(u => u.usuario === usuario);
    if (exists) {
      return false; // Usuario ya existe
    }
    
    // Si no existe, agregar el nuevo usuario
    this.users.push({ usuario, password });
    return true;
  }

  
  

    //creamos nuestra base de datos :v
  async createDatabase() {
    try {
    this.db = new SQLiteConnection(CapacitorSQLite);
    await this.db.open('ecommerce.db');
    console.log("Creamos la base de datos");
    await this.db.execute(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombe TEXT,
      precio INTEGER,
      description TEXT,
      cantidad INTEGER,
      fecha DATE
    )`);
  } catch (error) {
    console.log("Error al crear la base de datos");
    console.log(error);


} }
    
    
  //añadimos productos a la base de datos
  async addProduct(product: ClProducto): Promise<void> {
    await this.db.run(`INSERT INTO productos (nombe, precio, description, cantidad, fecha) VALUES (?, ?, ?, ?, ?)`, [
      product.nombre,
      product.precio,
      product.descripcion,
      product.cantidad,
      product.fecha,
    ]);
  }

  //nos muestra todos los productos
  async getProducts(): Promise<ClProducto[]> {
    const result = await this.db.query('SELECT * FROM productos');
    return result.values as ClProducto[];
  }
  
}


