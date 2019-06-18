var express = require("express");
var router = express.Router();

var Article = require("../models/article");
var middleware = require("../middleware");




router.get("/", function(req, res) {
    Article.find({}, function(err, allArticles) {
        if (err) {
            console.log(err);
        } else {
            res.render("articles/index", {
                articles: allArticles

            });
        }
    })

});

router.post("/", middleware.isLoggedIn, function(req, res) {
    var image = req.body.image;
    var price = req.body.price;
    var name = req.body.name;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newArticle = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };


    Article.create(newArticle, function(err, newlyCreated) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/articles")
        } else {
            
            res.redirect("/articles")
        }
    });

});
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("articles/new.ejs");

});

router.get("/:id", function(req, res) {
    Article.findById(req.params.id).populate("comments").exec(function(err, foundArticle) {
        if (err) {
            req.flash("error", "Article not found");
            res.redirect("/articles")
        } else {

            res.render("articles/show", {
                article: foundArticle
            });
        }
    });
});

router.get("/:id/edit",middleware.checkArticleOwnership, function(req, res) {
        Article.findById(req.params.id, function(err, foundArticle) {
             if (err) {
            req.flash("error", "Article not found");
            res.redirect("/articles")
        } else { console.log(foundArticle);

                    res.render("articles/edit", {

                        article: foundArticle
                    }
                    );
                }
                });
        });



router.put("/:id", middleware.isLoggedIn, function(req, res) {
    Article.findByIdAndUpdate(req.params.id, req.body.article, function(err, updatedArticle) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/articles");
        } else {
            req.flash("success", "Article updated");
            res.redirect("/articles/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    Article.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("/articles");
        } else {
            req.flash("success", "Article deleted");
            res.redirect("/articles");
        }


    });

});


module.exports = router;