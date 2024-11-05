const jsonServer = require('json-server');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');


// Ruta personalizada para agregar un producto con un ID string único
server.post('/productos', (req, res) => {
  const nuevoProducto = {
    id: uuidv4(), // Genera un ID como string
    ...req.body
  };
  router.db.get('productos').push(nuevoProducto).write(); // Agrega el producto al JSON
  res.status(201).json(nuevoProducto);
});

const options = {
  key: fs.readFileSync('C:/Users/cajgo/Desktop/server.key'), // Ruta a tu clave privada
  cert: fs.readFileSync('C:/Users/cajgo/Desktop/server.cert') // Ruta a tu certificado
};

const server = jsonServer.create();
const router = jsonServer.router('db/dbProducto.json');
const middlewares = jsonServer.defaults();

// Configuración de CORS
const corsOptions = {
  origin: 'https://a66d-190-153-153-125.ngrok-free.app', // Debe coincidir con la URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.use(cors(corsOptions));
server.use(middlewares);
server.use(router);

// Crear el servidor HTTPS
https.createServer(options, server).listen(3000, () => {
  console.log('JSON Server is running securely on https://a66d-190-153-153-125.ngrok-free.app');
});
