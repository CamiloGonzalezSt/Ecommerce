import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { ClProducto } from '../producto/model/ClProducto';
import axios from 'axios';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'; // Importar BehaviorSubject
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private apiUrl = 'http://10.0.2.2:3000/users';
  private db!: SQLiteConnection;
  private usersSubject = new BehaviorSubject<any[]>([]); // Observable para la lista de usuarios
  users$ = this.usersSubject.asObservable(); // Exponer el observable
  private authenticated: boolean = false;

  // Inicializa con algunos usuarios
  constructor(private router: Router, private http: HttpClient) {
    this.init();
    this.loadInitialUsers(); // Cargar usuarios iniciales
  }

  async init() {
    try {
      this.db = new SQLiteConnection(CapacitorSQLite);
      await this.db.open('ecommerce.db');
      console.log('Base de datos abierta correctamente');
      await this.createDatabase();
    } catch (error) {
      console.log('Error durante la inicialización de la base de datos', error);
    }
  }
  // Método para verificar la conexión al JSON Server
  async checkServerConnection() {
    this.http.get('http://10.0.2.2:3000/users').subscribe(
      (data) => {
        console.log('Datos obtenidos del JSON Server:', data);
        alert('Datos obtenidos: ' + JSON.stringify(data));
      },
      (error) => {
        console.error('Error al conectarse al JSON Server', error);
        alert('No se pudo conectar al JSON Server');
      }
    );
  }


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

  private loadInitialUsers() {
    // Cargar usuarios iniciales al BehaviorSubject
    this.usersSubject.next([
      { usuario: 'camilo gonzalez', password: 'Cami3740' },
      { usuario: 'alexander patiño', password: 'Alex2024' },
    ]);
  }

  // Método para añadir un nuevo usuario
   async createUser(usuario: string, password: string): Promise  <boolean> {
    const exists = this.usersSubject.getValue().some(u => u.usuario === usuario);
    if (exists) {
      return false; // El usuario ya existe
    }

    const newUser = { usuario, password };
    const currentUsers = this.usersSubject.getValue();
    currentUsers.push(newUser); // Agregar nuevo usuario
    this.usersSubject.next(currentUsers); // Actualizar el observable

    await this.saveUserToDb(newUser); // Guardar el usuario en la base de datos

    return true;
  }

  // Método para guardar el usuario en la base de datos
  private async saveUserToDb(user: any): Promise<void> {
    try {
      await this.db.run(`INSERT INTO usuarios (usuario, password) VALUES (?, ?)`, [
        user.usuario,
        user.password,
      ]);
      console.log('Usuario guardado en la base de datos:', user);
    } catch (error) {
      console.log('Error al guardar el usuario en la base de datos', error);
    }
  }

  // Obtener la lista de usuarios
  getUsers() {
    return this.usersSubject.getValue();
  }

  // Método para verificar el estado de autenticación
  isAuthenticated(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }

  // Método para verificar credenciales
  login(usuario: string, password: string): string | null {
    const user = this.usersSubject.getValue().find(u => u.usuario === usuario && u.password === password);
    
    if (user) {
      this.authenticated = true;
      const token = this.generateToken(usuario);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('isAuthenticated', 'true');
      return token;
    }
    
    return null; // Devuelve null si las credenciales son incorrectas
  }

  // Método para generar un token
  generateToken(usuario: string): string {
    return btoa(`${usuario}:${new Date().getTime()}`);
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false;
    localStorage.removeItem('authenticated');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
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
        this.http.post(this.apiUrl, user).toPromise() // Llamar al apiUrl
      );
      await Promise.all(syncPromises);
      console.log('Sincronización de usuarios completa');
    } catch (error) {
      console.error('Error al sincronizar usuarios con JSON Server', error);
    }
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

  updateUser(updatedUser: any) {
    const currentUsers = this.usersSubject.getValue();
    const index = currentUsers.findIndex(user => user.usuario === updatedUser.usuario);
    
    if (index !== -1) {
      currentUsers[index] = updatedUser; // Actualiza el usuario
      this.usersSubject.next(currentUsers); // Actualiza el observable
      this.saveUserToDb(updatedUser); // Guarda el usuario en la base de datos (implementa esta lógica si es necesario)
    }
  }
// Obtener usuarios desde el servidor (usando apiUrl)
getUsersFromApi() {
  this.http.get<any[]>(this.apiUrl).subscribe(
    (users) => {
      this.usersSubject.next(users); // Actualiza el observable con los usuarios obtenidos
      console.log('Usuarios obtenidos desde el API:', users);
    },
    (error) => {
      console.log('Error al obtener usuarios desde el API', error);
    }
  );
}

// Guardar un usuario en el servidor (usando apiUrl)
addUserToApi(user: any) {
  this.http.post(this.apiUrl, user).subscribe(
    (response) => {
      console.log('Usuario guardado en el servidor:', response);
    },
    (error) => {
      console.log('Error al guardar el usuario en el servidor', error);
    }
  );
}
  

}
