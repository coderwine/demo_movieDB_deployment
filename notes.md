# Traditional Databases

Database:
- Types: 
  - Relational 
    - SQL, PostgreSql, MySQL
  - Non-Relational
    - MongoDB, Apache Cassandra, Couchbase
- Collection of tables or documents
- Tables:
  - Primary Keys (ID)
  - Records: Data within rows of table
- Mongo
  - Database = Database
  - Collections = Tables
  - Documents = Records
    - stored as JSON
  - Is a **Document Data Store**

# MERN
- M: Mongo
- E: Express
- R: React
- N: Node

# Express
- Need a `package.json` file
  - run `npm init` or `npm init -y`
- Install Dependencies:
  - Express: `npm i express`
  - Mongoose: `npm i mongoose`
    - package that connects to MongoDB
  - dotenv: `npm i dotenv`
  - **NOTE**:
    - We can install multiple dependencies at once
    - ex: `npm i express mongoose dotenv`
- Entry point within `package.json`
  - `index.js` or `app.js`
- `.gitignore`
  - ignore files/folders that shouldn't be in a repo.

# .env
- Contains constants that are specific for our environment
- Stores items that we don't want published
  - passwords, port numbers / deployment routes, keys
- Should be added to `.gitignore`
- Should have a sample version to communicate with team.
  - `example.env`

# app.js
- Boilerplate connection
```js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const log = console.log;

app.listen(PORT, () => log(`Movie Server on Port: ${PORT}`));
```

## Mongo & Mongoose
- Need to connect to our database
  - Using **MongoDBCompass**

```js
const mongoose = require('mongoose');
const MONGO = process.env.MONGODB;

mongoose.connect(`${MONGO}/moviedb`);

const db = mongoose.connection;

db.once("open", () => log(`Connected: ${MONGO}`));
```

# Models
- Define what our database collection will look like.
  - A schema for each object being created.
  - `mongoose` establishes our schema.

Example:
```js
const UserSchema = new mongoose.Schema({
    // columns for our document
    firstName: {
        type: String, // What datatype this is expecting.
        require: true, // default is false.
    }
});
```

## Bcrypt
- `npm i bcrypt`
- dependency that handles encryption of data.
  - most commonly - passwords
- Hashing produces a one-way randomized string based off the plain text string provided.
  - Uses `salting` as an extra layer of encryption.
- Salting:
  - randomized string included within the hashing prior to being set to the database.

example code:
```js
bcrypt.hashSync("abc123", 10);
```
- first param = password
- second param = number of times the password will be salted.

## JWT
- JSON Web Token
- `npm i jsonwebtoken`
- A way for our server to authenticate the user.

example code:
```js
const token = jwt.sign({id: user._id}, "secret message", {expiresIn: 60 * 60 * 24});
```
- `sign(payload, message, options)` 
  - 3 arguments:
    - payload
      - In the sample we are using an object that details the id of the user.
    - encrypt/decrypt message
      - passed in as a string in the sample
      - Typically stored as a `.env` variable.
    - Options sets (expiration)
      -  represents milliseconds or a string time span
         -  ex: `"2 days"` or `"10h"`