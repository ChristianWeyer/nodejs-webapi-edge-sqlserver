var express = require("express");
var router = express.Router();

var ArticlesRepository = require("./articlesRepository");
var articlesRepository = new ArticlesRepository();

router.get("/", function(req, res) {
    // TODO: clean API into repository with promises
    articlesRepository.listArticles(function(error, articles) {
        if(error) throw error;
        res.json(articles);
    });
});

router.get("/:id", function(req, res) {
    // TODO: clean API into repository with promises
    articlesRepository.getArticleDetails(req.params.id, function(error, articleDetails) {
        if(error) throw error;
        res.json(articleDetails);
    });
});

module.exports = router;
