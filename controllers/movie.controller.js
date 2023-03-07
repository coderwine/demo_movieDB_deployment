const router = require('express').Router();
const Movie = require('../models/movie.model');
const validateSession = require('../middleware/validate-session');

// Error Response Function
const errorResponse = (res, error) => {
    return(
        res.status(500).json({
            Error: error.message
        })
    );
}

router.post('/', validateSession, async (req,res) => {
    try {
        
        //1. Pull data from client (body)
        const {
            title, genre, rating, length, releaseYear
        } = req.body;

        //2. Create a new object using the Model
        const movie = new Movie({
            title, genre, rating, length, releaseYear,
            owner_id: req.user.id
        });

        //3. Use mongoose method to save to MongoDB
        const newMovie = await movie.save();

        //4. client response
        res.status(200).json({
            newMovie,
            message: `${newMovie.title} added to collection!`
        })

    } catch (err) {
        errorResponse(res, err);
    }
});

/* 
!   Challenge
        - By ID
        - Response should consider
            - If found
            - If no document found
        
        Hint: Consider login within user.controller.js
        Docs: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/
*/

router.get('/:id', validateSession, async (req,res) => {
    try {
        const { id } = req.params;
        const getMovie = await Movie.findOne({_id: id});

        getMovie ?
            res.status(200).json({
                getMovie
            }) :
            res.status(404).json({
                message: `No movie found.`
            });

    } catch (err) {
        errorResponse(res,err);
    }
})

/* 
!   Challenge
        - No special endpoing necessary
        - Response should consider
            - If found
            - not found
        
        Docs: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
        
        Hint: parameters within method are optional
*/

router.get('/', validateSession, async (req,res) => {
    try {
        const getAllMovies = await Movie.find();

        getAllMovies ?
            res.status(200).json({
                getAllMovies
            }) :
            res.status(404).json({
                message: `No movies found.`
            });

    } catch (err) {
        errorResponse(res, err);
    }
})

/* 
!   Challenge
        - No special endpoing necessary
        - Response should consider
            - If found
            - not found
        - Consider parameter casing within the endpoint.
            - hint: conditional w/ looping
*/

router.get('/genre/:genre', async (req,res) => {
    try {
        const { genre } = req.params;
        let buildWord;

        if(genre) {
            for(let i = 0; i < genre.length; i++) {
                i === 0 ?
                    buildWord = genre[i].toUpperCase():
                    buildWord += genre[i].toLowerCase();
            }
        }

        const getMovies = await Movie.find({genre: buildWord});

        getMovies.length > 0 ? 
            res.status(200).json({
                getMovies
            }) :
            res.status(404).json({
                message: `No movies found.`
            });


    } catch (err) {
        errorResponse(res, err);
    }
});

router.patch('/:id', validateSession, async (req, res) => {
    try {
        //1. Pull value from parameter
        // const { id } = req.params;
        const filter = {_id: req.params.id, owner_id: req.user.id}
        //2. Pull data from the body.
        const info = req.body;

        //3. Use method to locate document based off ID and pass in new information.
        const returnOption = {new: true};


        const updated = await Movie.findOneAndUpdate(filter, info, returnOption);
        //* findOneAndUpdate(query, document, options)
        // returnOptions allows us to view the updated document


        //4. Respond to client.
        res.status(200).json({
            message: `${updated.title} Updated!`,
            updated
        })

    } catch (err) {
        errorResponse(res, err);
    }
});

router.delete('/:id', validateSession, async (req,res) => {
    try {
        //1. Capture ID
        const { id } = req.params;
        //2. use delete method to locate and remove based off ID
        const deleteMovie = await Movie.deleteOne({_id: id, owner_id: req.user.id});
        //3. Respond to Client
        deleteMovie.deletedCount ?
            res.status(200).json({
                message: `Movie Removed`
            }) :
            res.status(404).json({
                message: `No movie in collection`
            });

    } catch (err) {
        errorResponse(res, err);
    }
});


module.exports = router;