const express = require('express');
const router = express.Router();
const rateLimiter = require("express-rate-limit");

//TO limit the number of request made to login an account
const viewDatesLimiter = rateLimiter({
    //10 mins
    windowMs: 10 * 60 * 1000,
    
    //5 requests per wndowMS
    max: 15,
  
    message: "try again later"
  })

router.get('/dates/:id',viewDatesLimiter, async (req, res) => {
    console.log("works");
    const query = `SELECT customer.first_name, customer.surname, date_confirmed.date, date_confirmed.time FROM date_confirmed
                    INNER JOIN match
                    ON date_confirmed.match_id=match.match_id
                    INNER JOIN customer
                    ON match.person_1 = customer.user_id
                    WHERE
                    match.person_2 = $1
                    UNION
                    SELECT customer.first_name, customer.surname, date_confirmed.date, date_confirmed.time FROM date_confirmed
                    INNER JOIN match
                    ON date_confirmed.match_id=match.match_id
                    INNER JOIN customer
                    ON match.person_2 = customer.user_id
                    WHERE
                    match.person_1 = $1
                    ORDER BY date,time ASC;`;
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