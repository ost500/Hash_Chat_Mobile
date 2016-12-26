angular.module('mytodos.profile', ['mytodos.login-data'])

    .controller('ProfileCtrl', function ($scope, $timeout, $ionicScrollDelegate, $http, LoginData, $ionicPopup) {

        var login_data = LoginData.get();
        console.log(login_data);



            $scope.name = login_data.name;
            $scope.email = login_data.email;
            $scope.profile_image = login_data.profile_image;
            $scope.loggedin = login_data.loggedin;



        $scope.logout = function(){
            console.log('logout');
            LoginData.logout();

            $scope.name = login_data.name;
            $scope.email = login_data.email;
            $scope.profile_image = login_data.profile_image;

            $ionicPopup.alert({
                title: "로그아웃",
                template: "로그아웃 했습니다"
            });

        };

        $scope.edit = function(){
            console.log('edit');
            // LoginData.edit();
        };


    });
