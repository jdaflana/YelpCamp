var mongoose = require("mongoose"),
    Comment = require("./comment");

// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model("Campground", campgroundSchema); // "Campground name is normally singular as mongoose will turn it into plural automatically"
                                                                 // ^ module.exports acts like a return statement or inheritence. Whoever requires campground.js will get the code inside it.