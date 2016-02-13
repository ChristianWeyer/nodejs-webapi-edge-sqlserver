var sql = require('mssql'),
    q = require("q");

var repository = function () {
    var config = {
        server: "windows8vm.local",
        database: "adventureworkslt2012",
        user:     "nodeuser",
        password: "resuedon"
    };

    return{
        listArticles: function () {
            var deferred = q.defer();

            sql.connect(config, function(err) {
                var request = new sql.Request();
                request.query("select productId, name from saleslt.product", function(error, result) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        deferred.resolve(result);
                    }
                });
            });

            return deferred.promise;
        },
        getArticleDetails: function (id) {
            var deferred = q.defer();

            sql.connect(config, function(err) {
                var request = new sql.Request();
                request.input("id", id);
                request.query("select productId, name, productNumber, listPrice from saleslt.product where productId = @id", function(error, result) {
                    if (error) {
                        deferred.reject(error);
                    } else {
                        if(result.length === 0) {
                            deferred.reject({ reason: "notfound" });
                        }else{
                            deferred.resolve(result[0]);
                        }
                    }
                });
            });

            return deferred.promise;
        }
    };
};

module.exports = repository;