const express = require('express');
const cookieParser = require('cookie-parser');
//Requerimos allowInsecurePrototypeAccess para poder enviar los datos de
//desde una ruta a otra con el res.render
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

//Requerimos handlebars
const Handlebars = require('handlebars');
const {engine} = require('express-handlebars');

const cors = require("cors");

const path = require('path');

const {dbConnection} = require('./database/config');

//Requerimos glsh para mensajes instantáneos
const session = require('express-session');
const flash = require('connect-flash');

class Server {

    constructor(){
        //Config express
        this.app = express();
        //Puerto
        this.port = process.env.PORT || 8080;

        //Path para las rutas
        this.pathUsuarios = '/usuarios'
        this.pathAdministrador = '/admin'

        //Base de datos 
        this.database()

        //Llamando motor de plantillas
        this.motorPlantillas();

        //Middlewares
        this.middlewares();

        //Llamando las rutas
        this.routes();

    }

    async database(){
        await dbConnection();
    }

    motorPlantillas(){
        this.app.set('views', path.join(__dirname, 'views'));
        
        this.app.engine('.hbs', engine({
            defaultLayout: 'main',
            layoutDir: path.join(this.app.get('views'), 'layout'),
            partialDir: path.join(this.app.get('views'), 'partials'),
            extname: '.hbs',
            handlebars: allowInsecurePrototypeAccess(Handlebars)
        }))

        this.app.set('view engine', '.hbs');
    }

    middlewares(){
        //Directorio publico 
        this.app.use(express.static(path.join(__dirname,"public")));

        //Lectura y parseo del body
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.json()); //Serializa info en formato json

        //Configurando cookies
        this.app.use(cookieParser());

        this.app.use(cors({credentials: true, origin: 'https://drive.google.com/drive/folders/1x1dfsDym8Vkufc6lhVR3hnXANRkeh0Pk'}));

        //Usando mensajes flash
        this.app.use(flash());

    }

    routes(){   
        //Rutas de inicio
        this.app.use(require('./routes/inicio'));
        //Rutas de usuarios
        this.app.use(this.pathUsuarios, require('./routes/usuarios'));
        //Rutas administrador
        this.app.use(this.pathAdministrador, require('./routes/administrador'));
    }

    listen(){
        //Configurando puerto de escucha del server
        this.app.listen(this.port, () => {
            console.log('listening on port ' + this.port);
        })
    }
}


//Expornatndo clase 
module.exports = Server;