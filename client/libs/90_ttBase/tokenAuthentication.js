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

        this.login = function login(username, password, rememberMe, config) {
            store = rememberMe ? localStorage : sessionStorage;
            var postData = $.param({ grant_type: "password", username: username, password: password });

            if(config) {
                var encoded = Base64.encode(config.clientId + ":" + config.clientSecret);
                $http.defaults.headers.common["Authorization"] = "Basic " + encoded;
            }

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

        this.checkForValidToken();
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

    var Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = 0;
            var c1 = 0;
            var c2 = 0;
            var c3 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }

            return string;
        }
    }
})();
