var fs = require("fs"),
    https = require("https"),
    express = require("express"),
    cors = require("cors"),
    walrus = require("walrus"),
    consolidate = require("consolidate"),
    path = require("path"),
    oAuth2Server = require("./server/security/oAuth2Server"),
    bundleConfig = require("./server/bundling/bundleConfig.js"),
    bundler = require("./server/bundling/bundler.js");

var server = express();

var appDir = __dirname;

server.engine("walrus", consolidate.walrus);
server.set("views", appDir + "/client/app");
server.set("view engine", "walrus");
server.use(express.static(appDir + "/client"));

bundleConfig.initializeBundles(appDir);

server.get("/",  function (req, res) {
    res.render("index", { bundler: bundler });
});

server.use(cors());
server.use(oAuth2Server);

var articlesApi = require("./server/articles/articlesApi");
server.use("/api/articles", articlesApi);

var sslOptions = {
    key: fs.readFileSync("./server/setup/key.pem"),
    cert: fs.readFileSync("./server/setup/cert.pem")
};

https.createServer(sslOptions, server).listen(3000);
