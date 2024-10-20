import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs'; // Importar BehaviorSubject
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject} from '@awesome-cordova-plugins/sqlite/ngx'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private apiUrl = environment.apiUrl;
  private db: SQLiteObject;
  private usersSubject = new BehaviorSubject<any[]>([]); // Observable para la lista de usuarios}
  users$ = this.usersSubject.asObservable(); // Exponer el observable
  private authenticated: boolean = false;
 


  // Inicializa con algunos usuarios
  constructor(private router: Router, private http: HttpClient, private sqlite: SQLite) {
    this.init();
    this.loadInitialUsers(); 
  }


  async init() {
    await this.createOpenDatabase(); // Asegurarse de que la base de datos esté abierta
    await this.createTable(); // Crear tabla si no existe

  }

  // Método para verificar la conexión al JSON Server
  async checkServerConnection() {
    this.http.get(this.apiUrl).subscribe(
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
      await this.db.executeSql(`INSERT INTO usuarios (usuario, password) VALUES (?, ?)`, [
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
  //aqui creamos la base de datos
  async createOpenDatabase() {
    try {
      this.db = await this.sqlite.create({
        name: 'data.db',
        location: 'default'
      });
      console.log('Base de datos creada');
    } catch (err) {
      console.error('Error al crear la base de datos', err);
    }
  }
 
 
// aqui vamos a crear la tabla con los atributos que necesitemos para esta pagina
async createTable() {
  try {
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS productos (
        name VARCHAR(30),
        descripcion VARCHAR(100),
        precio REAL,
        cantidad INTEGER
      )`, []);
    console.log('Tabla creada');
  } catch (e) {
    console.error('Error al crear la tabla', e);
  }
}
 

// Insertar un producto
async insertData(nombreProducto: string, descripcion: string, precio: number, cantidad: number) {
  const query = 'INSERT INTO productos (name, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)';
  await this.db.executeSql(query, [nombreProducto, descripcion, precio, cantidad]);
}

async ejecutData(query: string, params: any[] = []): Promise<any> {
  try {
    if (!this.db) {
      throw new Error('Base de datos no inicializada');
    }
    return await this.db.executeSql(query, params);
  } catch (error) {
    console.error('Error al ejecutar consulta SQL', error);
    throw error;
  }
}

 // Seleccionar todos los productos
 async selectData(): Promise<productos[]> {
  const productosList: productos[] = [];
  const result = await this.db.executeSql('SELECT * FROM productos', []);
  for (let i = 0; i < result.rows.length; i++) {
    productosList.push({
      nombreProducto: result.rows.item(i).name,
      descripcion: result.rows.item(i).descripcion,
      precio: result.rows.item(i).precio,
      cantidad: result.rows.item(i).cantidad,
    });
  }
  return productosList;
}


// Actualizar un producto
async updateRecord(nombreProducto: string, descripcion: string, precio: number, cantidad: number) {
  const query = 'UPDATE productos SET descripcion = ?, precio = ?, cantidad = ? WHERE name = ?';
  await this.db.executeSql(query, [descripcion, precio, cantidad, nombreProducto]);
}

// Eliminar un producto
async deleteRecord(nombreProducto: string) {
  const query = 'DELETE FROM productos WHERE name = ?';
  await this.db.executeSql(query, [nombreProducto]);
}
}




//las clases se deben hacer afuera de todo
class productos{
public  nombreProducto: string;
public descripcion: string; 
public precio: number;
public cantidad: number;

}



