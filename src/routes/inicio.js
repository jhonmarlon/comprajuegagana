const {Router} = require('express');
const router = Router();

router.get('/',(req, res) => {
    res.render('inicio')
})

router.get('/distribuidores_autorizados', (req, res) => {
    res.render('distribuidores_autorizados')
})

module.exports = router;