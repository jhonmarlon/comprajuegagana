//Requerimos el JWT
const jwt = require('jsonwebtoken');

const generarJWT = (userID = '') => {

    return new Promise((resolve, reject) => {

        //Generamos el JWT
        const payload = { userID };

        //Firmamos el JWT - enviamos el payload y el secretKy que creamos en el .env
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' //Tiempo de expiración del token
        },(err, token) => { 
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token)
            }
        })
    })
}

module.exports = {
    generarJWT
}