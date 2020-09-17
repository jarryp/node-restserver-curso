const express = require('express')
const app = express()

app.get('/usuario', function(req, res) {
    //res.send('Hello World')
    res.json('Hola GET USUARIO!!!')
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es un dato requerido'
        });
    } else {
        res.json({
            persona: body
        })
    }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    //res.send('Hello World')
    res.json('Hola DELETE USUARIO!!!')
});


module.exports = app;