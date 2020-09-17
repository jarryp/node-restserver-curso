const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre apellido email estado role google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                console.log('Error de Solicitud de listado de usuarios', err.message);
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })

        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            console.log('Error de Registro de Usuario', err.message);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
        console.log('Usuario Agregado!!!');
    });

    /*
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es un dato requerido'
        });
    } else {
        res.json({
            persona: body
        })
    }*/

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            console.log('Error de Actualización de Datos de Usuario', err.message);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        console.log('Usuario Actualizado Satisfactoriamente!!!', usuarioDB);
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })

    /* res.json({
         id
     });*/
});

app.delete('/usuario/:id', function(req, res) {
    //res.send('Hello World')
    //res.json('Hola DELETE USUARIO!!!')
    let id = req.params.id;

    /*
    Usuario.findByIdAndRemove(id, { useNewUrlParser: true }, (err, usuarioBorrado) => {
        if (err) {
            console.log('Error en la eliminación del usuario', err.message);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                Error: 'Ususario no encontrado'
            });
        }

        console.log('Usuario Eliminado Satisfactoriamente!!!', usuarioBorrado);
        return res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })*/


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {

        if (err) {
            console.log('Error de Eliminación logica del usuario', err.message);
            return res.status(400).json({
                ok: false,
                err
            });
        }

        console.log('Usuario Eliminado Satisfactoriamente!!!', usuarioDB);
        return res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })

});


module.exports = app;