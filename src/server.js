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
  console.log('JSON Server is running on  https://6747cf3538c8741641d7bd62.mockapi.io/api/v1/productos');
  console.log('JSON Server is running on  https://6747cf3538c8741641d7bd62.mockapi.io/api/v1/productos');
});
