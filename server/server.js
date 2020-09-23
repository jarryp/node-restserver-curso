require('./config/config')
const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configuracion global de rutas
app.use(require('./routes/index'));

app.get('/', function(req, res) {
    //res.send('Hello World')
    res.json('Hola Mundo!!!')
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;

        console.log('Base de Datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando prueto: ', process.env.PORT);
})