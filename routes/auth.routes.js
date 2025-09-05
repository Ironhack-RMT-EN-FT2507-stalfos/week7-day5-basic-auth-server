const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs")

// POST "/api/auth/signup" => register the information about the user (including credentials)
router.post("/signup", async(req, res, next) => {

  console.log(req.body)

  const { username, email, password } = req.body

  // validations.

  // 1. all the info is received or is empty (email, password, username) 
  if (!username || !email || !password) {
    res.status(400).json({errorMessage: "username, email and password are mandatory"})
    return // stop the execution of the route
  }

  // 2. the password needs to be secure enough
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  if (passwordRegex.test(password) === false) {
    res.status(400).json({errorMessage: "password is not strong enough. It needs to have at least 8 characteres, one lowercase, one uppercase and one digit."})
    return
  }

  // 3. the email needs to have a proper email structure
  //todo you can do this for your projects

  try {

    // 4. there cannot be another user with that same email
    const foundUser = await User.findOne({email: email})
    if (foundUser !== null) {
      res.status(400).json({errorMessage: "user already registered with that email"})
      return
    }

    // hash the password
    const hashPassword = await bcrypt.hash(password, 12)
  
    await User.create({
      username,
      email,
      password: hashPassword
    })
    
    res.sendStatus(201)
    
  } catch (error) {
    next(error)
  }

})

// POST "/api/auth/login" => verify the credentials of the user and send a token


// GET "/api/auth/verify" => validate the token and send the info of the user that has logged in (functionality only for the frontend)


module.exports = router