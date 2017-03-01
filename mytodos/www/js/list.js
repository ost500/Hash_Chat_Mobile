angular.module('mytodos.list', ['mytodos.list-data'])
    .controller('ListCtrl', function ($http, $scope, ListData) {


        var tag = ListData.get_tag();
        $scope.hashtags = "";

        $http.get('http://52.78.208.21/api/hashtag?tag=' + ListData.get_tag())
            .success(function (response) {
                console.log(response);

                $scope.hashtags = response;

            });

        $http.get('http://52.78.208.21/api/hash_tag_picture?tag=' + tag)
            .success(function (response) {


                $scope.picture.addr = response.picture;
                console.log($scope.picture);

            });


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

                $http.get('http://52.78.208.21/api/hashtag?tag=' + ListData.get_tag())
                    .success(function (response) {
                        console.log(response);

                        $scope.hashtags = response;

                    });

                return;
            }

            $scope.search = true;

            $http.get('http://52.78.208.21/api/hashtag?tag=' + $scope.search_text.text)
                .success(function (response) {
                    console.log(response);

                    $scope.hashtags = response;
                });
        };


        $scope.titleName = tag;

        $scope.changeTag = function (newTag) {
            ListData.set_tag(newTag);
            $scope.titleName = newTag;

            $http.get('http://52.78.208.21/api/hash_tag_picture?tag=' + newTag)
                .success(function (response) {


                    $scope.picture.addr = response.picture;
                    console.log($scope.picture);

                });
        }

    });
