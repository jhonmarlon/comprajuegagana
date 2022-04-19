const {Router} = require('express');

//Importando controlador de administrador
const { 
    loginAdministradorGet,
    loginAdministradorPost, 
    menuAdministradorGet, 
    buscarUsuario, 
    redimirPremio, 
    validaCodigoUsuario} = require('../controladores/administrador');

//Importando middlewares
const {validaToken} = require('../middlewares')

const router =  Router();

//Rutas get
router.get('/login', loginAdministradorGet);
router.get('/admin_menu', validaToken.isValidAdminJWS, menuAdministradorGet);

//Rutas post
router.post('/login', loginAdministradorPost);
router.post('/buscar_usuario', validaToken.isValidAdminJWS,buscarUsuario);
router.post('/valida_codigo_usuario', validaToken.isValidAdminJWS, validaCodigoUsuario)
router.post('/redimir/:id', redimirPremio);

module.exports = router;