const express = require('express');
const { verificacionToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');


//============================================
// OBTENER PRODUCTOS
//============================================
app.get('/productos', (req, res) => {

    Producto.find({})
        .sort('nombre')
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                productos
            });
        })

})


//============================================
// BUSCAR PRODUCTO POR ID
//============================================
app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .sort('nombre')
        .populate('usuario')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(200).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                producto
            });
        })
});


// ===========================
//  Buscar productos
// ===========================
app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        })
});

//============================================
// REGISTRAR NUEVO PRODUCTO
//============================================
app.post('/producto', (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: body.usuario,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });


    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'Ha ocurrido un error al guardar datos del producto'
            });
        } else {
            return res.status(201).json({
                ok: true,
                producto: productoDB
            });
        }
    })

})


//============================================
// ACTUALIZAR PRODUCTOS
//============================================
app.put('/producto/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    const updateOptions = {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        context: 'query'
    };

    Producto.findByIdAndUpdate(id, body, updateOptions, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'Ha ocurrido un error al actualizar datos del producto'
            });
        } else {
            return res.status(200).json({
                ok: true,
                producto: productoDB
            });
        }

    })

})


//============================================
// ELIMINAR PRODUCTOS
//============================================
app.delete('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'Ha ocurrido un error al actualizar datos del producto'
            });
        } else {
            return res.status(200).json({
                ok: true,
                message: 'Producto Eliminado'
            });
        }

    })

})


module.exports = app;