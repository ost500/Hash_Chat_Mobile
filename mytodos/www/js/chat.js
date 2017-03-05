angular.module('mytodos.chat', ['mytodos.login-data', 'firebase'])


    .controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http, LoginData, $location, $firebase, ListData) {

        $scope.hash_tag = ListData.get_tag();


        $scope.sending = false;


        $scope.hideTime = true;

        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        ionic.Platform.isFullScreen = true;

        $scope.sendMessage = function () {


            $scope.my_api_token = LoginData.get().api_token;
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');


            if ($scope.data.message != undefined) {

                // var send = app.message('send.message',
                //     {
                //         name: LoginData.get().name,
                //         message: $scope.data.message,
                //         hash_tag: $scope.hash_tag,
                //         api_token: LoginData.get().api_token
                //     });


                $scope.chats.$add({
                    user_name: LoginData.get().name,
                    text: $scope.data.message,
                    hash_tag: $scope.hash_tag,
                    api_token: LoginData.get().api_token,
                    picture: LoginData.get().picture,
                    created_at: Date.now()
                });

                $scope.inputDown();

            }


            delete $scope.data.message;

            $ionicScrollDelegate.scrollBottom(true);


        };

        $scope.$watchCollection('chats', function () {
            console.log('watch');
            if ($location.url() == '/tab/chat') {
                $ionicScrollDelegate.scrollBottom(true);
            }
        });


        $scope.$on('$ionicView.enter', function () {

            $scope.titleName = ListData.get_tag();
            $scope.hash_tag = ListData.get_tag();

            var ref = new Firebase('https://hashchat-e36db.firebaseio.com');
            var minutes = 1000 * 60;
            var hours = minutes * 60;

            var sync = $firebase(ref.child('chat').child($scope.hash_tag).orderByChild("created_at").startAt(Date.now() - (12 * hours)));

            $scope.chats = sync.$asArray();
        });

        // (3-3) 수신된 메시지 처리
        // app.Event.listen($scope.hash_tag, function (msg) {
        //
        //
        //     var d = new Date();
        //     d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        //
        //     // $scope.messages.push({
        //     //     user_id: msg.server.data.user_id,
        //     //     user_name: msg.server.data.name,
        //     //     text: msg.server.data.message,
        //     //     time: d,
        //     //     api_token: msg.server.data.api_token
        //     // });
        //
        //     $scope.$apply();
        //
        //
        //     $ionicScrollDelegate.scrollBottom(true);
        // });


        $scope.inputUp = function () {
            // if (isIOS) $scope.data.keyboardHeight = 216;

            // delete $scope.data.message;
            console.log($location.url());
            if ($location.url() == '/tab/chat') {
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);

                }, 300);
            }
        };

        $scope.inputDown = function () {

            console.log($location.url());
            if ($location.url() == '/tab/chat') {
                $timeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);

                }, 300);
            }
        };

        $scope.closeKeyboard = function () {
            // $ionicScrollDelegate.resize();
        };


        $scope.data = {};
        $scope.my_api_token = LoginData.get().api_token;
        $scope.my_user_name = LoginData.get().name;
        $scope.messages = [];


    });
