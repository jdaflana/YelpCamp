var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"), // middleware for express
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"), // authentication
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_camp"); // database set up
app.use(bodyParser.urlencoded({extended: true})); // required to use body parser
app.use(express.static(__dirname + "/public")); // uses all CSS/Javascript files in the public directory
app.use(methodOverride("_method"));
app.use(flash()); // used for flash messages
app.set("view engine", "ejs"); // so we don't have to keep using the suffix .ejs on things like "landing" 
seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "I like pie",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) { /* calls function in all routes, it shows the user is in/out the session */
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// makes shortcuts for the routes; don't have to type the whole route out
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// tell express to listen for server
app.listen(process.env.PORT, process.env.IP, function() {
        console.log("YelpCamp server has started");
});