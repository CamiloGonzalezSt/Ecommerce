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
  console.log('JSON Server is running on  https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e');
  console.log('JSON Server is running on  https://api.jsonbin.io/v3/b/6745f1a6ad19ca34f8d0c54e');
});
