const { body } = require('express-validator');
//para crear usuario
exports.createUserValidation = [
    //valido nombre
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
    //valido correo
  body('email')
    .trim()
    //si esta vacio
    .notEmpty().withMessage('El correo es obligatorio')
    //si no es correo
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail()
];

//para actualizar usuario
exports.updateUserValidation = [
    //valido nombre
  body('nombre')
    .optional()
    .trim()
    //si esta vacio
    .notEmpty().withMessage('El nombre no puede estar vacio')
    //valor minimo de caracteres para el nombre
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('email')
    .optional()
    .trim()
    //si esta vacio
    .notEmpty().withMessage('El correo no puede estar vacío')
    //si no es correo
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail()
];

//para eliminar usuario
exports.deleteUserValidation = [
    //valido id de usuario
    body('id')
    .trim()
    .notEmpty().withMessage('El ID de usuario es obligatorio')
    .isMongoId().withMessage('El ID de usuario debe ser un ID valido en la base de datos')
];


