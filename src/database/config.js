//Requiriendo Mongoose ODM
const mongoose = require('mongoose');

const dbConnection = async () => {

    try{

        //Haciendo conexion a mongo db
       /*await mongoose.connect('mongodb://localhost/bonomania_2022', {
            useNewUrlParser: true,
       })*/

       await mongoose.connect('mongodb+srv://admin:admin@cluster0.xph9i.mongodb.net/bonomania_2022?retryWrites=true&w=majority', {
            useNewUrlParser: true,
       })
       
    
       console.log('Base de datos conectada');

    }catch(error){
        console.log(error);
        throw new Error('Error en la base de datos');
    }
}


module.exports = {
    dbConnection
}