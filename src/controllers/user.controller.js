const bcrypt = require('bcrypt')
const { generarJWT } = require("../services/generar-jwt");
const User = require('../models/user.model')

const createUser = async (req, res) => {

  const {name, lastName, email, password} = req.body

  if(!name || !lastName || !email || !password){
    return res.status(404).json({
      msg: "Todos los campos son requeridos",
      status: 404,
    })
  }

  try{
    const salt = bcrypt.genSaltSync()

    await User.create({
      //id: Schema.Types.UUID,
      name: name,
      lastName: lastName,
      email: email,
      password: bcrypt.hashSync(password,salt),
    })
    res.status(201).json({
      msg: "Usuario creado.",
      status: 500
    })
  } catch(err){
    console.log(err)
    res.status(500).json({
      msg: "Error al crear el usuario.",
      status: 500
    })
  }

}

const loginUser = async (req , res) => {
  const {email, password} = req.body
  if(!email,!password){
    return res.status(404).json({
      msg: "Todos los campos son requeridos.",
      status: 404
    })
  }
  try{
    const findUser = await User.findOne({email:email})
    if(!findUser){
      return res.status(404).json({
        msg: `Usuario con email ${email} no encontrado`,
        status: 404
      })
    }
    if(findUser.status !== 'active'){
      return res.status(404).json({
        msg: `Usuario con email ${email} no activo en el sistema.`,
        status: 404
      })
    }
    // Verificar pass
    const passVerify = bcrypt.compareSync(password, findUser.password)  
    if(!passVerify){
      return res.status(404).json({
        msg: `Contrasenna incorrecta.`,
        status: 404
      })
    }
    const token = await generarJWT(findUser._id)
    res.status(200).json({
      msg: `Usuario con email ${email} logueado correctamente.`,
      status: 200,
      data: {
        name: findUser.name,
        lastName: findUser.lastName,
        email: findUser.email,
      },
      token: token
    })

  } catch(err){
    console.log(err)
    res.status(500).json({
      msg: "Error al loguear el usuario",
      status: 500
    })
  }

}

module.exports = {
  createUser,
  loginUser
}