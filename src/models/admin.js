const { Schema, model } = require('mongoose');

const AdminSchema = Schema({
    usuario_admin: {
        type: String,
        require: [true, 'El nombre de usuario administrador es obligatorio']
    },
    pass_admin: {
        type: String,
        require: [true, 'La contraseña de administrador es obligatoria'],
    },
}) 

//Esta función permite separar los atributos del objeto creado por medio del Schema//
//Para este caso estamos sacando el password y el __V para que no sea mostrado al cliente "postman"
//Y que solo sea mostrado el objeto usuario sin las dos propiedades anteriormente mencionadas
AdminSchema.methods.toJSON = function() {
    const {__v, _id, ...admin} = this.toObject();

    //Cambiando visualmente _id por adminID
    admin.adminID = _id;

    return admin; 
}

module.exports = model('Admin', AdminSchema);