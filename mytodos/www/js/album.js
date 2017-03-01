angular.module('mytodos.album', ['mytodos.list-data'])
    .controller('AlbumCtrl', function ($scope, ListData, $stateParams, $location, $http, $ionicNavBarDelegate) {
        console.log($location.url());

        $ionicNavBarDelegate.showBackButton(false);

        $scope.posts = [];

        var page = 1;

        $scope.moreDataCanBeLoaded = true;

        function loadList(page, callback) {
            var tag = ListData.get_tag();
            $http.get('http://52.78.208.21/api/posts?tag=' + tag + '&page=' + page)
                .success(function (response) {
                    var posts = [];
                    if (response.length === 0) {
                        $scope.moreDataCanBeLoaded = false;
                    }
                    angular.forEach(response, function (data) {
                        console.log(data);
                        posts.push(data);
                    });
                    callback(posts);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
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
            loadList(page, function (moreData) {
                $scope.posts = $scope.posts.concat(moreData);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });

        };

        $scope.album_detail = function (id) {
            console.log("album_detail");
            console.log($stateParams.article_id);
            $location.path('/tab/album_detail/' + id);
        }

        $scope.write = function () {
            console.log("Create Click");
            $location.path('/tab/album_create');
        }
    })
    .controller('AlbumDetailCtrl', function ($scope, $location, $stateParams, $http, $ionicNavBarDelegate) {
        $scope.post = "";

        $scope.moreDataCanBeLoaded = true;


        $ionicNavBarDelegate.showBackButton(true);

        function loadList(id, callback) {
            $http.get('http://52.78.208.21/api/each_post/' + id)
                .success(function (response) {
                    var post;
                    $scope.moreDataCanBeLoaded = false;
                    post = response;
                    callback(post);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.loadNew = function () {
            $scope.moreDataCanBeLoaded = true;
            loadList($stateParams.id, function (newData) {
                $scope.post = newData;
            });
        };


        $scope.loadMore = function () {
            console.log('hi');
            loadList($stateParams.id, function (data) {
                $scope.post = data;
                console.log(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });

        };
    })
    .controller('AlbumCreateCtrl', function ($scope, $location, $stateParams, $http, LoginData, $ionicPopup) {
        $scope.post = "";

        $scope.moreDataCanBeLoaded = true;


        var login_data = LoginData.get();
        console.log(login_data);

        $scope.create_data = {};


        $scope.profile_data = {};

        $scope.profile_data.name = login_data.name;
        $scope.profile_data.email = login_data.email;
        $scope.profile_data.profile_image = login_data.profile_image;


        function loadList(id, callback) {
            $http.get('http://52.78.208.21/api/each_post/' + id)
                .success(function (response) {
                    var post;
                    $scope.moreDataCanBeLoaded = false;
                    post = response;
                    callback(post);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.loadNew = function () {
            $scope.moreDataCanBeLoaded = true;
            loadList($stateParams.id, function (newData) {
                $scope.post = newData;
            });
        };


        $scope.loadMore = function () {
            console.log('hi');
            loadList($stateParams.id, function (data) {
                $scope.post = data;
                console.log(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });

        };

        $scope.submit = function () {

            console.log($scope.create_data);

            $http({
                method: 'POST',
                url: 'http://52.78.208.21/api/posts/',
                data: $.param({
                    message: $scope.create_data.message,
                    hashtag: $scope.create_data.hashtag
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (response) {
                console.log('response');
                console.log(response);
            }).error(function (response) {
                console.log(response);

                var error_message = "";

                if (response.message) {
                    error_message = error_message + response.message;
                }

                if (response.hashtag) {
                    if (response.message) {
                        error_message = error_message + "<br>";
                    }
                    error_message = error_message + response.hashtag;
                }

                $ionicPopup.alert({
                    title: "에러",
                    template: error_message
                });
            });


        }

    });