var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

var Article = require("../models/article");
var Comment = require("../models/comment");

router.get("/", function(req, res) {

    res.render("landing.ejs");
});





router.get("/register",function(req,res){
	res.render("register");

});
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
User.register(newUser, req.body.password, function(err,user){
	if(err){
		req.flash("error",err.message)
		return res.render("register")
	}
	passport.authenticate("local")(req,res,function(){
		req.flash("success", "Welcome to LeBonCoin" + user.username);
		res.redirect("/articles");
	});
});
});

router.get("/login", function(req,res){

res.render("login",{message: req.flash('error')});
});

router.post("/login",passport.authenticate("local", {
	successRedirect:"/articles",
	failureRedirect:"/login",
	failureFlash : true
}), function(req, res){

});

router.get("/logout", function(req,res){
req.logout();
req.flash("success", "Logged out");
res.redirect("/articles");
});


module.exports = router;