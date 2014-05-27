var edge = require("edge");

module.exports = function(){
    var connectionString = "server=.;database=productsdemo;integrated security=true";

    var listArticlesConfig = {
        connectionString: connectionString,
        source: "select top 10 id, name from articles"
    };

    var getArticleDetailsConfig = {
        connectionString: connectionString,
        source: "select * from articles where id = convert(uniqueidentifier, @id)"
    };

    return{
        listArticles: function(callback){
            edge.func("sql", listArticlesConfig)(null, function(error, result){
                if(error) return callback(error, null);
                return callback(null, result);
            });
        },
        getArticleDetails: function(id, callback){
            edge.func("sql", getArticleDetailsConfig)({ id: id }, function(error, result){
                if(error) return callback(error, null);
                return callback(null, result);
            });
        }
    };
}
