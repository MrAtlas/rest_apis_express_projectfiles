
const express = require('express');
const router = express.Router();
const records = require('./records');

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}


//send a GET request to /quotes to READ a list of quotes
router.get('/quotes', async (req, res) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch (error) {
        res.json({ message: error.message })
    }
});

// Send a GET request to /quotes/:quoteId to READ a quote
router.get('/quotes/:id', async (req, res) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.json(quote)
        } else {
            res.status(404).json({ message: "Quote Not Found" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Send a POST request to /quotes to CREATE a quote
router.post('/quotes', asyncHandler(async (res, req) => {
    if (req.body.quote && req.body.author) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote);
    } else {
        res.status(400).json({ message: "Author and Quote is required" })
    }
}));

// Send a PUT request to /quotes/:quoteId to UPDATE a quote
router.put('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;

        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Quote Not Found" });
    }
}))

// Send a DELETE request to /quotes/:quoteId to DELETE a quote
router.delete('/quotes/:id', async (req, res, next) => {
    try {
        const quote = await records.getQuote(req.params.id);
        await records.deleteQuote(quote);
        res.status(204).end();
    } catch (error) {
        next(error)
    }
});

//send a random quote 
router.get('/quotes/quote/random', async (req, res) => {
    try {
        const quote = await records.getRandomQuote();
        res.json(quote).status(200).end();
    } catch (error) {
        next(error)
    }
})


module.exports = router;