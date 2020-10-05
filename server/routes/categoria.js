const express = require('express')

let { verificaToken } = require('../middlewares/autenticacion')
const _ = require('underscore');

let app = express();

let Categoria = require('../models/categoria')


// =================================================
// MOSTRAR TODAS LAS CATEGORIAS
// =================================================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'email nombre apellido role estado google')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error de emisión de listado de categorias',
                    err
                })
            }

            return res.status(200).json({
                ok: true,
                categorias: categorias
            })

        });
})


// =================================================
// MOSTRAR CATEGORIA POR ID
// =================================================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error de localización de categorias',
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no registrada en la base de datos'
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    })

})


// =================================================
// CREAR NUEVA CATEGORIA
// =================================================
app.post('/categoria', (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        estado: true,
        usuario: body.usuario
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al Guardar categoria',
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no registrada',
                err
            })
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })


    });
})


// =================================================
// ACTUALIZAR CATEGORIA
// =================================================
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'estado']);

    console.log(body);

    const updateOptions = {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        context: 'query'
    };

    Categoria.findByIdAndUpdate(id, body, updateOptions,
        (err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al Actualizar categoria',
                    err
                })
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'Categoria no actualizada',
                    err
                })
            }

            return res.status(200).json({
                ok: true,
                categoria: categoriaDB
            })

        })



})


// =================================================
// ELIMINAR CATEGORIA
// =================================================
app.delete('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al Actualizar categoria',
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'Id no registrado en la base de datos',
                err
            })
        }
        return res.status(200).json({
            ok: true,
            message: 'Categoria Borrada'
        })
    })


})



module.exports = app;