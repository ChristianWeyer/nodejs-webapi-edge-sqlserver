myApp.controller("loginController", function ($scope, tokenAuthentication) {
    $scope.user = {
        remember: true
    };

    $scope.login = function () {
        tokenAuthentication.login($scope.user.username, $scope.user.password, $scope.user.remember, { clientId: "foo", clientSecret: "bar" })
            .then(function (result) {
            }, function (error) {
            });
    };
});
