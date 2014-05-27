var _ = require("underscore");

var Article = require("./article"),
    ArticleDetails = require("./articleDetails");

var mapper = function () {
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
            var a = new Article(data.id, data.name);
            return callback(a);
        },
        mapArticleDetails: function (data, callback) {
            var a = new ArticleDetails(data.id, data.name, data.code, data.description, data.imageUrl);
            return callback(a);
        }
    }
};

module.exports = mapper;
