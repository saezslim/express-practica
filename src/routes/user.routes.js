const { createUser, loginUser } = require('../controllers/user.controller')

const router = require('express').Router()

// Crear usuario
router.post('/crear', () => {
  createUser
})
// Login
router.post('/login', (req, res) => loginUser)

module.exports = router