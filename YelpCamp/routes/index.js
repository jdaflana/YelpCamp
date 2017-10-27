var express = require("express");
var router = express.Router();
var passport = require("passport");
var middleware = require("../middleware");
var User = require("../models/user");

// Root Route - Home
router.get("/" , function(req, res) {
   res.render("landing"); 
});

// =====================
// Authentication Routes
// =====================

// Show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// Sign Up Logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {     
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username + "!");
            res.redirect("/campgrounds");  
        });
    });
});

// Show Login Form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// Handling Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {

});

// Logout Logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have logged out.")
    res.redirect("/campgrounds");
});

module.exports = router;