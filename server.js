// TODO: Repository (DAL); service (BL); web api (Facade)

var express = require("express"),
	edge = require("edge");

var connectionString = "server=.;database=productsdemo;integrated security=true";

var listArticlesConfig = {
    connectionString: connectionString,
    source: "select top 10 id, name from articles"
};

var getArticleDetailsConfig = {
    connectionString: connectionString,
    source: "select * from articles where id = convert(uniqueidentifier, @id)"
};

var listArticles = edge.func("sql", listArticlesConfig);
var getArticleDetails = edge.func("sql", getArticleDetailsConfig);

var server = express();

server.get("/api/articles", function(req, res) {
	listArticles(null, function(error, result) {
		if(error) throw error;
		res.json(result);
	});
});

server.get("/api/articles/:id", function(req, res) {
	getArticleDetails({ id: req.params.id }, function(error, result) {
		if(error) throw error;
		res.json(result);
	});
});

server.listen(3000);
