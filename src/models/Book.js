const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título del libro es obligatorio'],
    trim: true,
    minlength: [1, 'El título debe tener al menos 1 carácter']
  },
  autor: {
    type: String,
    required: [true, 'El nombre del autor es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre del autor debe tener al menos 2 caracteres']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  }
}, {
  timestamps: true
});

bookSchema.index({ userId: 1, titulo: 1, autor: 1 }, { unique: true });

const Book = mongoose.model('Libro', bookSchema);

module.exports = Book;