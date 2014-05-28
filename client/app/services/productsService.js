myApp.factory("productsService", function ($http) {
    var service = {};

    service.listProducts = function() {
        return $http.get("/api/articles");
    };

    service.loadProductDetails = function (id) {
        return $http.get("/api/articles/" + id);
    };

    return service;
});