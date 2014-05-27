var express = require("express"),
    oAuth2Server = require("./security/oAuth2Server");
var server = express();

server.use(oAuth2Server);

var articles = require("./articles/articlesApi");
server.use("/api/articles", articles);

server.listen(3000);
