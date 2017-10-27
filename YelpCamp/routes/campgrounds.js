var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// RESTFUL INDEX ROUTE - Show all campgrounds from database
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){     // Get all campgrounds from DB
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'}); //name:data passing through i.e. from the database
       }
    });
});

// RESTFUL CREATE ROUTE - Adding campground to database
router.post("/", middleware.isLoggedIn, function(req, res) {
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   // Google maps
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
    
        // object template for campground
        var newCampground = {name: name, price: price, image: image, description: description, author: author, location: location, lat: lat, lng: lng};
       
        //create a new campground and save to database
        Campground.create(newCampground, function(err, newlyCreated) {
          if(err) {
              console.log(err);
              req.flash("error", "Something went wrong.");
              res.redirect("/campgrounds");
          } else {
            // redirect to campgrounds
            res.redirect("/campgrounds");
          }
       });
   });
});

// RESTFUL NEW ROUTE - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

// RESTFUL SHOW ROUTE - Shows information about one campground
router.get("/:id", function(req, res) {
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) { // findById is a mongoose method to make it easier to get the id
        if(err || !foundCampground) {                                                                                 // ^ populates campground with comments
            req.flash("error", "Campground not found!");
            res.redirect("back");
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// RESTFUL EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// RESTFUL UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

// RESTFUL DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;