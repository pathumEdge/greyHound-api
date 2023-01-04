const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const mysql = require('mysql');
const fileUpload = require('express-fileupload');

const app = express();
const port = 3200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use(fileUpload());
// app.use(express.static('uploads'))

function handleDisconnect() {
    require('./app/routes')(app);
    app.listen(port, () => {
        console.log("greyhound web scraper api started")
    })
}

handleDisconnect();