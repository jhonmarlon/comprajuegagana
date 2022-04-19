//Requiriendo configuración de .env
require('dotenv').config();

//Requiriendo servidor 
const Server = require('./server');

const server = new Server();

server.listen();