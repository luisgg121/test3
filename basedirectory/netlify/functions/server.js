// Para revisar el funcionamiento del servidor, utilizar Postman con los siguientes parámetros:
// GET   http://localhost:8080/autores?accion=alta&nombre=Enrique&apellidos=Peña

require('dotenv').config();

global.rowIndex = 0;

const model = require('./model/model');
// const login = require('./login');

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");

import express, { app } from "express";
import serverless from "serverless-http";

// Create a new instance of express
// const app = express()
const app = app();
// const app = express.app()
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

app.use(cookieParser());

const mysql = require('mysql');
// const connection = mysql.createConnection({
connection = mysql.createConnection({
    // localhost: process.env.DB_HOST,
    host: process.env.DB_HOST,  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

console.log("Connection = " + connection);

const tabla = 'autores';

// Configuramos el middleware de sesión para usar una clave secreta personalizada y permitir que las sesiones se guarden 
// automáticamente. Ahora podemos acceder a los datos de sesión en cada solicitud utilizando el objeto req.session.
// app.use(session({
//     // secret: 'my-secret-key',
//     secret: process.env.SESSION_SECRET || 'some-secret',
//     resave: false,
//     saveUninitialized: true
// }));

// Authentication and Authorization Middleware
var auth = function (req, res, next) {
    if (req.session && req.session.user === "amy" && req.session.admin)
        return next();
    else
        return res.sendStatus(401);
};


// const login = express();


// Configuramos el middleware de sesión para usar una clave secreta personalizada y permitir que las sesiones se guarden 
// automáticamente. Ahora podemos acceder a los datos de sesión en cada solicitud utilizando el objeto req.session.
app.use(session({
    secret: process.env.SESSION_SECRET || 'some-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000, }
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
        req.session.username = "amy";
        req.session.password = "amyspassword";
        req.session.admin = true;
        res.send("login success!");
    }
});

// // Logout endpoint
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

// Get content endpoint
// app.get('/content', auth, function (req, res) {
//     res.send("You can only see this after you've logged in.");
// });

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))


const http = require('http');
const url = require('url');

// const host = process.env.DB_HOST;
const port = process.env.PORT;

var accion = 'alta';
var nombre = 'Luis';
var apellidos = 'de la Garza';

const query = {};
var q = {};

const registro_autores1 = {
    nombre: 'Luis',
    apellidos: 'de la Garza González'
};

const registro_autores = {
    id: 72,
    nombre: 'Luis',
    apellidos: 'de la Garza González'
};

const registro_libros = {
    id: 1,
    titulo: '',
    f_publicacion: '2023-10-26 00:00:00',
    editorial: '',
    paginas: 1,
    autor: 1
}

const registro = registro_autores;

app.listen(port);
console.log("Express server running");

// app.get("/autores", async function (req, res) {
app.get("/autores", async function (req, res) {
    // if (!req.session.username) {
    if (false) {
        res.end("No tienes permiso, favor de firmarte.");
    } else {
        // Ok, el usuario tiene permiso
        // res.write("Hola " + req.session.username);
        console.log("Estoy en el app.get /autores")
        const tabla = 'autores';
        const parsedUrl = url.parse(req.url, true);
        console.log("req.url = " + req.url);
        q = parsedUrl;
        accion = q.query.accion;
        if (q.query.id) id = q.query.id;
        nombre = q.query.nombre;
        apellidos = q.query.apellidos;
        switch (accion) {
            case "alta":
                nombre = q.query.nombre;
                apellidos = q.query.apellidos;
                registro_autores1.nombre = nombre;
                registro_autores1.apellidos = apellidos;
                // id = model.insertar(tabla, registro_autores1);
                await connection.query(`insert into ${tabla} set ?`, registro_autores1, (err, result) => {
                    if (err) throw err;
                    console.log(result + result.insertId);
                    console.log("insertId = " + result.insertId);
                    id = result.insertId;
                    console.log("model.insertar id = " + id);
                    console.log("model.response.id = " + id)
                    console.log("stringify.id = " + JSON.stringify(id));
                    let objeto = '{"id":' + JSON.stringify(id) + "}"
                    console.log("Objeto = " + objeto);
                    // objeto = JSON.stringify(objeto);
                    // console.log("Objeto = " + objeto + " " +typeof(objeto));
                    // objeto = JSON.parse(JSON.stringify(objeto));
                    // console.log("Objeto = " + objeto + " " +typeof(objeto));

                    res.send(objeto);
                    res.end();
                })
                break
            case "baja":
                id = q.query.id;
                model.eliminar(tabla, id)
                break
            case "actualizar":
                registro_autores.id = q.query.id;
                registro_autores.nombre = q.query.nombre;
                registro_autores.apellidos = q.query.apellidos;
                model.actualizar_autores(tabla, registro_autores);
                break
            case "consultarAutor":
                registro_autores.id = q.query.id;
                console.log("Case consultarAutor --- id = " + q.query.id);
                // model.consultar_autor(tabla, registro_autores);
                await connection.query(`select * from ${tabla} where id = ?`, [q.query.id], (err, rows) => {
                    console.log('Datos del autor recibidos de la base de datos: ');
                    console.log(rows);
                    // var respuesta = JSON.parse(JSON.stringify(rows));
                    var respuesta = JSON.stringify(rows);
                    respuesta = JSON.parse(respuesta);
                    console.log("Case consultarAutor --> Datos en json: " + respuesta);
                    res.send(respuesta);
                    res.end();
                });
                break
            case "consultar_tabla":
                await connection.query(`select * from ${tabla}`, (err, rows) => {
                    if (err) throw err;
                    console.log('Datos recibidos de la base de datos: ');
                    console.log(rows);
                    // var respuesta = JSON.parse(JSON.stringify(rows));
                    var respuesta = JSON.stringify(rows);
                    respuesta = JSON.parse(respuesta);
                    console.log("Server.js --> Datos en json: " + respuesta);

                    console.log(typeof respuesta) // tipo de la variable respuesta
                    // res.send(rows);
                    console.log("Primer registro = " + respuesta[0].id + " " + respuesta[0].nombre);
                    res.send(respuesta);
                    res.end();
                    // return respuesta;
                });
                // const respuesta = await model.consultar(tabla, res);
                // console.log("Server.js --> " + respuesta);  // ok tengo la respuesta
                // console.log("res: " + res);
                // return respuesta;

                // res.writeHead(200);
                // res.write(respuesta);

                // const respuesta1 = [
                //     {
                //         id: 200,
                //         nombre: "Luis",
                //         apellidos: "Noida"
                //     },
                //     {
                //         id: 201,
                //         nombre: "Luis",
                //         apellidos: "Segundo"
                //     }
                // ]

                // console.log("Respuesta1: " + respuesta1);
                // console.log("Respuesta1 id: " + respuesta1[0].id);
                // data = JSON.stringify(data);
                // res.send(respuesta);
                // res.end();
                break

            default:
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Resource not found" }));
        }
    }
})

app.get('/libros', function (req, res) {
    if (!req.session.username) {
        res.end("No tienes permiso, favor de firmarte.");
    } else {
        // res.send(req.session.username);
        res.send(`<html><body><h1>Libros: </h1></body></html>`);

    }
})

// module.exports = app;
module.exports.connection = connection;


export const handler = serverless(app);