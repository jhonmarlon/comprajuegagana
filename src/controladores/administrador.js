
const Admin = require('../models/admin');

//requerimos el modelo del usuario
const Usuario = require('../models/usuario')

//Requerimos la funcion para crear el token
const {generarJWT} = require('../helpers/generarJWT');

//requerimos bcrypt para encrptar la contraseña
const bcryptjs = require('bcryptjs');

const ObjectId = require('mongoose').Types.ObjectId;


const loginAdministradorGet = (req, res) => {
    res.render('admin_login')
}

const loginAdministradorPost = async (req, res)  => {
    //Recibimos credenciales del administrador desde el formulario
    const {usuario_Admin, pass_admin} = req.body;

    try {

        const usuarioAdmin = await Admin.findOne({usuario_admin: usuario_Admin});

        if(!usuarioAdmin){
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos - Nombre usuario'
            })
        }

        //Validamos el si password es validamos
        const validPassword = bcryptjs.compareSync(pass_admin, usuarioAdmin.pass_admin)

        //Admin123*
        //Si el password no es valido
        if(!validPassword){
            return res.status(400).json({
                msg: 'usuario o contraseña invalidos - password'
            })
        }

        //Creamos el token para el usuario
        //Generar el JWT
        const token  = await generarJWT(usuarioAdmin.id);

        //Configurando cookies
        const cookiesOptions = {
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly:true
        }

        //Nombre con el que aparecera la cookie del usuario en el navegador
        res.cookie('jwtadmin', token, cookiesOptions);
        
        res.redirect('admin_menu');

    } catch (error) {
        console.log('Comuníquese con el administrador')
    }
    
}

const buscarUsuario = async (req, res) => {

    const {cedula, ciudad, tienda} = req.body;

    //validamos si el usuario si existe en la base de datos y ya haya jugado
    const usuarioBuscado = await Usuario.find({cedula, ciudad, tienda, juega: 1});
    
    if(usuarioBuscado){
        res.json({
            ok: true,
            usuarioEncontrado: usuarioBuscado
        })
    }
  
    
    /*if(usuarioBuscado){

        res.render('inicioAdmin', {usuarioEncontrado: usuarioBuscado})

    }else{
        res.json({
            msg: 'El usuario no existe'
        })
    }*/

}

const validaCodigoUsuario = async (req, res) => {

    const {idUsuarioRedimirPremio, codigoUnicoUsuario} = req.body;

    const _id = idUsuarioRedimirPremio;

    if(!ObjectId.isValid(_id)){
        return res.json({
            msg: 'Ha ocurrido un error inesperado, por favor comuníquese con el administrador'
        })
    }


    //Buscamos el usuario con el id enviado
     const usuarioExiste = await Usuario.findById({_id});

     //Si el usuario existe validamos el codigo unico
     if(usuarioExiste){

        if(codigoUnicoUsuario === usuarioExiste.codigo_cliente){
            return res.json({
                ok: true,
                msg: 'El usuario bono se ha redimido exitosamente',
                usuarioExiste
            })
        }else{ 
            return res.json({
                ok: false,
                msg: 'Código de usuario invalido'
            })
        }

     }else{
        return res.json({
            ok: false,
            msg: 'Error al redimir el premio'
        })
     }

}

const redimirPremio = async (req, res) => {

    const id= req.params.id;

    //Actualizamos el estado de redimido
    await Usuario.findByIdAndUpdate(id, {estado_redimido: true});
    
    res.json({
        ok: true,
    }) 
}


const menuAdministradorGet = (req, res) => {
    res.render('inicioAdmin')
}

module.exports = {
    loginAdministradorGet,
    loginAdministradorPost,
    buscarUsuario,
    validaCodigoUsuario,
    redimirPremio,
    menuAdministradorGet
}