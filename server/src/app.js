const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

//app.use(cors()); // this will allow all the sites from the internet and its not secure.
app.use(cors({
    origin: 'http://localhost:3000',
}));   // this will allow only localost:3000 which is our frontend port.

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); //check path.join & __dirname,express.static

app.use('/v1', api);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;