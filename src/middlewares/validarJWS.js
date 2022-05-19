const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const usuarioEcuador = require('../models/usuarioEcuador');
const Admin = require('../models/admin');


isValidUserJWS = async (req, res , next) => {

    //Tomamos el pais de la peticion 
    let {pais} = req.body;

    if(pais == ""){
        return res.redirect('/');
    }

    pais = pais.trim();

    //Tomamos la cookie creada al momento del login
    const jwtuser = req.cookies.jwtuser;
    
    if(!jwtuser){
        
        /*return res.status(401).json({
            msg: 'No se ha generado ningún token'
        })*/

        return res.redirect("/");
    }

    try {
        //Si la instrucción verify no se cumple , entonces se disparará el error del catch, de lo contrario ejecutará el next()
        //Obtenemos el userID del payload el token
        const {userID} = jwt.verify(jwtuser, process.env.SECRETORPRIVATEKEY);

        let usuarioAutenticado;
        //Obtenemos la información del usuario autenticado
        if(pais == "COL"){
            usuarioAutenticado = await Usuario.findById(userID)
        }else if(pais == "ECU"){
            usuarioAutenticado = await usuarioEcuador.findById(userID)
        }

        //Validamos si el usuario existe o no
        if(!usuarioAutenticado){
            res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })
        }

        //ponemos el usuario autenticado en el req para recibirlo en la ruta una vez se 
        //ejecuten todos los middlewares de validación
        req.usuarioAutenticado = usuarioAutenticado;

        next();

    } catch (error) {
        //console.log(error);
        res.status(404).json({
            msg: 'Token no válido'
        })
    }
}

isValidAdminJWS = async (req, res , next) => {
    //Tomamos la cookie creada al momento del login
    const jwtadmin = req.cookies.jwtadmin;

    if(!jwtadmin){
        return res.status(401).json({
            msg: 'No se ha generado ningún token de administrador'
        })
    }

    try { 
        //Si la instrucción verify no se cumple , entonces se disparará el error del catch, de lo contrario ejecutará el next()
        //Obtenemos el userID del payload el token
        const {userID} = jwt.verify(jwtadmin, process.env.SECRETORPRIVATEKEY);

        //Obtenemos la información del usuario autenticado
        const administradorAutenticado = await Admin.findById(userID)
    
        //Validamos si el usuario existe o no
        if(!administradorAutenticado){
            res.status(401).json({
                msg: 'Token no valido - administrador no existe en BD'
            })
        }

        //ponemos el usuario autenticado en el req para recibirlo en la ruta una vez se 
        //ejecuten todos los middlewares de validación
        req.administradorAutenticado = administradorAutenticado;

        next();

    } catch (error) {
        //console.log(error);
        res.status(404).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    isValidUserJWS,
    isValidAdminJWS
}