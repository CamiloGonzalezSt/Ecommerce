const jsonServer = require('json-server');
const http = require('http'); // Cambia https a http
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Crear el servidor JSON
const server = jsonServer.create();
const router = jsonServer.router('db/dbProducto.json');
const middlewares = jsonServer.defaults();

// Ruta personalizada para agregar un producto con un ID string único
server.post('/productos', (req, res) => {
  const nuevoProducto = {
    id: uuidv4(), // Genera un ID como string
    ...req.body
  };
  router.db.get('productos').push(nuevoProducto).write(); // Agrega el producto al JSON
  res.status(201).json(nuevoProducto);
});

// Configuración de CORS
const corsOptions = {
  origin: 'http://192.168.10.20:8100', // Cambia esto a la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.use(cors(corsOptions));
server.use(middlewares);
server.use(router);

// Crear el servidor HTTP
http.createServer(server).listen(3000, () => {
  console.log('JSON Server is running on http://192.168.10.20:3000');
});
