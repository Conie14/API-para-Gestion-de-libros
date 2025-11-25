const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');


// trae info de la api
app.get('/', (req, res) => {
  res.json({
    message: 'API de Gestión de Usuarios y Libros',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      books: '/api/users/:userId/books'
    }
  });
});

//manejo de rutas
app.use('/api/users', userRoutes);
app.use('/api/users', bookRoutes);

//manejo de errores y rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

//middleware para eror
app.use((err, req, res, next) => {
    //log del error
  console.error(err.stack);
    //respuesta de error
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;