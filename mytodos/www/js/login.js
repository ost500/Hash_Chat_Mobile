angular.module('mytodos.login', ['mytodos.login-data'])
    .controller('LoginOstCtrl', function ($scope, $timeout, $ionicPopup, $http, LoginData, $window, $ionicNavBarDelegate) {

        $scope.login_info = {email: "", password: ""};


        $scope.logIn = function () {
            $http.post('/api/login', $scope.login_info)
                .success(function (response) {


                    LoginData.create(response);
                    $window.location.href('#/tab/setting');

                })
                .error(function (response) {

                    $ionicPopup.alert({
                        title: "로그인 에러",
                        template: "이메일과 비밀번호를 다시 확인해 주세요"
                    });
                });


        };

        $scope.register = function () {
            $location.path('/tab/register');
        };

        $ionicNavBarDelegate.showBackButton(true);

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
        console.log("let's go");

    });