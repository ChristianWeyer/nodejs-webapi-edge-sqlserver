var fs = require("fs"),
    https = require("https"),
    express = require("express"),
    cors = require("cors"),
    oAuth2Server = require("./security/oAuth2Server");

var server = express();
server.use(cors());
//server.use(oAuth2Server);

var articles = require("./articles/articlesApi");
server.use("/api/articles", articles);

var sslOptions = {
    key: fs.readFileSync("./setup/key.pem"),
    cert: fs.readFileSync("./setup/cert.pem")
};
https.createServer(sslOptions, server).listen(3000);
