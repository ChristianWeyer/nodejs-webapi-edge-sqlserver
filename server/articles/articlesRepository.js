var edge = require("edge"),
    q = require("q");

var repository = function () {
    var connectionString = "server=.;database=adventureworkslt2012;integrated security=true";

    return{
        listArticles: function () {
            var deferred = q.defer();

            edge.func("sql", {
                connectionString: connectionString,
                source: "select productId, name from saleslt.product"
            })(null, function (error, result) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },
        getArticleDetails: function (id) {
            var deferred = q.defer();

            edge.func("sql", {
                connectionString: connectionString,
                source: "select productId, name, productNumber, listPrice from saleslt.product where productId = @id"
            })({ id: id }, function (error, result) {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(result[0]);
                }
            });

            return deferred.promise;
        }
    };
};

module.exports = repository;