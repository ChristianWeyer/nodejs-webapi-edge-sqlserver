var edge = require("edge"),
    q = require("q");

module.exports = function(){
    var connectionString = "server=.;database=productsdemo;integrated security=true";

    var listArticlesConfig = {
        connectionString: connectionString,
        source: "select top 10 id, name from articles"
    };

    var getArticleDetailsConfig = {
        connectionString: connectionString,
        source: "select id, name, code, description, imageUrl from articles where id = convert(uniqueidentifier, @id)"
    };

    return{
        listArticles: function(){
            var deferred = q.defer();

            edge.func("sql", listArticlesConfig)(null, function(error, result){
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(result);
                }
            });

            return deferred.promise;
        },
        getArticleDetails: function(id){
            var deferred = q.defer();

            edge.func("sql", getArticleDetailsConfig)({ id: id }, function(error, result){
                if(error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(result[0]);
                }
            });

            return deferred.promise;
        }
    };
}
