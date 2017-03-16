angular.module('mytodos.chat', ['mytodos.login-data', 'firebase'])


    .controller('ChatCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http, LoginData, $location, $firebase, ListData, $rootScope) {


        $scope.banner_margin = true;



        $scope.ios = /(ipod|iphone|ipad)/i.test(navigator.userAgent);



        window.addEventListener('native.keyboardshow', function () {
            if (AdMob) {
                AdMob.removeBanner();
            }

        });

        window.addEventListener('native.keyboardhide', function () {


            var admobid = {};
            if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                admobid = {
                    banner: 'ca-app-pub-8665007420370986/5422744557', // or DFP format "/6253334/dfp_example_ad"
                    interstitial: 'ca-app-pub-8665007420370986/5766201359'
                };
            } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                admobid = {
                    banner: 'ca-app-pub-8665007420370986/2469278151', // or DFP format "/6253334/dfp_example_ad"
                    interstitial: 'ca-app-pub-8665007420370986/1255276555'
                };
            } else { // for windows phone
                admobid = {
                    banner: 'ca-app-pub-8665007420370986/2469278151', // or DFP format "/6253334/dfp_example_ad"
                    interstitial: 'ca-app-pub-8665007420370986/5766201359'
                };
            }

            console.log(admobid);

            if (AdMob) AdMob.createBanner({
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true,
            });
            $ionicScrollDelegate.scrollBottom(true);


        });


        var ref;

        $scope.loadNew = function () {
            $scope.titleName = ListData.get_tag();
            $scope.hash_tag = ListData.get_tag();

            var ref = new Firebase('https://mindletter-e953e.firebaseio.com');
            var minutes = 1000 * 60;
            var hours = minutes * 60;

            var sync = $firebase(ref.child('chat').child($scope.hash_tag).orderByChild("created_at").startAt(Date.now() - (12 * hours)));

            $scope.chats = sync.$asArray();

            $scope.my_api_token = LoginData.get().api_token;
            $scope.my_user_name = LoginData.get().name;
        };

        if (ref == null) {
            $scope.loadNew();
        }


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

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {


            console.log(toState);
            if (toState.url == '/chat') {
                $scope.titleName = ListData.get_tag();

                $scope.my_api_token = LoginData.get().api_token;
                $scope.my_user_name = LoginData.get().name;

                console.log('tab/chat came');
                console.log('entered');


                if (AdMob) {
                    AdMob.removeBanner();
                }


                var admobid = {};

                if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                    admobid = {
                        banner: 'ca-app-pub-8665007420370986/5422744557', // or DFP format "/6253334/dfp_example_ad"
                        interstitial: 'ca-app-pub-8665007420370986/5766201359'
                    };
                } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                    admobid = {
                        banner: 'ca-app-pub-8665007420370986/2469278151', // or DFP format "/6253334/dfp_example_ad"
                        interstitial: 'ca-app-pub-8665007420370986/1255276555'
                    };
                } else { // for windows phone
                    admobid = {
                        banner: 'ca-app-pub-8665007420370986/2469278151', // or DFP format "/6253334/dfp_example_ad"
                        interstitial: 'ca-app-pub-8665007420370986/5766201359'
                    };
                }
                console.log(admobid);
                $timeout(function () {
                    if (AdMob) AdMob.createBanner({
                        adId: admobid.banner,
                        position: AdMob.AD_POSITION.BOTTOM_CENTER,
                        autoShow: true,
                    });
                }, 300);


            }
        });

        //
        // $scope.$on('$ionicView.loaded', function (scopes, states) {
        //
        //
        //     $scope.titleName = ListData.get_tag();
        //     $scope.hash_tag = ListData.get_tag();
        //
        //     var ref = new Firebase('https://mindletter-e953e.firebaseio.com');
        //     var minutes = 1000 * 60;
        //     var hours = minutes * 60;
        //
        //     var sync = $firebase(ref.child('chat').child($scope.hash_tag).orderByChild("created_at").startAt(Date.now() - (12 * hours)));
        //
        //     $scope.chats = sync.$asArray();
        //
        //     $scope.my_api_token = LoginData.get().api_token;
        //     $scope.my_user_name = LoginData.get().name;
        // });

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
