var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require('connect-flash');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

Article = require("./models/article");
User = require("./models/user");


var commentRoutes = require("./routes/comments");
var articleRoutes = require("./routes/articles");
var indexRoutes = require("./routes/index");

const Config= require("./config.js");
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//SCHEMA SETUP


mongoose.connect(Config.MongoDBconfig, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
    });

app.use(require("express-session")({
secret: Config.Secret,
resave: false,
saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
app.use("/",indexRoutes);
app.use("/articles",articleRoutes);
app.use("/articles/:id/comments/",commentRoutes);
const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function() {
    console.log("The LeBonCoin Server Has Started!")
});