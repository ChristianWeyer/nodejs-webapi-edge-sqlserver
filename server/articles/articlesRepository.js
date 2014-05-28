var edge = require("edge"),
    q = require("q");

var repository = function () {
    var connectionString = "server=.;database=productsdemo;integrated security=true";

    return{
        listArticles: function () {
            var deferred = q.defer();

            edge.func("sql", {
                connectionString: connectionString,
                source: "select top 100 id, name from articles"
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
                source: "select id, name, code, description, imageUrl from articles where id = convert(uniqueidentifier, @id)"
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