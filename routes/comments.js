var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new",middleware.isLoggedIn,function(req,res){
	Article.findById(req.params.id, function(err, article){
		if (err){
			console.log(err);
		}
		else {
			res.render("comments/new", {article: article});
			
		} 
	})
	
});

router.post("/",middleware.isLoggedIn, function(req,res){

	Article.findById(req.params.id, function(err, article){
		if(err){
			req.flash("error", "Article not found");
			redirect("/articles");
		}
		else{
			Comment.create(req.body.comment, function (err,comment){
			 if(err){
			 	req.flash("error", "Something went wrong");
			 	redirect("/articles");
			 }
			 else{
			 	comment.author.id = req.user._id;
			 	comment.author.username = req.user.username;
			 	comment.save();
			 	article.comments.push(comment);
			 	article.save().then(req.flash("success", "Comment added succesfully")).then(res.redirect('/articles/' + article._id));
			 	
			 }
			});
		}
});
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else {
			res.render("comments/edit", {article: req.params.id, comment: foundComment});
		}
	})
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
	if(err){
		req.flash("error", "Something went wrong");
		res.redirect('back');
	}
	else{
		req.flash("success", "Comment updated");
		res.redirect("/articles/"+req.params.id)
	}
	});
});

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment deleted");
			res.redirect("/articles/" + req.params.id);
		}
	})
});


module.exports = router;