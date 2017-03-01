// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mytodos',
    ['ionic', 'mytodos.chat', 'mytodos.login', 'mytodos.register', 'mytodos.profile',
        'mytodos.list', 'mytodos.album', 'firebase'])

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


        $ionicConfigProvider.tabs.position('top');

        $stateProvider

            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html",
                controller: 'SettingCtrl'
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


    .controller('SettingCtrl', function ($scope, $location, LoginData, $ionicNavBarDelegate) {

        var login_data = LoginData.get();
        $scope.name = login_data.name;
        $scope.email = login_data.email;

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


    })


    .run(function ($ionicPlatform) {
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
        });
    });
