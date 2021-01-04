import fs from 'fs';
import https from 'https';
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import usersApi from "./APIs/UsersApi";
// Set up the express app
const app = express();
// App settings and server
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({                   // to support URL-encoded bodies
    extended: true,
    limit: '50mb'
}));
// API calls
app.use('/users', usersApi);
// Restful APIs
app.get('/', function(req, res) {
    res.status(200).send('we are on! :)');
});
const certificate = fs.readFileSync('./sslcert/certificate.pem');
const key = fs.readFileSync('./sslcert/key-pkcs8.pem');
const credentials = {key: key, cert: certificate, passphrase: process.env.PASSPHRASE};
//set server start
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);

