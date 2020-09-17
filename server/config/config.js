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
    urlDB = 'mongodb+srv://jarryp:0cdnu3LEff9cTJpI@cluster0.hadys.mongodb.net/cafe';
}
process.env.URLDB = urlDB;