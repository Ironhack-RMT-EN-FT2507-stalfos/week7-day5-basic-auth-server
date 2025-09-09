const jwt = require("jsonwebtoken")

//! this validate token middleware should be used on ANY route that is private.
function validateToken(req, res, next) {

  console.log(req.headers)

  try {
    
    const authToken = req.headers.authorization.split(" ")[1]
    const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
    req.payload = payload // passing the payload to the route to it can be used for the functionality

    next() // continue with the route

  } catch (error) {
    res.status(401).json({errorMessage: "token no sent or is not valid"})
  }

}

function validateAdminRole(req, res, next) {

  if (req.payload.role === "admin") {
    next() // continue to the route
  } else {
    res.status(401).json({errorMessage: "you are not an admin"})
  }

}


module.exports = {
  validateToken,
  validateAdminRole
}