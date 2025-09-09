const router = require("express").Router();

const { validateToken, validateAdminRole } = require("../middlewares/auth.middlewares")

// ℹ️ Test Route. Can be left and used for waking up the server if idle
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes") // {}
router.use("/auth", authRouter)


//* THIS IS AN EXAMPLE OF A PRIVATE ROUTE
router.get("/private-route-example", validateToken, (req, res) => {

  // imagine that this route is for a complex functionality only for users that have logged into the application. for example:
  // - creating a document assigned to the user who created it
  // - accesing the user profile or making changes to it
  // - deleting a document owned by the user

  //! SUPER IMPORTANT. this is used for the functionality. This is how we know who is making the requests on the server
  console.log("req.payload", req.payload)

  res.send("all good, request processed!")

})

//* THIS IS AN EXAMPLE OF AN ADMIN ROUTE (THE USERS NEEDS TO BE LOGGED IT AND ALSO NEEDS TO BE AN ADMIN)
router.get("/admin-route-example", validateToken, validateAdminRole, (req, res) => {

  res.send("all good, request processed. You are logged in and you are and admin")

})

module.exports = router;
