angular.module('mytodos.profile', ['mytodos.login-data'])

    .controller('ProfileCtrl', function ($scope, $state, $ionicScrollDelegate, $http, LoginData, $ionicPopup, $ionicNavBarDelegate) {

        var login_data = LoginData.get();
        console.log(login_data);

        $scope.profile_data = {};

        $scope.profile_data.name = login_data.name;
        $scope.profile_data.email = login_data.email;
        $scope.profile_data.profile_image = login_data.profile_image;
        $scope.profile_data.loggedin = login_data.loggedin;


        $scope.logout = function () {
            console.log('logout');
            LoginData.logout();

            $scope.profile_data.name = login_data.name;
            $scope.profile_data.email = login_data.email;
            $scope.profile_data.profile_image = login_data.profile_image;

            $ionicPopup.alert({
                title: "로그아웃",
                template: "로그아웃 했습니다"
            });
            $state.go('tab.setting');
        };

        $scope.edit = function () {
            console.log($scope.profile_data.email);
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://52.78.239.185/api/edit_user?api_token=' + login_data.api_token
                + "&name=" + $scope.profile_data.name
                + "&email=" + $scope.profile_data.email
                , {

                }, config)
                .success(function (response) {
                    console.log(response);

                    LoginData.edit(response);

                    $ionicPopup.alert({
                        title: "프로필 수정 성공",

                    });

                })
                .error(function (response) {

                    $ionicPopup.alert({
                        title: "로그인 에러",
                        template: "이메일과 비밀번호를 다시 확인해 주세요"
                    });
                });


            // LoginData.edit();
        };

        $ionicNavBarDelegate.showBackButton(true);

    });
