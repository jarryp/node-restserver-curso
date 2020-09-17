const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const delete  = require('../routes/usuario');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es un dato requerido']
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electronico es un dato requerido']
    },
    password: {
        type: String,
        required: [true, 'La Contraseña es un dato Requerido']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        defaul: true
    },
    google: {
        type: Boolean,
        defaul: false
    }
});


usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema);