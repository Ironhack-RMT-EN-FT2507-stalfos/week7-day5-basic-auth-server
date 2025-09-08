const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { validateToken } = require("../middlewares/auth.middlewares");

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
router.post("/login", async(req, res, next) => {

  console.log(req.body)
  const { email, password } = req.body

  // all the info should be received
  if (!email || !password) {
    res.status(400).json({errorMessage: "email and password are mandatory"})
    return // stop the execution of the route
  }

  try {
    
    // the user needs to exist in the database
    const foundUser = await User.findOne({ email })
    console.log(foundUser)
    if (foundUser === null) {
      res.status(400).json({errorMessage: "there are no users registered with that email"})
      return
    }

    // the passwords should match
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    if (isPasswordCorrect === false) {
      res.status(400).json({errorMessage: "the password is not correct"})
      return
    }

    //! this is were we finished authenticating the user. The user is who they say they are.

    // info from the user that will not change often
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      //todo if we were using roles, we would need to add this here
    }

    // proceed to create the Token
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "2d"
    })
  
    res.status(202).json({authToken: authToken})

  } catch (error) {
    next(error)
  }
})

// GET "/api/auth/verify" => validate the token and send the info of the user that has logged in (functionality only for the frontend)
router.get("/verify", validateToken, (req, res) => {
  res.status(200).json(req.payload) // sending to the FE the info from the logged in user.
})


module.exports = router