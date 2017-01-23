angular.module('mytodos.album', ['mytodos.list-data'])
    .controller('AlbumCtrl', function ($scope, ListData, $stateParams, $location, $http) {
        console.log($location.url());

        $scope.posts = [];

        var page = 1;

        $scope.moreDataCanBeLoaded = true;

        function loadList(page, callback) {
            var tag = ListData.get_tag();
            $http.get('/api/api/posts?tag='+ tag +'&page=' + page)
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
            page = 0;
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
    })
    .controller('AlbumDetailCtrl', function ($scope, $location, $stateParams, $http) {
        $scope.post = "";

        $scope.moreDataCanBeLoaded = true;



        function loadList(id, callback) {
            $http.get('/api/api/each_post/' + id)
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

    });