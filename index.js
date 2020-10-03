import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import bodyParser from 'body-parser';
import usersApi from "./APIs/UsersApi";

// Set up the express app
const app = express();
const port = process.env.PORT || 3333;

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

app.listen(port);
console.log(chalk.bgGreenBright.bold('listening on: ' + port));

/*// get all todos
app.get('/api/v1/todos', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'todos retrieved successfully',

    })
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});*/
