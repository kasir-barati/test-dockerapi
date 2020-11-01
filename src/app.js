const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

const cors = require('cors');
const express = require('express');

const app = express();

const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/auth', require('./routes/auth'));
app.use('/services', require('./routes/service'));
app.use(require('./middlewares/send-response'));
app.use(require('./middlewares/404'));
app.use(require('./middlewares/500'));

app.listen(APP_PORT, APP_HOST, console.log(`Server is running on http://${APP_HOST}:${APP_PORT}`));