
const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes');
const app = express();
const path = require('path');
const { dirname } = require('path');

//const Frontend = require('./Frontend')
//app.use('/', Frontend);
//app.use(express.static(./upload));

app.use(bodyParser.json());
app.use(express.json());
app.use('/', routes);
<<<<<<< HEAD
app.use(express.static('Frontend'));
app.use(express.static(path.join(__dirname, 'upload)')));
=======
app.use(express.static('../Labb1-3-front-end'));
app.use('/upload', express.static(path.join(__dirname, './upload)')));
>>>>>>> 65aa3082413b35168d6f6cb8d4497372a3a80cca
app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000, () => {
    console.log("Våran server lyssnar på port 3000 nu.");
});