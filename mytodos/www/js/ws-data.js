angular.module('mytodos.ws-data', [])
    .factory('WSData', function () {

        console.log('again');
        var app = new BrainSocket(
            new WebSocket('ws://52.78.208.21:8080'),
            new BrainSocketPubSub()
        );

        return {
            get: function () {
                return app;
            },
            refresh: function () {
                app = new BrainSocket(
                    new WebSocket('ws://52.78.208.21:8080'),
                    new BrainSocketPubSub()
                );
                return app;
            },
            status: function(){

            }

        }
    });
