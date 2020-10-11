const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

const axios = require('axios');
const express = require('express');
const formidable = require('formidable');

const app = express();

const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res, next) => {
    res.render('index');
});
app.post('/', (req, res, next) => {
    let { name, tag } = req.body;
    let form = formidable({ multiples: true });

    form.parse(req, (error, fields, files) => {
        if (error) {
            next(error)
        } else {
            let { name, tag } = fields;
            let dockerfile = new Buffer();
            // https://stackoverflow.com/questions/33424852/cant-post-to-endpoint-using-formidable-and-request
            // formidable send file to another rest api
        };
    });
});

app.listen(APP_PORT, APP_HOST, console.log(`Server is running on http://${APP_HOST}:${APP_PORT}`));