angular.module('mytodos.register', ['mytodos.login-data'])
    .controller('RegisterCtrl', function ($scope, $timeout, $ionicPopup, $http, LoginData, $state, $ionicHistory) {

        $scope.register_info = {name: "", email: "", password: "", password_confirmation:""};


        $scope.register = function () {
            console.log($scope.register_info);
            $http.post('http://13.124.56.52/api/register', $scope.register_info)
                .success(function (response) {


                    LoginData.create(response);
                    console.log(response);
                    $ionicHistory.clearCache();
                    $scope.register_info = null;
                    $state.go('tab.setting',{},{reload:true});

                })
                .error(function (response) {
                    console.log(response);
                    $ionicPopup.alert({
                        title: "회원가입 에러",
                        template: "회원가입 정보를 다시 확인해 주세요"
                    });
                });


        };
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