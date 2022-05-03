const {Router} = require('express');
const router = Router();

//Inicio general
router.get('/',(req, res) => {
    res.render('inicio')
})

//Inicio Colombia
router.get('/COL',(req, res) => {
    res.render('inicioColombia')
})

//Inicio Ecuador
router.get('/ECU',(req, res) => {
    res.render('inicioEcuador')
})

//Distribuidores autorizados Colombia
router.get('/distribuidores_autorizados', (req, res) => {

    res.render('distribuidores_autorizados')
})

//Distribuidores autorizados Ecuador
/*router.get('/ECU/distribuidores_autorizados', (req, res) => {
    res.render('distribuidores_autorizados_ecuador')
})*/

router.post('/distribuidores_autorizados', (req, res) => {
    let {pais} = req.body;

    if(pais == ""){
        return res.redirect('/');
    }

    pais = pais.trim();

    res.render('distribuidores_autorizados', {pais})
})

module.exports = router;