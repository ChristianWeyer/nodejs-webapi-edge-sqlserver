var _ = require("underscore");

var Article = require("./article"),
    ArticleDetails = require("./articleDetails");

module.exports = function () {
    return{
        mapCollection: function (data, fn, callback) {
            var collection = [];
            _.each(data, function (item) {
                fn(item, function (dto) {
                    collection.push(dto)
                });
            });
            return callback(collection);
        },
        mapArticle: function (data, callback) {
            var a = new Article(data.Id, data.Name);
            return callback(a);
        },
        mapArticleDetails: function (data, callback) {
            var a = new ArticleDetails(data.Id, data.Name, data.Code, data.Description, data.ImageUrl);
            return callback(a);
        }
    }
}
