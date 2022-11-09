const express = require('express');
const router = express.Router();
const rateLimiter = require("express-rate-limit");

//TO limit the number of request made to login an account
const messageLimiter = rateLimiter({
    //10 mins
    windowMs: 10 * 60 * 1000,
    
    //5 requests per wndowMS
    max: 500,
  
    message: "try again later"
  })

router.get('/matches/:id',messageLimiter, async (req, res) => {
    const query = `SELECT match.match_id, customer.first_name, customer.surname 
                   FROM match 
                   INNER JOIN customer 
                   ON match.person_2 = customer.user_id 
                   WHERE person_1=$1 
                   UNION 
                   SELECT match.match_id, customer.first_name, customer.surname 
                   FROM match 
                   INNER JOIN customer 
                   ON match.person_1 = customer.user_id 
                   WHERE person_2=$1;`;
    await req.pool.connect((err, client, release) => {
        if (err){
            return console.error('Error acquiring client', err.stack);
        }
        client.query(query, [req.params.id], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack);
            }

            res.send(result.rows);
        })
    })
});

router.get('/messages/:id',messageLimiter, async (req, res) => {
    const query = `SELECT * FROM message WHERE match_id = $1 ORDER BY date_message ASC;`;
    await req.pool.connect((err, client, release) => {
        if (err){
            return console.error('Error acquiring client', err.stack);
        }
        client.query(query, [req.params.id], (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack);
            }

            res.send(result.rows);
        })
    })
});

module.exports = router;
