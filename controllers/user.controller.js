const router = require('express').Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;

// const testingBcyrpt = (password) => {
    
//     let encrypt = bcrypt.hashSync(password, 10);
//     console.log('ENCRYPT: ', encrypt);

// }

// testingBcyrpt('myPassword');
// testingBcyrpt('myPassword');
// testingBcyrpt('new_passwords');

/*
! CHALLENGE:
    - Add a boilerplate code for the controller
    - Create a POST method route ('/signup')
    - Make sure route is working
        - simple response of "Connected"
        -Test in Postman
    - full URL is:
        - localhost:4000/user/signup
*/

router.post('/signup', async (req, res) => {
    // res.send('Connected');

    try {
        
        // Creating a new object based off the Model Schema.
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            // password: req.body.password
            password: bcrypt.hashSync(req.body.password, 13) // passing in the password provided by the user, salting it 13 times.
        }); // using values from req.body to form our object.

        const newUser = await user.save(); // writes to database. Returns a response - why it should be an "await".

        // const token = jwt.sign({message: 'Hello!'}, "My Secret Message", {expiresIn: "1 day"});
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: "1 day"});

        res.status(200).json({
            user: newUser,
            message: "Successful!",
            token
        });

    } catch (err) {
        res.status(500).json({
            ERROR: err.message
        })
    }
});

/* 
! Challenge:
    - Create a '/login' route POST
    - Test route 
        - provide a response of the email within the body.
    - Full URL: 
        localhost:4000/user/login
*/

router.post('/login', async (req, res) => {
    // res.send(req.body.email);

    try {
        
        //1. Capture data provided by user (body).
        const { email, password } = req.body;

        //2. Check database to see if email supplied exists
        const user = await User.findOne({email: email});
        //* A MongoDB method that accepts a query as an argument. Returns an instance of a document that matches.
        // console.log(user);

        if(!user) throw new Error('User Not Found'); // quick response if no user exists in DB.

        //3. If email exists, consider if email matches.
        const passwordMatch = await bcrypt.compare(password, user.password); // returns a true/false value
        //* compare(string, hashed)

        // console.log(passwordMatch); 

        if(!passwordMatch) throw new Error('Email or Password does not match');

        //4. After verified, provide a jwt token
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: 60 * 60 * 24});

        //5. response status returned
        res.status(200).json({
            message: `Successful!`,
            user,
            token
        });

    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
});

module.exports = router;