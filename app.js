require('dotenv').config(); // connects our .env file to our project
const express = require('express');
const app = express();
const PORT = process.env.PORT; // points to our environment file and puts the value of PORT from that variable into this PORT variable.
const log = console.log;
const cors = require('cors');
const headers = require('./middleware/headers')
//* Controllers
const users = require('./controllers/user.controller');
const movies = require('./controllers/movie.controller');
// const validateSession = require('./middleware/validate-session');

const mongoose = require('mongoose'); // used from node_modules
const MONGO = process.env.MONGODB; //connection variable from .env

mongoose.set('strictQuery', false); // removes our warnign being displayed in the terminal.

mongoose.connect(MONGO); // connection middleware. Est. route and defining our Collection we are targeting.
//* Doesn't display until there is a document within the collection.

const db = mongoose.connection; // event listener to check if connected.

db.once("open", () => log(`Connected: ${MONGO}`)); // event listener to check connection.

// app.use(headers);
app.use(express.json()); // added to allow us to accept JSON data from the body of our client.
app.use(cors(
    // {
    // origin: "*",
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// }
));

//* Routes
app.use('/user', users);
// app.use(validateSession); // all routes below require validation when used this way.
app.use('/movies', movies);


app.listen(PORT, () => log(`Movie Server on Port: ${PORT}`));