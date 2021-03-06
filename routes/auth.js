// const express = require("express");
// const router = express.Router();
// const passport = require("passport");

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"]
//   })
// );

// // router.get( '/google/callback',
// // 	passport.authenticate( 'google', {
// // 		successRedirect: '/',
// // 		failureRedirect: '/auth/google/failure'
// // }));

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/"
//   }),
//   (req, res) => {
//     console.log("It's come to redirect");
//     res.redirect("/dashboard");
//   }
// );

// module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res) => {
    res.redirect('/dashboard');
  });
  // Verify if logged in
router.get("/verify",(req,res)=>{
  if(req.user){
    console.log(req.user)
  }
  else{
    console.log("Not Auth")
  }
})
// Logout
router.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
})
module.exports = router;