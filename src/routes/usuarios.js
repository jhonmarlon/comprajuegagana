const {Router} = require('express');

//Importando controlador de usuarios
const { 
    //loginUsuarioGet, 
    terminosCondicionesColombia,
    terminosCondicionesEcuador,
    loginUsuarioPost, 
    gameGet,
    redimirPremioGet, 
    redimirPremioPost,
    redimirPremioPost_1_1,
    actualizaDatosFinJuego,
    gameEnd,

    loginUsuarioPostActual
} = require('../controladores/usuarios');

//Importando middlewares
const {validaToken} = require('../middlewares')

const router = Router();

//Rutas get
//router.get('/login', loginUsuarioGet);
router.get('/terminos_condiciones_CO', terminosCondicionesColombia);
router.get('/terminos_condiciones_ECU', terminosCondicionesEcuador);
//router.get('/juego', validaToken.isValidUserJWS, gameGet);//

router.post('/redimir_premio_form', redimirPremioGet);
router.get('/juego_fin', gameEnd);


//Rutas post
router.post('/loginUsuarios', loginUsuarioPostActual); //RUTA QUE MUESTRA EL FORMULARIO DE LOGIN
router.post('/login', loginUsuarioPost); //RUTA QUE NVIA LA INFO DEL FORMULARIO ED LOGIN A LA BD
router.post('/juego', validaToken.isValidUserJWS, gameGet);
router.post('/redimir_premio', redimirPremioPost);
router.post('/redimir_premio_cod', redimirPremioPost_1_1);
router.post('/actualizardatosFinJuego', validaToken.isValidUserJWS,actualizaDatosFinJuego);


module.exports = router;