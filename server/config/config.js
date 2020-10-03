process.env.PORT = process.env.PORT || 3000;


//=============================
//ENTORNOS DE TRABAJO
//=============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=============================
//BASE DE DATOS
//=============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
    //urlDB = 'mongodb://localhost:27017/cafe';
}
process.env.URLDB = urlDB;


//=============================
// Vencimiento del Token
//=============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//=============================
// SEED de autenticación
//=============================
process.env.SEED = process.env.SEED || 'p4l4c10s';


//=============================
// GOOGLE CLIENT ID
//=============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '981988597735-947dsshu0lkqkp8dnihuit80i3p43u85.apps.googleusercontent.com';