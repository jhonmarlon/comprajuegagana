const Usuario = require('../models/usuario');
const UsuarioEcuador = require('../models/usuarioEcuador');


const {generarJWT} = require('../helpers/generarJWT');


//import randomCode from '../helpers/helpers.js';
const helpers = require('../helpers/helpersGenerales');

/*const loginUsuarioGet = (req , res) =>{

  const {pais} = req.body;

  res.render('usuarios_login', pais)
}*/


const redimirPremioGet = (req, res) => {
    let {pais} = req.body;

    if(pais == ""){
        return res.redirect('/');
    }

    pais=pais.trim();

    res.render('redimir_premio_1', {pais})
}

const redimirPremioPost = async (req, res) => {

    const errors = [];

    let {ciudad , tienda, num_factura, cedula, premio, pais } = req.body;

    if(ciudad == 0 || tienda == 0 || num_factura == "" || cedula == "" || premio == ""){
        errors.push({text: "Todos los campos son de carácter obligatorio"});
    
        res.render('redimir_premio_1', {
            errors, pais
        })

        return;
    }

    if(pais == ""){
        return res.redirect('/');
    }

    pais=pais.trim();

    ciudad= ciudad.trim();
    tienda= tienda.trim();
    num_factura= num_factura.trim();
    cedula= cedula.trim();
    
    //Buscamos al usuario 
    let usuarioEncontrado 
    
    if(pais == "COL"){
        usuarioEncontrado  = await Usuario.findOne({cedula: cedula, num_factura: num_factura, ciudad: ciudad, tienda: tienda});
    }else if(pais == "ECU"){
        usuarioEncontrado  = await UsuarioEcuador.findOne({cedula: cedula, num_factura: num_factura, ciudad: ciudad, tienda: tienda});
    }

    //Si el usuario no existe en la base de datos
    if(!usuarioEncontrado){
        errors.push({text: "El registro que intenta buscar no existe en la base de datos"});
        res.render('redimir_premio_1', {
            errors, pais
        })
        return;
    }

    //console.log('este es el usuario encontrado para poedr redimir')
    //console.log(usuarioEncontrado)

    //Si el usuario ya redimio el premio
    if(usuarioEncontrado.estado_redimido){
        errors.push({text: "El registro que intenta redimir ya se ha redimido previamente"});
        res.render('redimir_premio_1', {
            errors, pais
        })
        return;
    }

    //Si se encuentra el usuario renderizamos 
    res.render('redimir_premio_cod', {usuarioEncontrado, pais});
}


//Recibe el código de redención y redime el premio
const redimirPremioPost_1_1 = async (req, res) => {

    const errors = [];
    const successMessages = [];

    let {ciudad, tienda, num_factura, cedula, premio,codigo_redencion, pais} = req.body;

    const usuarioEncontrado = {
        ciudad: ciudad.trim(),
        tienda: tienda.trim(),
        num_factura: num_factura.trim(),
        cedula: cedula.trim(),
        premio: premio.trim()
    }

    //console.log('este es el nuevo usuario a redimir')
    //console.log(usuarioEncontrado)

    if(pais == ""){
        return res.redirect('/');
    }

    pais=pais.trim();

    //Si el codigo de rerdención esta vacío
    if(codigo_redencion == ""){
        errors.push({text: "Debe diligenciar el código de redención"});
    
        res.render('redimir_premio_cod', {
            errors, usuarioEncontrado, pais
        })
        return;
    }else if(codigo_redencion != "bonomania2022"){
        errors.push({text: "El código de redención no es correcto"});
 
        res.render('redimir_premio_cod', {
            errors, usuarioEncontrado, pais
        })

        return;
    }

    let redimido;
    //Validamos que el registro no este previamente redimido
    if(pais == "COL"){
         redimido = await Usuario.findOne({
            ciudad: usuarioEncontrado.ciudad,
            tienda: usuarioEncontrado.tienda,
            num_factura: usuarioEncontrado.num_factura,
            cedula: usuarioEncontrado.cedula
        });
    }else if(pais == "ECU"){
         redimido = await UsuarioEcuador.findOne({
            ciudad: usuarioEncontrado.ciudad,
            tienda: usuarioEncontrado.tienda,
            num_factura: usuarioEncontrado.num_factura,
            cedula: usuarioEncontrado.cedula
        });
    }

    //console.log('este esera el que se redimira')
    //console.log(redimido)

    if(redimido.estado_redimido){
        errors.push({text: "El registro que intenta redimir ya se ha redimido previamente"});
        res.render('redimir_premio_cod', {
            errors, usuarioEncontrado
        })
        return;
    }

    /*let premioRedimido = await Usuario.findOneAndUpdate(
        {redimido},
        {estado_redimido: true});*/
    redimido.estado_redimido = true;

    await redimido.save();
    res.render('redimido');

    /*if(premioRedimido){
        successMessages.push({text: "El premio se ha redimido correctamente"});
        res.render('redimir_premio_cod', {
            successMessages,
            usuarioEncontrado
        })
        return;
        res.render('redimido');
    }else{
        errors.push({text: "Error al redimir el premio"});
        res.render('redimir_premio_cod', {
            errors,
            usuarioEncontrado
        })
        return;
    }*/
    
}


//Loguea al usuario en el juego
const loginUsuarioPost = async (req , res) =>{

    //eliminamos la cookie que almacena el token si existe 
    if(req.cookies.jwtuser){
        res.clearCookie('jwtuser');
    }

    const errors = [];

    //recibimos los datos del body
    let {cedula,nombre,num_factura,ciudad,tienda = '', pais} = req.body;

    cedula = cedula.trim();
    nombre = nombre.trim();
    num_factura = num_factura.trim();
    ciudad = ciudad.trim();
    tienda = tienda.trim();
    pais = pais.trim();

    //validamos que esten todos los datos
    if(cedula == "" || nombre == "" || num_factura == "" || ciudad == 0 || tienda == 0){
        errors.push({text: "Todos los campos son de carácter obligatorio"});
    
        return res.render('usuarios_login', {
            errors, pais
        })
    }

    if(pais == ""){
        return res.redirect('/');
    }

    const data = {
        cedula,
        nombre,
        num_factura,
        ciudad,
        tienda, 
    }

    let usuarioExiste;
    let usuarioJugoDosVeces;
    //validamos que el numero de factura exista en la bd segun el pais
    if(pais == "COL"){
         usuarioExiste = await Usuario.findOne({num_factura: data.num_factura, ciudad: data.ciudad, tienda: data.tienda});
        //Buscamos el usuario por cedula para validacion de haber jugado 2 veces
        usuarioJugoDosVeces = await Usuario.countDocuments({cedula: cedula, juega: 1});
    }else if(pais == "ECU"){
        usuarioExiste = await UsuarioEcuador.findOne({num_factura: data.num_factura, ciudad: data.ciudad, tienda: data.tienda});
        //Buscamos el usuario por cedula para validacion de haber jugado 2 veces
        usuarioJugoDosVeces = await UsuarioEcuador.countDocuments({cedula: cedula, juega: 1});
    }

    //Si no existe , se crea
    if(!usuarioExiste){

        //Si el usuario ya jugo dos veces
        /*if(usuarioJugoDosVeces == 2){
            errors.push({text: `Hubo un error, contáctate con soporte`});
            return res.render('usuarios_login', {
                errors, pais
            })
        }*/

        const codigoUnicoUser = "USR-" + helpers.randomCode();


        let usuario;
        //Creamos el usuario con el modelo correspondiente al pais
        if(pais == "COL"){
             usuario = new Usuario({
                cedula: data.cedula,
                nombre: data.nombre,
                num_factura: data.num_factura,
                ciudad: data.ciudad, 
                tienda: data.tienda,
                codigo_cliente: codigoUnicoUser
            })
        }else if(pais == "ECU"){
             usuario = new UsuarioEcuador({
                cedula: data.cedula,
                nombre: data.nombre,
                num_factura: data.num_factura,
                ciudad: data.ciudad, 
                tienda: data.tienda,
                codigo_cliente: codigoUnicoUser
            })
        }
    
        const usuarioAutenticado = await usuario.save();

        //Generar el JWT
        const token  = await generarJWT(usuario.id);

        //Configurando cookies
        const cookiesOptions = {
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly:true
        }

        //Nombre con el que aparecera la cookie del usuario en el navegador
        res.cookie('jwtuser', token, cookiesOptions);

        //Abrimos las vistas de tutorial

        if(pais == "COL"){
            //Tutorial colombia
            res.render('phaser/juego_tutorial', {usuarioAutenticado});
        }else if(pais == "ECU"){
            //Tutorial ecuador
            res.render('phaser/juego_tutorial_ecuador', {usuarioAutenticado});
        }
     
   
        //console.log('Usuario autenticado desde login: '+usuarioAutenticado);
        //res.render('phaser/juego', {usuarioAutenticado});
    }else{
        
        //Si el usuario ya jugo dos veces
        /*if(usuarioJugoDosVeces == 2){
            errors.push({text: `Hubo un error, contáctate con soporte`});
            return res.render('usuarios_login', {
                errors, pais
            })
        }*/

        //Si existe valida si ya jugó o no
        //Si no ha jugado
        if(usuarioExiste.juega === 0){

            //Generar el JWT
            const token  = await generarJWT(usuarioExiste.id);

            //Configurando cookies
            const cookiesOptions = {
                expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly:true
            }

            //Nombre con el que aparecera la cookie del usuario en el navegador
            res.cookie('jwtuser', token, cookiesOptions);

            const usuarioAutenticado = usuarioExiste;

            //console.log('Usuario autenticado desde login: '+usuarioAutenticado);

            if(pais == "COL"){
                //Abrimos las vistas de tutorial colombia
                res.render('phaser/juego_tutorial', {usuarioAutenticado});
            }else if(pais == "ECU"){
                //Abrimos las vistas de tutorial ecuador
                res.render('phaser/juego_tutorial_ecuador', {usuarioAutenticado});
            }
          
            //Entra   
            //res.render('./phaser/juego', {usuarioAutenticado});

        }else{
            errors.push({text: `La factura número ${usuarioExiste.num_factura} de la tienda ${usuarioExiste.tienda}, ya participó`});
            res.render('usuarios_login', {
                errors, pais
            })
        }
    }   
}

//Renderiza la vista de términos y condiciones Colombia
const terminosCondicionesColombia= (req, res) =>{
    res.render('terminos_condiciones')
}

const terminosCondicionesEcuador= (req, res) =>{
    res.render('terminos_condiciones_ecuador')
}


//Renderiza la vista principal del juego
const gameGet = (req, res) => {
    let {pais} = req.body;

    if(pais == ""){
        return res.redirect('/');
    }

    pais = pais.trim();

    //Recogemos el usuario autenticado que se envio mediante el req dentro del middleware validarJWT 
    const usuarioAutenticado = req.usuarioAutenticado;
    //console.log('Usuario autenticado desde ruta: '+usuarioAutenticado)
    
    if(pais == "COL"){
        //--colombia
        res.render('./phaser/juego', {usuarioAutenticado});
    }else if(pais == "ECU"){
        //--ecuador
        res.render('./phaser/juego-ecuador', {usuarioAutenticado});
    }

}
 
//Renderiza la vista de errores
const errorJuegoGet = (req, res) => {
    //console.log(req.cookies.jwtuser)
    //eliminamos la cookie que almacena el token si existe 
    if(req.cookies.jwtuser){
        res.clearCookie('jwtuser');
    }

    res.render('./phaser/juego_error');
}

//Renderiza la vista del final del juego
const gameEnd = (req, res) => {

    //eliminamos la cookie que almacena el token si existe 
    if(req.cookies.jwtuser){
        res.clearCookie('jwtuser');
    }

    res.render('./phaser/juego_fin')
}


const actualizaDatosFinJuego = async (req, res) => {
     //console.log(req.body);

     let{id,pais, ...resto} = req.body;

     pais = pais.trim();
    
     let usuarioActualizado;
     if(pais == "ECU"){
         usuarioActualizado = await UsuarioEcuador.findByIdAndUpdate(id, resto); 
     }else if(pais == "COL"){
         usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto); 
     }

     
     if(usuarioActualizado){
        res.json({
            ok: true,
        }) 
     }else{
        res.json({
            ok: false,
        }) 
     }
}






const loginUsuarioPostActual = (req, res) => {
    const {pais} = req.body;
    res.render('usuarios_login', {pais})
}


module.exports = {
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
    errorJuegoGet,



    loginUsuarioPostActual
}