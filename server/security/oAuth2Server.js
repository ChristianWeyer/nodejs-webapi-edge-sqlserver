var express = require("express"),
    bodyParser = require("body-parser"),
    oAuthServer = require("node-oauth2-server"),
    inMemoryStore = require("./oAuth2InMemoryModel");
var server = express();

server.oauth = oAuthServer({
    model: inMemoryStore,
    grants: ["password"],
    debug: true
});

server.use(bodyParser());
server.all('/token', server.oauth.grant());
server.all('*', server.oauth.authorise());
server.use(server.oauth.errorHandler());

module.exports = server;