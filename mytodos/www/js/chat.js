angular.module('mytodos.chat', [])
    .directive('input', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function (scope, element, attr) {
                element.bind('focus', function (e) {
                    if (scope.onFocus) {
                        $timeout(function () {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function (e) {
                    if (scope.onBlur) {
                        $timeout(function () {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function (e) {
                    if (e.which == 13) {
                        // if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function () {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })


    .controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http) {

        function BrainSocketPubSub() {
            this.subscriptions = [];

            this.forget = function (args) {
                for (x = 0; x < this.subscriptions.length; x++) {
                    if (this.subscriptions[x].name == args[0], this.subscriptions[x].callback == args[1])
                        this.subscriptions.splice(x, 1);
                }
            }

            this.listen = function (name, callback) {
                this.subscriptions.push({"name": name, "callback": callback});
                return [name, callback];
            }

            this.fire = function (name, args) {
                var temp = [];
                if (this.subscriptions.length > 0) {
                    for (var x = 0; x < this.subscriptions.length; x++) {
                        if (this.subscriptions[x].name == name)
                            temp.push({"fn": this.subscriptions[x].callback});
                    }
                    for (x = 0; x < temp.length; x++) {
                        temp[x].fn.apply(this, [args]);
                    }
                }
            }

        }

        function BrainSocket(WebSocketConnection, BrainSocketPubSub) {
            this.connection = WebSocketConnection;
            this.Event = BrainSocketPubSub;

            this.connection.BrainSocket = this;

            this.connection.digestMessage = function (data) {
                try {
                    var object = JSON.parse(data);

                    if (object.server && object.server.event) {
                        this.BrainSocket.Event.fire(object.server.event, object);
                    } else {
                        this.BrainSocket.Event.fire(object.client.event, object);
                    }

                } catch (e) {
                    this.BrainSocket.Event.fire(data);
                }
            }

            this.connection.onerror = function (e) {
                console.log(e);
            }

            this.connection.onmessage = function (e) {
                this.digestMessage(e.data);
            }

            this.success = function (data) {
                this.message('app.success', data);
            }

            this.error = function (data) {
                this.message('app.error', data);
            }

            this.message = function (event, data) {
                var json = {client: {}};
                json.client.event = event;

                if (!data) {
                    data = [];
                }

                json.client.data = data;

                this.connection.send(JSON.stringify(json));
            }


        }
        $http.get('/api')
            .success(function (response) {
                $scope.content=response;
            });

        console.log('again');
        var app = new BrainSocket(
            new WebSocket('ws://52.78.239.185:8080'),
            new BrainSocketPubSub()
        );



        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function () {
            alternate = !alternate;

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            // $scope.messages.push({
            //     userId: alternate ? '12345' : '54321',
            //     text: $scope.data.message,
            //     time: d
            // });

            app.message('send.message',
                {name: $scope.myId, message: $scope.data.message, hash_tag: $scope.hash_tag});


            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };


        // (3-3) 수신된 메시지 처리
        app.Event.listen($scope.hash_tag, function (msg) {
            console.log(msg.server.data.message);
            alternate = !alternate;

            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            $scope.messages.push({
                userId: msg.server.data.name,
                text: msg.server.data.message,
                time: d
            });

            $scope.$apply();

            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);
        });


        $scope.inputUp = function () {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function () {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function () {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];
        $scope.hash_tag = 'channel123';

    });
