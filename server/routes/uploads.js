const express = require('express');
const fileUpload = require('express-fileupload');
const { TokenExpiredError } = require('jsonwebtoken');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo de registro invalido, los permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se ha seleccionado ningún archivo'
            }
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let extensionesValidas = ['png', 'jpg', 'jepg', 'gif', 'bmp'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'las extensiones de archivo permitidas son: ' + extensionesValidas.join(', ')
        });
    }

    //cAMBIAR EL NOMBRE DEL ARCHIVO
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`,
        (err) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: 'no se ha seleccionado ningún archivo',
                        err
                    }
                });

            //IMAGEN CARGADA

            /*res.status(200).json({
                ok: true,
                message: 'Archivo enviado!!!'
            });*/

            if (tipo === 'usuarios') {
                imagenUsuario(id, res, nombreArchivo, tipo);
            } else {
                imagenProducto(id, res, nombreArchivo, tipo);
            }



        });


});


function imagenUsuario(id, res, nombreArchivo, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarImagen(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe!'
                }
            });
        }

        borrarImagen(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al relacionar imagen de usuario en la base de datos',
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    })
}

function imagenProducto(id, res, nombreArchivo, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarImagen(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe!'
                }
            });
        }

        borrarImagen(productoDB.img, tipo);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al relacionar imagen de usuario en la base de datos',
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    })
}

function borrarImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;