require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

//puerto disponible
const PORT = process.env.PORT || 3006;

//conexion de base
connectDB();

//arranque del servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});

//Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(`Error de servicio: ${err.message}`);
  server.close(() => process.exit(1));
});
