const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  libros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro'
  }]
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;