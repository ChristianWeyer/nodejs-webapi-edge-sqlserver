var express = require("express");
var server = express();

var articles = require("./articles/articlesApi");
server.use("/api/articles", articles);

server.listen(3000);
