angular.module('mytodos.ws-data', [])
    .factory('WSData', function () {

        console.log('again');
        var app = new BrainSocket(
            new WebSocket('ws://52.78.239.185:8080'),
            new BrainSocketPubSub()
        );

        return {
            get: function () {
                return app;
            },

        }
    });
