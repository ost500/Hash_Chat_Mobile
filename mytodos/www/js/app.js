// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mytodos',
    ['ionic', 'mytodos.chat', 'mytodos.login', 'mytodos.register', 'mytodos.profile',
        'mytodos.list', 'mytodos.album', 'firebase', 'ngCordova'])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


        $ionicConfigProvider.tabs.position('top');

        $ionicConfigProvider.views.swipeBackEnabled(false);

        $stateProvider

            .state('tab', {
                url: "/tab",

                templateUrl: "templates/tabs.html",
                controller: 'TabCtrl'
            })
            .state('tab.search', {
                url: '/list',
                views: {
                    'tab-search': {
                        templateUrl: 'templates/list.html',
                        controller: 'ListCtrl'
                    }
                }

            })


            .state('tab.chat', {
                url: '/chat',
                views: {
                    'tab-chat': {
                        templateUrl: 'templates/chat.html',
                        controller: 'ChatCtrl'
                    }
                }

            })
            .state('tab.album', {
                url: '/album',
                views: {
                    'tab-album': {
                        templateUrl: 'templates/album.html',
                        controller: 'AlbumCtrl'
                    }
                }

            })
            .state('tab.album_create', {
                url: '/album_create',
                views: {
                    'tab-album': {
                        templateUrl: 'templates/album_create.html',
                        controller: 'AlbumCreateCtrl'
                    }
                }

            })

            .state('tab.album_detail', {
                url: '/album_detail/:id',
                views: {
                    'tab-album': {
                        templateUrl: 'templates/album_detail.html',
                        controller: 'AlbumDetailCtrl'
                    }
                }

            })

            .state('tab.setting', {
                url: '/setting',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/setting.html',
                        controller: 'SettingCtrl'
                    }
                }

            })


            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }

            })
            .state('tab.osteng', {
                url: '/login_osteng',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/login_osteng.html',
                        controller: 'LoginOstCtrl'
                    }
                }

            })
            .state('tab.register', {
                url: '/register',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/register.html',
                        controller: 'RegisterCtrl'
                    }
                }

            })
            .state('tab.profile', {
                url: '/profile',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    }
                }

            });

        // $stateProvider.state('edit', {
        //     url: '/edit',
        //     templateUrl: 'templates/chat.html',
        //     controller: 'EditCtrl'
        // });
        //
        // $stateProvider.state('add', {
        //     url: '/add',
        //     templateUrl: 'templates/chat.html',
        //     controller: 'AddCtrl'
        // });
        //
        // $stateProvider.state('album', {
        //     url: '/album',
        //     templateUrl: 'templates/album.html',
        //     controller: 'AlbumCtrl'
        // });

        $urlRouterProvider.otherwise('/tab/list');


    })


    .controller('TabCtrl', function ($scope) {
        $scope.network = false;

        document.addEventListener("offline", function () {
            $scope.network = true;
            console.log('network false');
        }, false);

        document.addEventListener("online", function () {
            $scope.network = false;
            console.log('network true');

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

            if (window.AdMob) window.AdMob.createBanner({
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true
            });
            //
            // // preppare and load ad resource in background, e.g. at begining of game level
            // if (window.AdMob) window.AdMob.prepareInterstitial({
            //     adId: admobid.interstitial,
            //     autoShow: true
            // });

            // show the interstitial later, e.g. at end of game level
            // if (window.AdMob) window.AdMob.showInterstitial();


        }, true);

    })
    .controller('LoginCtrl', function ($scope, $location, $ionicHistory, $ionicPopup, $ionicNavBarDelegate) {
        $scope.myGoBack = function () {
            console.log("go back");
            $ionicHistory.goBack();
        };
        $ionicNavBarDelegate.showBackButton(true);

        $scope.notready = function (social) {
            console.log('not raedy');
            var alertPopup = $ionicPopup.alert({
                title: social + ' 로그인 서비스 준비 중입니다'

            });

            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        }
    })

    .controller('FootCtrl', function ($scope, $ionicTabsDelegate) {
        $scope.selectTabWithIndex = function (index) {
            $ionicTabsDelegate.select(index);
        }
    })


    .controller('AddCtrl', function ($scope, $state, TodoData) {
        $scope.todo = {
            id: new Date().getTime().toString(),
            title: '',
            description: '',
            complete: false
        };

        $scope.save = function () {
            TodoData.create($scope.todo);
            $state.go('list');
        };
    })

    .controller('EditCtrl', function ($scope, $state, TodoData) {
        $scope.todo = angular.copy(TodoData.get($state.params.todoId));
        //기존 값을 건드리지 않기 위해 angular.copy 이용
        $scope.save = function () {
            TodoData.update($scope.todo);
            $state.go('list');
        };
    })

    .controller('FootCtrl', function ($scope, $location) {
        console.log($location.url());
        if ($location.url() == '/list') {

        }
    })


    .controller('MyCtrl', function ($scope, $location) {
        $scope.myGoBack = function () {

            $location.path('/tab/setting');

        };
    })


    .controller('SettingCtrl', function ($scope, $location, LoginData, $ionicNavBarDelegate, $http, $rootScope, $ionicPopup) {
        $ionicNavBarDelegate.showBackButton(true);

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log(toState);
            if (toState.url == '/setting') {
                var login_data = LoginData.get();
                $scope.name = login_data.name;
                $scope.email = login_data.email;
                $scope.picture = login_data.picture;
            }
        });

        var login_data = LoginData.get();
        $scope.name = login_data.name;
        $scope.email = login_data.email;
        $scope.picture = login_data.picture;

        $scope.album_detail = function (id) {

            $location.path('/tab/album_detail/' + id);
        };


        $scope.$on('$ionicView.enter', function () {
            var login_data = LoginData.get();
            $scope.name = login_data.name;
            $scope.email = login_data.email;
            $scope.picture = login_data.picture;

        });


        console.log('setting hihi');
        $scope.login_or_profile = function () {
            console.log('hihi');
            if (!login_data.loggedin) {
                $location.path('/tab/login');
            } else {
                $location.path('/tab/profile');
            }

        };
        console.log($location.path());

        $ionicNavBarDelegate.showBackButton(false);


        var page = 1;
        $scope.posts = [];
        $scope.moreDataCanBeLoaded = true;

        function loadList(page, callback) {
            console.log('http://13.124.56.52/api/my_posts?page=' + page);
            $http.get('http://13.124.56.52/api/my_posts?page=' + page + '&api_token=' + login_data.api_token)
                .success(function (response) {
                    var posts = [];
                    if (response.length === 0) {
                        $scope.moreDataCanBeLoaded = false;
                    }
                    angular.forEach(response, function (data) {
                        console.log(data);
                        posts.push(data);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    callback(posts);
                });
        }

        $scope.loadNew = function () {

            page = 1;
            $scope.moreDataCanBeLoaded = true;

            loadList(page, function (newData) {
                $scope.posts = newData;
            });
        };

        $scope.loadMore = function () {
            console.log($scope.posts.length);
            if ($scope.posts.length > 0) {
                page = page + 1;
            }
            console.log(page);
            if ($scope.moreDataCanBeLoaded) {
                loadList(page, function (moreData) {
                    $scope.posts = $scope.posts.concat(moreData);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }


        };


        $scope.destroy = function () {


            $ionicPopup.confirm({
                title: '삭제',
                template: '삭제 하시겠습니까?',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: '삭제',
                    type: 'button-positive',
                    onTap: function (e) {
                        $http.delete('http://13.124.56.52/api/posts/' + $stateParams.id + '?api_token=' + LoginData.get().api_token,
                            {})
                            .success(function (response) {

                                $location.path('/tab/album');

                            }).error(function (response) {

                            $ionicPopup.alert({
                                title: "에러",
                                template: response
                            });
                        });
                    }
                }, {
                    text: '취소',
                    type: 'button-default',
                    onTap: function (e) {

                    }
                }]
            });


        }


    })


    .run(function ($ionicPlatform, $rootScope) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
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

            if (window.AdMob) window.AdMob.createBanner({
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true,
            });

            // preppare and load ad resource in background, e.g. at begining of game level
            // if (window.AdMob) window.AdMob.prepareInterstitial({
            //     adId: admobid.interstitial,
            //     autoShow: false
            // });

            window.FirebasePlugin.getToken(function (token) {
                // save this server-side and use it to push notifications to this device
                console.log("TOKEN!" + token);
                LoginData.save_token(token);
            }, function (error) {
                console.error("TOKEN!Error" + error);
            });


        });
    });
