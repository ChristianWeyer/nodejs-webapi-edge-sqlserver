var express = require('express');
var router = express.Router();

var ArticlesRepository = require("./articlesRepository");
var articlesRepository = new ArticlesRepository();

router.get("/", function(req, res) {
    articlesRepository.listArticles(null, function(error, result) {
        if(error) throw error;
        res.json(result);
    });
});

router.get("/:id", function(req, res) {
    articlesRepository.getArticleDetails({ id: req.params.id }, function(error, result) {
        if(error) throw error;
        res.json(result);
    });
});

module.exports = router;