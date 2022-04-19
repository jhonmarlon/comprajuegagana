const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    cedula: {
        type: String,
        require: [true, 'La cédula de usuario es obligatorio']
    },
    nombre: {
        type: String,
        require: [true, 'La cédula de usuario es obligatorio']
    },
    num_factura: {
        type: String,
        require: [true, 'El número de factura obligatorio'],
    },
    ciudad: {
        type: String,
        require: [true, 'La ciudad es obligatoria'],
    },
    tienda: {
        type: String,
        require: [true, 'La tienda es obligatoria'],
    },
    juega:{
        type: Number,
        default: 0
    },
    fecha: {
        type: String,
        default: ""
    },
    cant_clic:{
        type: Number,
        default: 0
    },
    premio:{
        type: String,
        default:""
    },
    codigo_cliente: {
        type: String,
        require: true
    },
    estado_redimido: {
        type: Boolean,
        default: false
    },
}) 


//Esta función permite separar los atributos del objeto creado por medio del Schema//
//Para este caso estamos sacando el password y el __V para que no sea mostrado al cliente "postman"
//Y que solo sea mostrado el objeto usuario sin las dos propiedades anteriormente mencionadas
UsuarioSchema.methods.toJSON = function() {
    const {__v, _id, ...usuario} = this.toObject();

    //Cambiando visualmente _id por userID
    usuario.userID = _id;

    return usuario; 
}

//Se debe poner el nombre a exportar en singular, ya que mongoose le pone a la coleccion el nombre con una "s" al final
module.exports = model('Usuario', UsuarioSchema);