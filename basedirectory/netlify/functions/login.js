const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const url = require('url')

require('./node_modules/dotenv').config();
require('./app');

// const login = express();

// Create a new instance of express
// const app = express()

// Configuramos el middleware de sesión para usar una clave secreta personalizada y permitir que las sesiones se guarden 
// automáticamente. Ahora podemos acceder a los datos de sesión en cada solicitud utilizando el objeto req.session.
app.use(session({
    // secret: 'my-secret-key',
    secret: process.env.SESSION_SECRET || 'some-secret',
    resave: false,
    saveUninitialized: true
}));

// Login endpoint
app.get('/login', function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    q = parsedUrl;
    console.log(q);
    req.query.username = q.query.userName;
    req.query.password = q.query.password;
    if (!req.query.username || !req.query.password) {
        res.send('login failed' + req.query.username);
    } else if (req.query.username === "amy" || req.query.password === "amyspassword") {
        // req.session.username = "amy";
        req.session.admin = true;
        res.send("login success!");
    }
});

// login.listen(3000);
// console.log("Express server running");

// module.exports = login;
