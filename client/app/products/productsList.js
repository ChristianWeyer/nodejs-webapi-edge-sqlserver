myApp.controller("productsListController", function($scope, productsService, $location) {
    productsService.listProducts().then(function(result) {
        $scope.products = result.data;
    }, function(error) {
        //alert(JSON.stringify(error));
    });

    $scope.loadDetails = function(product) {
        $location.path("/product/" + product.id);
    };

    $scope.pokeAll = function() {
        productsService.pokeAll($scope.dataToPoke);
    };
});
