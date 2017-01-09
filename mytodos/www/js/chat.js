angular.module('mytodos.chat', ['mytodos.login-data', 'mytodos.ws-data'])


    .controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http, LoginData, WSData) {

        $scope.sending = false;

        var app = WSData.get();

        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        ionic.Platform.isFullScreen = true;

        $scope.sendMessage = function () {

            $scope.sending = true;

            $timeout(function () {
                $scope.sending = false;
                console.log('hi');
            }, 300);


            $scope.my_api_token = LoginData.get().api_token;
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            // $scope.messages.push({
            //     userId: alternate ? '12345' : '54321',
            //     text: $scope.data.message,
            //     time: d
            // });


            if ($scope.data.message != undefined) {

                var send = app.message('send.message',
                    {
                        name: LoginData.get().name,
                        message: $scope.data.message,
                        hash_tag: $scope.hash_tag,
                        api_token: LoginData.get().api_token
                    });

            }


            cordova.plugins.Keyboard.focusOffset(0);


            delete $scope.data.message;

            $ionicScrollDelegate.scrollBottom(true);


        };

        // (3-3) 수신된 메시지 처리
        app.Event.listen($scope.hash_tag, function (msg) {


            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            $scope.messages.push({
                user_id: msg.server.data.user_id,
                user_name: msg.server.data.name,
                text: msg.server.data.message,
                time: d,
                api_token: msg.server.data.api_token
            });

            $scope.$apply();


            $ionicScrollDelegate.scrollBottom(true);
        });


        $scope.inputUp = function () {
            // if (isIOS) $scope.data.keyboardHeight = 216;

            delete $scope.data.message;

        };

        $scope.inputDown = function () {

            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        };

        $scope.closeKeyboard = function () {
            // $ionicScrollDelegate.resize();
        };

        console.log('chatctrl!!');


        $scope.data = {};
        $scope.my_api_token = LoginData.get().api_token;
        $scope.my_user_name = LoginData.get().name;
        $scope.messages = [];
        $scope.hash_tag = 'channel123';

    });
