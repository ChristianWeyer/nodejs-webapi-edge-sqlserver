var bundler = require("./bundler.js");

exports.initializeBundles = function (webRoot) {

    bundler.addBundle("~/js", "js", [
        {
            baseDirectory: webRoot + "/client/",
            path: "libs",
            includeSubdirectories: true
        },
        {
            baseDirectory: webRoot + "/client/",
            path: "app",
            includeSubdirectories: true
        }
    ]);

    bundler.addBundle("~/css", "css", [
        {
            baseDirectory: webRoot + "/client/",
            path: "libs",
            includeSubdirectories: true
        },
        {
            baseDirectory: webRoot + "/client/",
            path: "app",
            includeSubdirectories: true
        }
    ]);
};