const jsonServer = require('json-server');
const cors = require('cors');
app.use(cors());
const server = jsonServer.create();
const router = jsonServer.router('db/dbProducto.json'); // Ajusta la ruta a tu archivo JSON
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on  http://localhost:3000/ ');
  console.log('JSON Server is running on  http://localhost:3000/ :3000');
});
