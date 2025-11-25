const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { createBookValidation, updateBookValidation } = require('../validators/bookValidator');

router.get('/:userId/books', bookController.getUserBooks);
router.get('/:userId/books/:bookId', bookController.getBookById);
router.post('/:userId/books', createBookValidation, bookController.createBook);
router.put('/:userId/books/:bookId', updateBookValidation, bookController.updateBook);
router.delete('/:userId/books/:bookId', bookController.deleteBook);

module.exports = router;