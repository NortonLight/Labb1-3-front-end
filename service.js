
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
app.use(express.static('Frontend'));
app.use(express.static(path.join(__dirname, 'upload)')));
app.use(bodyParser.urlencoded({extended: true}));
app.listen(3000, () => {
    console.log("Våran server lyssnar på port 3000 nu.");
});