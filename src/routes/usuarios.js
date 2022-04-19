const {Router} = require('express');

//Importando controlador de usuarios
const { 
    loginUsuarioGet, 
    terminosCondiciones, 
    loginUsuarioPost, 
    gameGet,
    redimirPremioGet, 
    redimirPremioPost,
    redimirPremioPost_1_1,
    actualizaDatosFinJuego,
    gameEnd } = require('../controladores/usuarios');

//Importando middlewares
const {validaToken} = require('../middlewares')

const router = Router();

//Rutas get
router.get('/login', loginUsuarioGet);
router.get('/terminos_condiciones', terminosCondiciones);
router.get('/juego', validaToken.isValidUserJWS, gameGet);
router.get('/redimir_premio', redimirPremioGet);
router.get('/juego_fin', gameEnd)

//Rutas post
router.post('/login', loginUsuarioPost);
router.post('/redimir_premio', redimirPremioPost);
router.post('/redimir_premio_cod', redimirPremioPost_1_1);
router.post('/actualizardatosFinJuego', validaToken.isValidUserJWS,actualizaDatosFinJuego);


module.exports = router;