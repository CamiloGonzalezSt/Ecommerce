import { Injectable, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductServiceService } from '../producto/product-service.service';
import { MenuController } from '@ionic/angular';
import { Producto } from '../producto/model/producto';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { query, collection, getDocs, orderBy, limit, DocumentSnapshot  } from 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class SqliteService  implements OnInit {
  private currentUsername: string | null = null;
  private currentIsAdmin: number = 0;
  private db: SQLiteObject;
  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();
  private authenticated: boolean = false;
  private productosUrl = 'https://6747cf3538c8741641d7bd62.mockapi.io/api/v1/productos'; // URL JSON Server
  private productsSubject = new BehaviorSubject<Producto[]>([]);
  products$ = this.productsSubject.asObservable();
  private _storage: Storage | null = null;


  constructor(private sqlite: SQLite, private router: Router, private http: HttpClient, private menuCtrl: MenuController,private firestore: AngularFirestore) {
    this.resetDatabase().then(() => {
      this.loadInitialProducts();  // Carga los productos después de inicializar la DB
    });
  }
  
  ngOnInit() {
    
  }


  // Método para eliminar la base de datos y luego volver a crearla
  private async resetDatabase() {
    try {
      // Eliminar la base de datos si ya existe
      await this.deleteDatabase();
      console.log('Base de datos eliminada');
      
      // Inicializar la base de datos de nuevo
      await this.init();
    } catch (error) {
      console.log('Error al resetear la base de datos', error);
    }
  }

  // Eliminar la base de datos del sistema de archivos
  private async deleteDatabase() {
    try {
      // Obtener el path del archivo de la base de datos
      const dbPath = await Filesystem.getUri({
        directory: Directory.Data,
        path: 'mydb.db'
      });

      // Eliminar el archivo de la base de datos
      await Filesystem.deleteFile({
        directory: Directory.Data,
        path: 'mydb.db'
      });
      console.log('Archivo de base de datos eliminado:', dbPath.uri);
    } catch (error) {
      console.error('Error al eliminar el archivo de la base de datos', error);
    }
  }

  // dbService
async init() {
  try {
    this.db = await this.sqlite.create({
      name: 'database.db',
      location: 'default'
    });
    console.log('Base de datos creada');
    await this.createTable();
    console.log('Tablas creadas');
    return this.db; // Asegúrate de devolver la instancia de la base de datos
  } catch (error) {
    console.log('Error al inicializar la base de datos', error);
    throw new Error('Error al inicializar la base de datos');
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
        cantidad INTEGER,
        imagen TEXT,
        categoria TEXT
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
  public async login(username: string, password: string): Promise<{ success: boolean }> {
    try {
      // Verificar las credenciales en la base de datos SQLite
      const result = await this.db.executeSql(
        `SELECT * FROM users WHERE username = ? AND password = ?`,
        [username, password]
      );
  
      // Si se encuentra el usuario
      if (result.rows.length > 0) {
        const user = result.rows.item(0);
  
        // Guardar la información del usuario en variables locales
        this.currentUsername = user.username;
        this.currentIsAdmin = user.isAdmin;
  
        // Generar el token (igual que en tu primer login)
        const token = this.generateToken(username);
  
        // Guardar token y estado de autenticación en localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username); // opcional, si quieres guardar el usuario actual
  
        // Redirigir según el rol del usuario
        if (this.currentIsAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
  
        return { success: true };
      } else {
        // Si no se encuentra el usuario o las credenciales son incorrectas
        alert('Credenciales inválidas');
        return { success: false };
      }
    } catch (error) {
      // En caso de un error en la base de datos
      alert('Error al iniciar sesión');
      return { success: false };
    }
  }
  
  
  
  
  

  public async getUsername(): Promise<string | null> {
    const { value } = await Storage.get({ key: 'user' });
    if (value) {
      const user = JSON.parse(value);
      return user.username;
    } else {
      return null;
    }
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
    // Obtiene los productos de Firestore
    const productsSnapshot = await this.firestore.collection('productos').get().toPromise();

    // Verifica si el snapshot es undefined o null
    if (!productsSnapshot) {
      throw new Error('No se pudo obtener la información de los productos.');
    }

    // Accede a los docs dentro del QuerySnapshot
    const productsList = productsSnapshot.docs.map(doc => doc.data() as Producto);

    return productsList;
  } catch (error) {
    console.error('Error al obtener productos desde Firestore:', error);
    return [];  // Devolver lista vacía si hay un error
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
  try {
    const result = await this.db.executeSql('SELECT * FROM productos', []);
    const productos: Producto[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      productos.push(result.rows.item(i));
    }
    return productos;
  } catch (error) {
    console.error('Error al obtener productos locales:', error);
    return [];
  }
}


// Función para obtener el último producto por id
async getLastProductId(): Promise<number> {
  try {
    // Obtener todos los productos ordenados por 'id' de mayor a menor
    const productosSnapshot = await this.firestore
      .collection('productos', (ref) => ref.orderBy('id', 'desc').limit(1))
      .get()
      .toPromise();

    // Verificar si productosSnapshot es válido y tiene documentos
    if (!productosSnapshot || productosSnapshot.empty) {
      return 1; // Si no hay productos, asignamos id 1
    }

    // Si hay productos, obtener el último producto
    const lastProduct = productosSnapshot.docs[0].data() as Producto;
    return lastProduct.id + 1; // Incrementar el último id
  } catch (error) {
    console.error('Error al obtener el último producto', error);
    throw new Error('Error al obtener el último producto');
  }
}

// Función para crear un nuevo producto
async createProduct(producto: Producto): Promise<void> {
  try {
    // Obtener el próximo id para el producto
    const newId = await this.getLastProductId();

    // Crear una nueva referencia para el producto
    const productRef = this.firestore.collection('productos').doc();

    // Guardar el producto en Firestore con el nuevo id
    await productRef.set({
      id: newId,  // Usar el id incrementado
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      cantidad: producto.cantidad,
      imagen: producto.imagen,
      categoria: producto.categoria,
    });

    console.log('Producto añadido a Firestore con id:', newId);
  } catch (error) {
    console.error('Error al crear producto en Firestore:', error);
  }
}


async syncProductsFromServer() {
  const serverProducts = await this.getProductsFromServer();
  
  for (const producto of serverProducts) {
    await this.createProductInDb(producto);  // Guardar en SQLite
  }

  // Refresca la lista de productos
  this.productsSubject.next(await this.getLocalProducts());
}


async syncLocalAndServerData(): Promise<void> {
  try {
    const localProducts = await this.getLocalProducts();
    const serverProducts = await this.getProductsFromServer();

    // Agregar productos que no estén en Firestore
    const unsyncedProducts = localProducts.filter(lp => 
      !serverProducts.some(sp => sp.id === lp.id)
    );

    for (const product of unsyncedProducts) {
      await this.firestore.collection('productos').add(product);  // Agregar a Firestore
    }

    // Actualizar base local con datos de Firestore
    for (const product of serverProducts) {
      await this.createProductInDb(product);  // Actualizar en SQLite
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
          `INSERT OR REPLACE INTO productos (id, nombre, descripcion, precio, cantidad, imagen, categoria) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [product.id, product.nombre, product.descripcion, product.precio, product.cantidad, product.imagen, product.categoria]
        );
      }
    });

    console.log('Sincronización con transacción completada.');
  } catch (error) {
    console.error('Error en la transacción:', error);
  }
}


  // Actualizar producto en ambos (SQLite y JSON Server)
  async updateProduct(id: number, producto: Producto): Promise<void> {
    try {
      // Verificar que los campos no sean undefined
      const updatedProduct = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidad: producto.cantidad,
        categoria: producto.categoria,
        imagen: producto.imagen
      };
  
      // Solo agregar el campo 'imagen' si está definido
      if (producto.imagen !== undefined) {
        updatedProduct.imagen = producto.imagen;
      }
  
      // Referencia al documento del producto en Firestore por su id
      const productRef = this.firestore.collection('productos').doc(id.toString());
  
      // Actualizar el producto en Firestore
      await productRef.update(updatedProduct);
  
      console.log('Producto actualizado en Firestore con id:', id);
    } catch (error) {
      console.error('Error al actualizar producto en Firestore:', error);
    }
  }
  
  
  

  // Eliminar producto en ambos (SQLite y JSON Server)
  async deleteProduct(productId: number): Promise<void> {
    try {
      // Eliminar en SQLite
      await this.db.executeSql(`DELETE FROM productos WHERE id = ?`, [productId]);
  
      // Eliminar en Firestore
      const productRef = this.firestore.collection('productos').doc(productId.toString());
      await productRef.delete();
  
      // Refresca la lista de productos
      this.productsSubject.next(await this.getLocalProducts());
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }
  


  async getProducts(): Promise<Producto[]> {
    try {
      // Obtener los productos de Firestore (esperamos la promesa)
      const productsSnapshot = await this.firestore.collection('productos').get().toPromise();
  
      // Verificar si la respuesta es válida
      if (!productsSnapshot) {
        throw new Error('No se pudo obtener la información de los productos.');
      }
  
      // Acceder a los documentos de Firestore
      const productos: Producto[] = productsSnapshot.docs.map((doc) => {
        // Definir explícitamente el tipo de 'doc' para que TypeScript lo reconozca
        const productoData = doc.data() as Producto;  // Asegúrate de que doc.data() es del tipo Producto
        return productoData;
      });
  
      this.productsSubject.next(productos);  // Emitir los productos
      return productos;
    } catch (error) {
      console.error('Error al obtener productos desde Firestore:', error);
      return [];  // Devuelve lista vacía en caso de error
    }
  }
  

  






/// aparte

isAuthenticated(): boolean {
  const isAuth = localStorage.getItem('isAuthenticated');
  return isAuth === 'true';
}

generateToken(usuario: string): string {
  return btoa(`${usuario}:${new Date().getTime()}`);
}

logout() {
  this.authenticated = false;
  localStorage.removeItem('authenticated');
  localStorage.removeItem('auth_token');
  this.router.navigate(['/login']);
}

}