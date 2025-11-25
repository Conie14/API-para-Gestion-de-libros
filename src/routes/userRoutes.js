const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { createUserValidation, updateUserValidation } = require('../validators/userValidator');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', createUserValidation, userController.createUser);
router.put('/:id', updateUserValidation, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;