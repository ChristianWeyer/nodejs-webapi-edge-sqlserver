(function () {
    "use strict";

    var events = {
        reauthenticationRequired: "tt:authentication:reauthenticationRequired",
        authenticated: "tt:authentication:authenticated"
    };

    /**
     * @param $injector
     * @param $q
     * @param $http
     * @constructor
     */
    ttBase.TokenAuthentication = function ($rootScope, $injector, $q, $http) {
        var key = "tt:authentication:authNToken";
        var store = localStorage;

        this.events = {
            reauthenticationRequired: events.reauthenticationRequired,
            authenticated: events.authenticated
        };

        this.login = function login(username, password, rememberMe) {
            store = rememberMe ? localStorage : sessionStorage;
            var postData = $.param({ grant_type: "password", username: username, password: password });

            return $http({
                method: "POST",
                url: "/token",
                data: postData,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }).then(function (result) {
                setToken(result.data);
            });
        };

        this.logout = function logout() {
            store.removeItem(key);

            delete $http.defaults.headers.common["Authorization"];
        };

        this.checkForValidToken = function checkForValidToken() {

            return getToken().then(function (tokenData) {
                if (!tokenData) {
                    return $q.reject(false);
                } else {
                    if (new Date().getTime() > tokenData.expiration) {
                        return $q.reject(false);
                    } else {
                        setToken(tokenData);
                        return true;
                    }
                }
            });
        };

        function setToken(tokenData) {
            if (!tokenData.expiration) {
                tokenData.expiration = new Date().getTime() + (tokenData.expires_in - 500) * 1000;
            }

            $http.defaults.headers.common["Authorization"] = "Bearer " + tokenData.access_token;

            store.setItem(key, JSON.stringify(tokenData));
            $rootScope.$broadcast(events.authenticated);
        }

        function getToken() {
            var token = JSON.parse(store.getItem(key));
            return $q.when(token);
        }
    };


    function tokenAuthenticationHttpInterceptor($q, $rootScope, $injector) {
        var tokenAuthentication;

        return {
            responseError: function (rejection) {
                tokenAuthentication = tokenAuthentication || $injector.get("tokenAuthentication");

                if (rejection.status === 401 || rejection.status === 400) {
                    tokenAuthentication.logout();
                    $rootScope.$broadcast(events.reauthenticationRequired);
                }

                return $q.reject(rejection);
            }
        };
    }

    ttBase.module.service("tokenAuthentication", ttBase.TokenAuthentication);
    ttBase.module.factory("tokenAuthenticationHttpInterceptor", tokenAuthenticationHttpInterceptor);

    ttBase.module.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("tokenAuthenticationHttpInterceptor");
    }]);
})();
