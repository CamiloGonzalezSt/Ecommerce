const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'https://5d9c-190-153-153-125.ngrok-free.app:3000/', // Reemplaza con la URL de tu aplicación
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

app.use(express.json());

// Rutas de ejemplo
app.get('/productos', (req, res) => {
    // Código para devolver productos
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
