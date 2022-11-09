const express = require("express");
const router = express.Router();
const pool = require("../dbShae/dbShae");
// const authorise = require("../middleware/authorise");

module.exports = router;
const rateLimiter = require("express-rate-limit");

//TO limit the number of request made to login an account
const matchesLimiter = rateLimiter({
    //10 mins
    windowMs: 10 * 60 * 1000,
    
    //5 requests per wndowMS
    max: 150,
  
    message: "try again later"
  })

// get individual user
router.get("/user", matchesLimiter, async (req, res) => {

    const user_id = req.query.userId
  
    try {
      const user = await pool.query("SELECT * FROM customer WHERE user_id = $1", 
      [ user_id ]
    );

        return res.json(user.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// get all users with interested gender, interested vaccination status and postcode
router.get("/targetusers",matchesLimiter, async (req, res) => {

    const int_gender = req.query.int_gender
    const int_vaxx_status = req.query.int_vaxx_status

    const postcode = req.query.postcode
    const state_initial = parseInt(postcode) / 1000
    const state_postcode = parseInt(state_initial) * 1000

    // Set areas to fetch users only in same areas i.e. postcode of 5300 will have areas between 5100 and 5500
    const postcode_max = parseInt(postcode) + 200
    const postcode_min = Math.max(state_postcode, parseInt(postcode) - 200)

    const user_id = req.query.user_id
    

    try {

        if (int_vaxx_status == 'Any') {
            const users = await pool.query("SELECT * FROM customer WHERE gender = $1 AND postcode BETWEEN $2 AND $3 AND user_id <> $4", 
            [ int_gender, postcode_min, postcode_max, user_id ]
            );

            return res.json(users.rows);
        } else {
            const users = await pool.query("SELECT * FROM customer WHERE gender = $1 AND vaxx_status = $2 AND postcode BETWEEN $3 AND $4 AND user_id <> $5", 
            [ int_gender, int_vaxx_status, postcode_min, postcode_max, user_id ]
            );

            return res.json(users.rows);
        }
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// check match
router.get("/checkmatch", matchesLimiter, async (req, res) => {

    const user_id  = req.query.user_id
    const liked_user_id = req.query.liked_user_id
  
    try {
      const match = await pool.query("SELECT * FROM match WHERE (person_1 = $1 OR person_1 = $2) AND (person_2 = $1 OR person_2 = $2)", 
      [ user_id, liked_user_id ]
    );
        
        return res.json(match.rowCount);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// add match
router.post("/addmatch",matchesLimiter, async (req, res) => {

    const {user_id, liked_user_id} = req.body
  
    try {
      const match = await pool.query("INSERT INTO match (person_1, person_2) VALUES ($1, $2) RETURNING *", 
      [ user_id, liked_user_id ]
    );

        return res.json(match.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// add like
router.put("/addlike",matchesLimiter, async (req, res) => {

    const {user_id, liked_user_id} = req.body

    try {
      const like = await pool.query("UPDATE customer SET likes = array_prepend(CAST($1 AS uuid), likes) WHERE user_id = $2 RETURNING *", 
      [ liked_user_id, user_id ]
      
    );

        return res.json(like.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// remove like
router.put("/removelike",matchesLimiter, async (req, res) => {

    const {user_id, removed_user_id} = req.body

    try {
      const like = await pool.query("UPDATE customer SET likes = array_remove(likes, $1) WHERE user_id = $2 RETURNING *", 
      [ removed_user_id, user_id ]
    );

        return res.json(like.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;