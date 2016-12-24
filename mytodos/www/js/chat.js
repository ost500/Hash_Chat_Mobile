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


        $http.post('/api/login', {"email": "foo@example.com", "password": "secret"})
            .success(function (response) {
                console.log(response);
            });


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
                {name: alternate ? '12345' : '54321', message: $scope.data.message, hash_tag: $scope.hash_tag});


            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };


        // (3-3) 수신된 메시지 처리
        app.Event.listen($scope.hash_tag, function (msg) {
            console.log(msg.server.data.message);


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
