angular.module('mytodos.chat', ['mytodos.login-data'])
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


    .controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http, LoginData) {

        // console.log(LoginData.get());

        // $http.post('/api/login', {"email": "foo@example.com", "password": "secret"})
        //     .success(function (response) {
        //
        //         $scope.login = {
        //             email: "foo@example.com",
        //             api_key: response
        //         };
        //         LoginData.create($scope.login);
        //
        //     });
        //
        //
        // console.log(LoginData.get());

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

            console.log($scope.data.message);

            if ($scope.data.message != undefined) {
                var send = app.message('send.message',
                    {
                        user_id: $scope.myId,
                        name: $scope.my_user_name,
                        message: $scope.data.message,
                        hash_tag: $scope.hash_tag,
                        api_key: $scope.api_key
                    });

            }


            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };

        // (3-3) 수신된 메시지 처리
        app.Event.listen($scope.hash_tag, function (msg) {
            console.log(msg.server.data.message);


            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            $scope.messages.push({
                user_id : msg.server.data.user_id,
                user_name: msg.server.data.name,
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
        $scope.myId = "익명";
        $scope.my_user_name = LoginData.get().name;
        $scope.messages = [];
        $scope.hash_tag = 'channel123';

    });
