angular.module('mytodos.login', ['mytodos.login-data'])
    .controller('LoginOstCtrl', function ($scope, $timeout, $ionicPopup, $http, LoginData, $state, $location, $ionicNavBarDelegate) {

        $scope.login_info = {"email": "", "password": "", "token": LoginData.get_token()};

        console.log("token!!!" + $scope.login_info);

        $scope.logIn = function () {
            console.log("token!!!" + $scope.login_info);
            $http.post('/api/login', $scope.login_info)
                .success(function (response) {

                    console.log("--------");
                    console.log(response);
                    console.log("--------");
                    LoginData.create(response);
                    $state.go('tab.setting');

                })
                .error(function (response) {
                    console.log(response);
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
