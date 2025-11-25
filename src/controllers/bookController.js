const Book = require('../models/Book');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getUserBooks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const books = await Book.find({ userId }).select('-__v');

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
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
      message: 'Error al obtener libros del usuario',
      error: error.message
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, userId }).select('-__v');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado para este usuario'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al obtener el libro',
      error: error.message
    });
  }
};

exports.createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { userId } = req.params;
    const { titulo, autor } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const existingBook = await Book.findOne({ userId, titulo, autor });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Este libro ya está registrado para el usuario'
      });
    }

    const book = await Book.create({
      titulo,
      autor,
      userId
    });

    user.libros.push(book._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Libro creado exitosamente',
      data: book
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Este libro ya está registrado para el usuario'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear el libro',
      error: error.message
    });
  }
};

exports.updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { userId, bookId } = req.params;
    const { titulo, autor } = req.body;

    const book = await Book.findOne({ _id: bookId, userId });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado para este usuario'
      });
    }

    if (titulo || autor) {
      const duplicateBook = await Book.findOne({
        userId,
        titulo: titulo || book.titulo,
        autor: autor || book.autor,
        _id: { $ne: bookId }
      });

      if (duplicateBook) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro libro con este título y autor para el usuario'
        });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { titulo, autor },
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Libro actualizado exitosamente',
      data: updatedBook
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe otro libro con este título y autor para el usuario'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el libro',
      error: error.message
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    const book = await Book.findOne({ _id: bookId, userId });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Libro no encontrado para este usuario'
      });
    }

    await Book.findByIdAndDelete(bookId);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { libros: bookId } }
    );

    res.status(200).json({
      success: true,
      message: 'Libro eliminado exitosamente'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el libro',
      error: error.message
    });
  }
};