﻿myApp.controller("navbarController", function ($scope, $location) {

});

myApp.directive("ttNavbar", function () {
    return {
        restrict: "EA",
        templateUrl: "app/navigation/navigation.html",
        controller: "navbarController"
    };
});