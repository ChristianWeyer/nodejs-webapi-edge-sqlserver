var express = require("express"),
    q = require("q");

var router = express.Router();

var ArticlesRepository = require("./articlesRepository");
var articlesRepository = new ArticlesRepository();

router.get("/", function (req, res) {
    articlesRepository.listArticles().then(
        function (articles) {
            res.json(articles);
        }, function (error) {
            throw error;
        });
});

router.get("/:id", function (req, res) {
    articlesRepository.getArticleDetails(req.params.id).then(
        function (articleDetails) {
            res.json(articleDetails);
        }, function (error) {
            throw error;
        });
});

module.exports = router;
