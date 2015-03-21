(function () {
    "use strict";

    /**
     * @constructor
     */
    function SocketService() {
        var socket = io();

        return socket;
    }

    app.factory('socketService', SocketService);
})();
