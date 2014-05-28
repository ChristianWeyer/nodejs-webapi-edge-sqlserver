myApp.controller("navbarController", function ($scope, $rootScope) {
    $scope.$watch("searchText", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $rootScope.$broadcast("searchTextChanged", newVal);
        }
    });
});

myApp.directive("ttNavbar", function () {
    return {
        restrict: "EA",
        templateUrl: "app/navigation/navigation.html",
        controller: "navbarController"
    };
});