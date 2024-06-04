const express = require("express");
const User = require("../models/User");
//The express.Router() function is used to create a new router object. This function is used when you want to create a new router object in your program to handle requests.
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_Secret = "AbhyudaiSrivastava##Footballer";

//ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({min: 5}),
  ],
  async (req, res) => {    //req- request, res- response
  

    //if there are error, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with same email exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist." });
      }

      const salt = await bcrypt.genSaltSync(10);  //t returns a promise.
      const secPass = await bcrypt.hash(req.body.password, salt);  //bcrypt.hash is a method in the bcrypt library that is used to hash passwords. It takes a password string and a salt value as input and returns a hashed password string. The salt value is used to make the hashed password unique and more secure. The bcrypt.hash method uses a one-way function, which means that it is not possible to reverse the hashing process and obtain the original password from the hashed password. It returns a promise.
      
      //Create new User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user :{
            id: user.id,
        }
      }
      const authToken = jwt.sign(data, JWT_Secret); //data: data to be sent
      
        res.json({authToken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error"); //res.status(500).send It is a response status code indicating server error, which means that the web server encountered an error while processing a client's request
    }
  }
);

//ROUTE 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {

        //if there are error, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;
        try {
            let user = await User.findOne({email}); //this will pull out the user if the email passed is matched with the email in the database if not found it will return an error
            if(!user){
                return res.status(400).json({error: "Please try to login with correct credentials"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({error: "Please try to login with correct credentials"});
            }

            const data = {
                user :{
                    id: user.id,
                }
              }
            const authToken = jwt.sign(data, JWT_Secret); //data: data to be sent
            res.json({authToken});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE 3: get loggedIn user details using: POST "/api/auth/getuser". Login required
router.post("/getuser",fetchUser , async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
                res.status(500).send("Internal Server Error");
    }
})


module.exports = router;
