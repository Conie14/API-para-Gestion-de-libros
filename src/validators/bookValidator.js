const { body } = require('express-validator');


//para crear libro
exports.createBookValidation = [
    //valido titulo
  body('titulo')
    .trim()
    //verifico que no este vacio
    .notEmpty().withMessage('El titulo del libro es obligatorio')
    //valida titulo minimo de caracteres
    .isLength({ min: 4 }).withMessage('El título debe tener al menos 4 caracter'),
  
    //valido autor
  body('autor')
    .trim()
    //verifico que no este vacio
    .notEmpty().withMessage('El autor es obligatorio')
    //valida autor minimo de caracteres
    .isLength({ min: 2 }).withMessage('El nombre del autor debe tener al menos 2 caracteres')
];

//para actualizar libro

exports.updateBookValidation = [
    //valido titulo
  body('titulo')
    .optional()
    .trim()
    //verifico que no este vacio
    .notEmpty().withMessage('El título no puede estar vacío')
    .isLength({ min: 1 }).withMessage('El título debe tener al menos 1 carácter'),
  
    //valido autor
  body('autor')
    .optional()
    .trim()
    //verifico que no este vacio
    .notEmpty().withMessage('El autor no puede estar vacío')
    //valida autor minimo de caracteres
    .isLength({ min: 2 }).withMessage('El nombre del autor debe tener al menos 2 caracteres')
];

//para eliminar libro
exports.deleteBookValidation = [
    //valido id de libro
    body('id')
    .trim()
    // verifico que no este vacio
    .notEmpty().withMessage('El ID del libro es obligatorio')
    //verifico que sea un id valido de mongo
    .isMongoId().withMessage('El ID del libro debe ser un ID valido en la base de datos')
];
