var bundler = require("./bundler.js");

exports.initializeBundles = function (webRoot) {

   bundler.addBundle("~/libsJs", "js", [
      {
         baseDirectory: webRoot + "/client/",
         path: "libs",
         includeSubdirectories: true
      }
   ]);

   bundler.addBundle("~/appJs", "js", [
      {
         baseDirectory: webRoot + "/client/",
         path: "app",
         includeSubdirectories: true
      }
   ]);

    bundler.addBundle("~/libsCss", "css", [
        {
            baseDirectory: webRoot + "/client/",
            path: "libs",
            includeSubdirectories: true
        }
    ]);

    bundler.addBundle("~/appCss", "css", [
        {
            baseDirectory: webRoot + "/client/",
            path: "app",
            includeSubdirectories: true
        }
    ]);
};