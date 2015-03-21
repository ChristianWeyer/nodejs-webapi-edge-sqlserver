app.factory("productsService", function ($http, socketService) {
    var service = {};

    service.listProducts = function() {
        return $http.get("/api/articles");
    };

    service.loadProductDetails = function (id) {
        return $http.get("/api/articles/" + id)
            .then(function(result) {
                socketService.emit('productLoaded', id);

                return result;
            });
    };

    return service;
});