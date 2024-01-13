// authRoutes.js
const express = require('express'); 
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login); 
router.post('/register', authController.register);

// router.post('/autores', crudAutores);
// router.post('/libros', crudLibros);

module.exports = router;