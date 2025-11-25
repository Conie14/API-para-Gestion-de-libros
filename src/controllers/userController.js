const User = require('../models/User');
const Book = require('../models/Book');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res) => {
  try {
    //respuesta bien
    const users = await User.find().select('-__v').populate('libros', 'titulo autor');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    //retornamos error
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    //console.log(req.params.id);
    //console.log('Conexión establecida.');
    const user = await User.findById(req.params.id).select('-__v').populate('libros', 'titulo autor');
    
    if (!user) {
        //error de usuario no encontrado
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    //respuesta bien 
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    ///objeto
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { nombre, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    //crear usuario 
    //agrego await para esperar la promesa porque es asincronica
    const user = await User.create({ nombre, email });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { nombre, email } = req.body;

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { nombre, email },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await Book.deleteMany({ userId: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Usuario y sus libros eliminados exitosamente'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};