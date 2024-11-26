import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductServiceService } from '../producto/product-service.service';
import { MenuController } from '@ionic/angular';
import { Producto } from '../producto/model/producto';



@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private currentUsername: string | null = null;
  private currentIsAdmin: number = 0;
  private db: SQLiteObject;
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  private authenticated: boolean = false;
  private productosUrl = 'https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e'; // URL JSON Server
  private productsSubject = new BehaviorSubject<Producto[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private sqlite: SQLite, private router: Router, private http: HttpClient, private menuCtrl: MenuController) {
    this.init().then(() => {
      this.loadInitialProducts();  // Carga los productos después de inicializar la DB
    });
  }
  

  async init() {
    // Inicializa la base de datos
    try {
      this.db = await this.sqlite.create({
        name: 'mydb.db',
        location: 'default'
      });
      console.log('base de datos creada')
      await this.createTable();
      console.log('tablas creadas')
    } catch(error)  {
      console.log('Error al inicializar la base de datos', error);
    }
  }



  async createTable() {
    try {
      // Crear tabla de productos
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          nombre TEXT, 
          descripcion TEXT, 
          precio REAL, 
          cantidad INTEGER
        )
      `);
      console.log('Tabla "productos" creada exitosamente');
    } catch (error) {
      console.error('Error al crear la tabla "productos":', error);
    }
  
    try {
      // Crear tabla de usuarios
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          username TEXT UNIQUE, 
          mail TEXT UNIQUE, 
          password TEXT, 
          isAdmin INTEGER DEFAULT 0
        )
      `);
      console.log('Tabla "users" creada exitosamente');
    } catch (error) {
      console.error('Error al crear la tabla "users":', error);
    }
  
    try {
      // Crear tabla de carrito
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS cart (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          productoId INTEGER, 
          nombre TEXT, 
          descripcion TEXT, 
          precio REAL, 
          cantidad INTEGER,
          FOREIGN KEY (productoId) REFERENCES productos(id)
        )
      `);
      console.log('Tabla "cart" creada exitosamente');
    } catch (error) {
      console.error('Error al crear la tabla "cart":', error);
    }
  }
  



  public getDBInstance(): Promise<SQLiteObject> {
    return Promise.resolve(this.db);
  }
  // Registro de un nuevo usuario
  public async register(mail: string, username: string, password: string, isAdmin: number) {
    const passwordRegex = /^(?=(?:.*\d){4})(?=(?:.*[a-zA-Z]){3})(?=.*[A-Z]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      alert('La contraseña no cumple con los requisitos. Debe tener al menos 8 caracteres, una letra mayúscula y 4 números.');
      return false;
    }
  
    try {
      const data = [mail, username, password, isAdmin];
      await this.db.executeSql(
        `INSERT INTO users (mail, username, password, isAdmin) VALUES (?, ?, ?, ?)`,
        data
      );
      alert('Usuario registrado correctamente');
      return true;
    } catch (error) {
      alert('Error al registrar el usuario: ' + JSON.stringify(error));
      return false;
    }
  }
  
  

  // Iniciar sesión 
  public async login(username: string, password: string) {
    try {
      const result = await this.db.executeSql(`
        SELECT * FROM users WHERE username = ? AND password = ?
      `, [username, password]);
  
      if (result.rows.length > 0) {
        const user = result.rows.item(0);
  
        if (user.isBlocked === 1) {  // Verifica si el usuario está bloqueado
          alert('Tu cuenta está bloqueada. Contacta con el administrador.');
          return { success: false };
        }
  
        this.currentUsername = user.username;
        this.currentIsAdmin = user.isAdmin; // 1 es admin
  
        if (this.currentIsAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
  
        return { success: true };
      } else {
        alert('Credenciales inválidas');
        return { success: false };
      }
    } catch (error) {
      alert('Error al iniciar sesión');
      return { success: false };
    }
  }
  

  public getUsername(): string | null {
    return this.currentUsername;
  }

  public async getUser(id: number) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const result = await this.db.executeSql(sql, [id]);
    return result.rows.item(0);
  }

  public async updateUserAdminStatus(id: number, isAdmin: number) {
    const sql = 'UPDATE users SET isAdmin = ? WHERE id = ?';
    return this.db.executeSql(sql, [isAdmin, id]);
  }

  public async getAllUsers() {
    try {
      const result = await this.db.executeSql(`SELECT * FROM users`, []);
      const users = [];
      for (let i = 0; i < result.rows.length; i++) {
        users.push(result.rows.item(i));
      }
      return users;
    } catch (error) {
      alert('Error al obtener los users');
      return [];
    }
  }

  public async updateUser(id: number, username: string, isAdmin: number, isBlocked: number) {
    const sql = 'UPDATE users SET username = ?, isAdmin = ? WHERE id = ?';
    await this.db.executeSql(sql, [username, isAdmin ? 1 : 0, isBlocked ? 1 : 0, id]);
}

  public async deleteUser(id: number) {
    const sql = 'DELETE FROM users WHERE id = ?';
    await this.db.executeSql(sql, [id]);
  }

  public async getCurrentUser() {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const result = await this.db.executeSql(sql, [this.currentUsername]);
    return result.rows.item(0);
  }

  public async updateUserProfile(username: string, password: string) {
    const sql = 'UPDATE users SET username = ?, password = ? WHERE username = ?';
    await this.db.executeSql(sql, [username, password, this.currentUsername]);
    this.currentUsername = username;
  }

  public async getUserStatus(userId: number) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const result = await this.db.executeSql(sql, [userId]);
    return result.rows.item(0);
  }

  public async findUserByEmail(mail: string): Promise<any> {
    try {
      const query = 'SELECT * FROM users WHERE mail = ?';
      const result = await this.db.executeSql(query, [mail]);
  
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      return null;
    } catch (error) {
      alert('Error en findUserByEmail: ' + JSON.stringify(error));
      throw error; 
    }
  }

  private async getCurrentUserId(): Promise<number | null> {
    if (!this.currentUsername) {
      return null;
    }
    const result = await this.db.executeSql(
      'SELECT id FROM users WHERE username = ?',
      [this.currentUsername]
    );
    return result.rows.length > 0 ? result.rows.item(0).id : null;
  }

  async updateUsername(newUsername: string) {
    const userId = await this.getCurrentUserId(); // Método que obtiene el ID del usuario actual
    return this.db.executeSql(
      `UPDATE users SET username = ? WHERE id = ?`,
      [newUsername, userId]
    );
  }

  async validateCurrentPassword(currentPassword: string): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    return currentUser?.password === currentPassword; // Compara la contraseña actual con la almacenada
  }
  
  async updatePassword(newPassword: string) {
    const userId = await this.getCurrentUserId(); // Método que obtiene el ID del usuario actual
    return this.db.executeSql(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newPassword, userId]
    );
  }

  async updateProfilePhoto(photo: string) {
    const userId = await this.getCurrentUserId();
    if (userId) {
      const sql = 'UPDATE users SET profilePhoto = ? WHERE id = ?';
      await this.db.executeSql(sql, [photo, userId]);
    }
  }
  
  async getCurrentProfilePhoto(): Promise<string | null> {
    const user = await this.getCurrentUser();
    return user?.profilePhoto || null;
  }

  async deleteProfilePhoto() {
    const userId = await this.getCurrentUserId();
    if (userId) {
      const sql = 'UPDATE users SET profilePhoto = NULL WHERE id = ?';
      await this.db.executeSql(sql, [userId]);
    }
  }



// CARRITO DE COMPRAS ////////////////////////////////////////////////////////

public async addToCart(producto: any) {
  try {
    // Verificar si el producto ya está en el carrito
    const result = await this.db.executeSql(
      `SELECT * FROM cart WHERE productoId = ?`,
      [producto.id]
    );

    if (result.rows.length > 0) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      const currentItem = result.rows.item(0);
      const nuevaCantidad = currentItem.cantidad + 1;
      await this.db.executeSql(
        `UPDATE cart SET cantidad = ? WHERE productoId = ?`,
        [nuevaCantidad, producto.id]
      );
      console.log('Cantidad actualizada en el carrito');
    } else {
      // Si el producto no está en el carrito, agregarlo
      await this.db.executeSql(
        `INSERT INTO cart (productoId, nombre, descripcion, precio, cantidad) 
         VALUES (?, ?, ?, ?, ?)`,
        [producto.id, producto.nombre, producto.descripcion, producto.precio, 1]
      );
      console.log('Producto agregado al carrito');
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
  }
}


public async getCartItems(): Promise<any[]> {
  try {
    const result = await this.db.executeSql('SELECT * FROM cart', []);
    const cartItems = [];
    for (let i = 0; i < result.rows.length; i++) {
      cartItems.push(result.rows.item(i));
    }
    return cartItems;
  } catch (error) {
    alert('Error al obtener los productos del carrito: ' + JSON.stringify(error));
    return [];
  }
}

public async removeFromCart(productoId: number) {
  try {
    await this.db.executeSql('DELETE FROM cart WHERE productoId = ?', [productoId]);
    alert('Producto eliminado del carrito');
  } catch (error) {
    alert('Error al eliminar el producto del carrito: ' + JSON.stringify(error));
  }
}






async loadInitialProducts() {
  try {
    const localProducts = await this.getLocalProducts();
    const serverProducts = await this.getProductsFromServer();
    
    const combinedProducts = [
      ...localProducts,
      ...serverProducts.filter(sp => !localProducts.some(lp => lp.id === sp.id))
    ];
    
    this.productsSubject.next(combinedProducts);
  } catch (error) {
    console.error('Error al cargar productos iniciales:', error);
  }
}


async getProductsFromServer(): Promise<Producto[]> {
  try {
    const response = await fetch('https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e');
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos del servidor:', error);
    return [];
  }
}


async createProductInDb(producto: Producto): Promise<void> {
  try {
    const existingProduct = await this.db.executeSql(`SELECT * FROM productos WHERE id = ?`, [producto.id]);
    if (existingProduct.rows.length > 0) {
      console.warn('El producto ya existe en la base de datos.');
      return; // Evita duplicados
    }

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
    await this.http.post<Producto>("https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e", producto).toPromise();

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

async syncLocalAndServerData(): Promise<void> {
  try {
    const localProducts = await this.getLocalProducts();
    const serverProducts = await this.getProductsFromServer();

    // Agregar productos que no estén en el servidor
    const unsyncedProducts = localProducts.filter(lp => 
      !serverProducts.some(sp => sp.id === lp.id)
    );

    for (const product of unsyncedProducts) {
      await this.http.post(this.productosUrl, product).toPromise();
    }

    // Actualizar base local con datos del servidor
    for (const product of serverProducts) {
      await this.createProductInDb(product);
    }

    console.log('Sincronización completada.');
  } catch (error) {
    console.error('Error durante la sincronización:', error);
  }
}


async syncWithTransaction(): Promise<void> {
  try {
    await this.db.transaction(async tx => {
      const serverProducts = await this.getProductsFromServer();
      
      for (const product of serverProducts) {
        tx.executeSql(
          `INSERT OR REPLACE INTO productos (id, nombre, descripcion, precio, cantidad) 
           VALUES (?, ?, ?, ?, ?)`,
          [product.id, product.nombre, product.descripcion, product.precio, product.cantidad]
        );
      }
    });

    console.log('Sincronización con transacción completada.');
  } catch (error) {
    console.error('Error en la transacción:', error);
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
  async deleteProduct(productId: number): Promise<void> {
    try {
        // Convertir el ID a número para SQLite
        //const id = Number(productId);

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

 

  
///////////////////////////////////////////////////

  generateToken(usuario: string): string {
    return btoa(`${usuario}:${new Date().getTime()}`);
  }

  async logout() {
    // Cierra el menú lateral y espera a que termine antes de navegar
  this.menuCtrl.close().then(() => {
    this.router.navigate(['/login']);
  }).catch(error => {
    console.error('Error al cerrar el menú:', error);
    this.router.navigate(['/login']); // Asegurarte de navegar incluso si falla el cierre del menú
  });
  }


  isAuthenticated(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  }
}