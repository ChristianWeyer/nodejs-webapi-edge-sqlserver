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

var app = require("express")();

var sslOptions = {
    key: fs.readFileSync("./server/setup/key.pem"),
    cert: fs.readFileSync("./server/setup/cert.pem")
};

var server = https.createServer(sslOptions, app).listen(3000);

var io = require("socket.io")(server);

var appDir = __dirname;

app.engine("walrus", consolidate.walrus);
app.set("views", appDir + "/client/app");
app.set("view engine", "walrus");
app.use(express.static(appDir + "/client"));
app.use(errorHandler);

bundleConfig.initializeBundles(appDir);

app.get("/", function (req, res) {
    res.render("index", {bundler: bundler});
});

app.use(cors());
app.use(oAuth2Server);

var articlesApi = require("./server/articles/articlesApi");
app.use("/api/articles", articlesApi);

io.on("connection", function (socket) {
    socket.on("productLoaded", function (msg) {
        console.log("Product loaded: " + msg);
        io.emit("productLoaded", msg);
    });
});

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render("error", {error: err});
}