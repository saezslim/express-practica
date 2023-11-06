const router = require('express').Router()

// Crear usuario
router.post('/crear', () => {
  res.send('Ruta para crear un user.')
})
// Login
router.post('/login', (req, res) => res.send('Ruta para el login'))

module.exports = router