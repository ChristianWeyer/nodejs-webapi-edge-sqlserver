app.controller("navbarController", function ($scope, $rootScope, socketService) {

    socketService.on("productLoaded", function (msg) {
        $scope.$apply($scope.loadedProduct = msg);
    });

    $scope.$watch("searchText", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $rootScope.$broadcast("searchTextChanged", newVal);
        }
    });
});

app.directive("ttNavbar", function () {
    return {
        restrict: "EA",
        templateUrl: "app/navigation/navigation.html",
        controller: "navbarController"
    };
});