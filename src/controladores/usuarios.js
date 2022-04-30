const Usuario = require('../models/usuario');

const {generarJWT} = require('../helpers/generarJWT');


//import randomCode from '../helpers/helpers.js';
const helpers = require('../helpers/helpersGenerales');

const loginUsuarioGet = (req , res) =>{
  res.render('usuarios_login')
}


const redimirPremioGet = (req, res) => {
    res.render('redimir_premio_1')
}

const redimirPremioPost = async (req, res) => {

    const errors = [];

    const {ciudad , tienda, num_factura, cedula, premio } = req.body;

    if(ciudad == 0 || tienda == 0 || num_factura == "" || cedula == "" || premio == ""){
        errors.push({text: "Todos los campos son de carácter obligatorio"});
    
        res.render('redimir_premio_1', {
            errors,
        })

        return;
    }

    const data = {
        ciudad: ciudad.trim(),
        tienda: tienda.trim(),
        num_factura: num_factura.trim(),
        cedula: cedula.trim(),
        premio: premio.trim()
    }
       

    //Buscamos al usuario 
    let usuarioEncontrado = await Usuario.findOne({cedula: data.cedula, num_factura: data.num_factura, ciudad: data.ciudad, tienda: data.tienda});

    //Si el usuario no existe en la base de datos
    if(!usuarioEncontrado){
        errors.push({text: "El registro que intenta buscar no existe en la base de datos"});
        res.render('redimir_premio_1', {
            errors,
        })
        return;
    }

    //console.log('este es el usuario encontrado para poedr redimir')
    //console.log(usuarioEncontrado)

    //Si el usuario ya redimio el premio
    if(usuarioEncontrado.estado_redimido){
        errors.push({text: "El registro que intenta redimir ya se ha redimido previamente"});
        res.render('redimir_premio_1', {
            errors,
        })
        return;
    }

    //Si se encuentra el usuario renderizamos 
    res.render('redimir_premio_cod', {usuarioEncontrado});
}


//Recibe el código de redención y redime el premio
const redimirPremioPost_1_1 = async (req, res) => {

    const errors = [];
    const successMessages = [];

    const {ciudad, tienda, num_factura, cedula, premio,codigo_redencion} = req.body;

    const usuarioEncontrado = {
        ciudad: ciudad.trim(),
        tienda: tienda.trim(),
        num_factura: num_factura.trim(),
        cedula: cedula.trim(),
        premio: premio.trim()
    }

    //console.log('este es el nuevo usuario a redimir')
    //console.log(usuarioEncontrado)

    //Si el codigo de rerdención esta vacío
    if(codigo_redencion == ""){
        errors.push({text: "Debe diligenciar el código de redención"});
    
        res.render('redimir_premio_cod', {
            errors, usuarioEncontrado
        })
        return;
    }else if(codigo_redencion != "bonomania2022"){
        errors.push({text: "El código de redención no es correcto"});
 
        res.render('redimir_premio_cod', {
            errors, usuarioEncontrado
        })

        return;
    }

    //Validamos que el registro no este previamente redimido
    const redimido = await Usuario.findOne({
        ciudad: usuarioEncontrado.ciudad,
        tienda: usuarioEncontrado.tienda,
        num_factura: usuarioEncontrado.num_factura,
        cedula: usuarioEncontrado.cedula
    });

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
        res.clearCookie('jwt');
    }

    const errors = [];

    //recibimos los datos del body
    let {cedula,nombre,num_factura,ciudad,tienda} = req.body;

    cedula = cedula.trim();
    nombre = nombre.trim();
    num_factura = num_factura.trim();
    ciudad = ciudad.trim();
    tienda = tienda.trim();

    //validamos que esten todos los datos
    if(cedula == "" || nombre == "" || num_factura == "" || ciudad == 0 || tienda == 0){
        errors.push({text: "Todos los campos son de carácter obligatorio"});
    
        res.render('usuarios_login', {
            errors,
        })

        return;
    }

    const data = {
        cedula,
        nombre,
        num_factura,
        ciudad,
        tienda
    }

    //validamos que el numero de factura exista en la bd
    const usuarioExiste = await Usuario.findOne({num_factura: data.num_factura, ciudad: data.ciudad, tienda: data.tienda});

    //Si no existe , se crea
    if(!usuarioExiste){

        const codigoUnicoUser = "USR-" + helpers.randomCode();

        const usuario = new Usuario({
            cedula: data.cedula,
            nombre: data.nombre,
            num_factura: data.num_factura,
            ciudad: data.ciudad, 
            tienda: data.tienda,
            codigo_cliente: codigoUnicoUser
        })

    
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
        res.render('phaser/juego_tutorial', {usuarioAutenticado});

        //console.log('Usuario autenticado desde login: '+usuarioAutenticado);
        //res.render('phaser/juego', {usuarioAutenticado});
    }else{
        
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

            //Abrimos las vistas de tutorial
            res.render('phaser/juego_tutorial', {usuarioAutenticado});

            //Entra   
            //res.render('./phaser/juego', {usuarioAutenticado});

        }else{
            errors.push({text: `La factura número ${usuarioExiste.num_factura} de la tienda ${usuarioExiste.tienda}, ya participó`});
            res.render('usuarios_login', {
                errors,
            })
        }
    }   
}

//Renderiza la vista de términos y condiciones
const terminosCondiciones= (req, res) =>{
    res.render('terminos_condiciones')
}

//Renderiza la vista principal del juego
const gameGet = (req, res) => {
    const usuarioAutenticado = req.usuarioAutenticado;
    //console.log('Usuario autenticado desde ruta: '+usuarioAutenticado)
    //Recogemos el usauarioAutenticado que se envio mediante el req dentro del middleware validarJWT 
    res.render('./phaser/juego', {usuarioAutenticado});
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

     const{id, ...resto} = req.body;

     const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto); 
     
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


module.exports = {
    loginUsuarioGet,
    terminosCondiciones,
    loginUsuarioPost,
    gameGet,
    redimirPremioGet,
    redimirPremioPost,
    redimirPremioPost_1_1,
    actualizaDatosFinJuego,
    gameEnd
}