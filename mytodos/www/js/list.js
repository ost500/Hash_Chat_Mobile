angular.module('mytodos.list', ['mytodos.list-data'])
    .controller('ListCtrl', function ($http, $scope, ListData, $ionicPopup, $location) {


        var tag = ListData.get_tag();

        $scope.loadNew = function () {

            $http.get('http://13.124.56.52/api/hashtag?tag=' + ListData.get_tag())
                .success(function (response) {
                    console.log(response);

                    $scope.hashtags = response;

                    $scope.$broadcast('scroll.refreshComplete');
                });

            $http.get('http://13.124.56.52/api/hash_tag_picture?tag=' + tag)
                .success(function (response) {


                    $scope.picture.addr = response.picture;
                    console.log($scope.picture);
                    $scope.$broadcast('scroll.refreshComplete');
                });


        };

        if ($scope.hashtags == null) {
            $scope.loadNew();
        }


        $scope.loadNew();


        $scope.hashtags = "";


        $scope.search = false;


        $scope.search_text = {
            text: ""
        };
        $scope.picture = {
            addr: "",

        };


        $scope.search_change = function () {

            console.log($scope.search_text.text);

            if ($scope.search_text.text == "") {
                $scope.search = false;

                $http.get('http://13.124.56.52/api/hashtag?tag=' + ListData.get_default_tag())
                    .success(function (response) {
                        console.log(response);

                        $scope.hashtags = response;

                    });

                return;
            }

            $scope.search = true;

            $http.get('http://13.124.56.52/api/hashtag?tag=' + $scope.search_text.text)
                .success(function (response) {
                    console.log(response);

                    $scope.hashtags = response;
                });
        };


        $scope.titleName = tag;

        $scope.changeTag = function (newTag) {
            ListData.set_tag(newTag);
            $scope.titleName = newTag;

            $http.get('http://13.124.56.52/api/hash_tag_picture?tag=' + newTag)
                .success(function (response) {


                    $scope.picture.addr = response.picture;
                    console.log($scope.picture);

                    $ionicPopup.alert({
                        title: "#" + newTag,
                        template: "<img style=\'width:100%\' src=http://13.124.56.52" + $scope.picture.addr + '>'
                    });
                    $scope.search_text.text = "";

                    $scope.search_change();

                    $location.path('/tab/album');

                });

        };


    });
