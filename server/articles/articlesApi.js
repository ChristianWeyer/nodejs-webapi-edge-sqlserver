var express = require("express"),
    q = require("q");

var ArticlesRepository = require("./articlesRepository");
var articlesRepository = new ArticlesRepository();

var DataMapper = require("./dataMapper");
var dataMapper = new DataMapper();

var router = express.Router();

router.get("/", function (req, res) {
    articlesRepository.listArticles().then(
        function (articles) {
            dataMapper.mapCollection(articles, dataMapper.mapArticle, function (dataCollection) {
                res.json(dataCollection);
            });
        }, function (error) {
            throw error;
        });
});

router.get("/:id", function (req, res) {
    articlesRepository.getArticleDetails(req.params.id).then(
        function (articleDetails) {
            dataMapper.mapArticleDetails(articleDetails, function (data) {
                res.json(data);
            });
        }, function (error) {
            if(error.reason === "notfound"){
                res.send(404, { error: "Article not found." });
            } else {
                throw error;
            }
        });
});

module.exports = router;
