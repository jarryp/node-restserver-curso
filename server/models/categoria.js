const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'descripción es un dato requerido']
    },
    estado: {
        type: Boolean,
        defaul: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' })


module.exports = mongoose.model('Categoria', categoriaSchema);