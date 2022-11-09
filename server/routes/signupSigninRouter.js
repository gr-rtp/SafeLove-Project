const express = require("express");
const router = express.Router();
const pool = require("../dbShae/dbShae");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const rateLimiter = require("express-rate-limit");


module.exports = router;
//TO limit the number of request made to login an account
const loginLimiter = rateLimiter({
  //10 mins
  windowMs: 10 * 60 * 1000,
  
  //5 requests per wndowMS
  max: 7,

  message: "try again later"
})


router.post("/signup", loginLimiter, async (req, res) => {

    // 1. destructure the req.body (name, email, password)
    const { email, password } = req.body;
  
    // 2. check if user exists
    try {
      const user = await pool.query("SELECT * FROM customer WHERE email = $1", [
        email
      ]);
  
      if (user.rows.length > 0) {
        return res.status(401).json("User already exist!");
      }
  
    // 3. hash the password (using bcrypt)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
    // 4. insert user into database
      let newUser = await pool.query(
        "INSERT INTO customer (email, password) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
      );
  
    // 5. generate jwt token
      const user_id = newUser.rows[0].user_id
      const token = jwtGenerator(user_id);
      return res.json({ user_id, token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put("/register", loginLimiter, async (req, res) => {

  // 1. destructure the req.body
  const { user_id, first_name, surname, dob, gender, int_gender, postcode, vaxx_status, int_vaxx_status, interests, url } = req.body.formData;
  
  // 2. insert user into database
  try {

    let update_data = await pool.query(
      "UPDATE customer SET first_name = $1, surname = $2, dob = $3, gender = $4, postcode = $5, vaxx_status = $6, int_gender = $7, int_vaxx_status = $8, interests = $9, url = $10 WHERE user_id = $11 RETURNING *",
      [first_name, surname, dob, gender, postcode, vaxx_status, int_gender, int_vaxx_status, interests, url, user_id]
    );
    res.json(update_data.rows[0]);

  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
  }
});

router.post("/login", loginLimiter, async (req, res) => {

    // 1. destructure the req.body (email, password)
    const { email, password } = req.body;
  
    // 2. check if user exists
    try {
      const user = await pool.query("SELECT * FROM customer WHERE email = $1", 
      [email]);
  
      if (user.rows.length === 0) {
        return res.status(401).json("Invalid Credential");
      }
  
    // 3. check if password is valid
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
  
      if (!validPassword) {
        return res.status(401).json("Wrong password");
      }

    // 4. give them the jwt token
      const user_id = user.rows[0].user_id;
      const token = jwtGenerator(user_id);
      return res.json({ user_id, token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

  
module.exports = router;