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
        listArticles: edge.func("sql", listArticlesConfig),
        getArticleDetails: edge.func("sql", getArticleDetailsConfig)
    };
}