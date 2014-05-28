var myApp = angular.module("myApp", ["ngRoute", "angular-loading-bar", "ttBase"]);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "app/products/products.html", controller: "productsListController" })
        .when("/products", { templateUrl: "app/products/products.html", controller: "productsListController" })
        .when("/product/:id", { templateUrl: "app/products/product.html", controller: "productDetailsController" })
        .when("/login", { templateUrl: "app/login/login.html", controller: "loginController" })
        .otherwise({ redirectTo: "/" });
});

myApp.run(function ($rootScope, tokenAuthentication, $location) {
    $rootScope.$on(tokenAuthentication.events.authenticated, function() {
        $location.path("/");
    });
    $rootScope.$on(tokenAuthentication.events.reauthenticationRequired, function() {
        $location.path("/login");
    });
});
