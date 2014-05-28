myApp.controller("productsListController", function($scope, productsService, $location, $rootScope) {
    productsService.listProducts().then(function(result) {
        $scope.products = result.data;
    }, function(error) {
        //alert(JSON.stringify(error));
    });

    $scope.loadDetails = function(product) {
        $location.path("/product/" + product.id);
    };

    $rootScope.$on("searchTextChanged", function(evt, searchText) {
        $scope.searchText = searchText;
    });
});
