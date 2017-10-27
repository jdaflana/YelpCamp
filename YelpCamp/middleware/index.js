var Campground = require("../models/campground");
var Comment = require("../models/comment");

// middleware

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {                                     // is user logged in?
        Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            if(foundCampground.author.id.equals(req.user._id)) {    // is the user the owner?
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {                                     // is user logged in?
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else {
            if(foundComment.author.id.equals(req.user._id)) {    // is the user the owner of the comment?
                next();
            } else {
                req.flash("error", "You don't have permission to do that.");
                res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

// checks if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login or create an account first.");
    res.redirect("/login");
};

module.exports = middlewareObj;