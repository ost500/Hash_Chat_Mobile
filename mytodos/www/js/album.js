angular.module('mytodos.album', ['mytodos.list-data'])
    .controller('AlbumCtrl', function ($scope, ListData, $stateParams, $location, $http, $ionicNavBarDelegate) {
        console.log($location.url());

        $ionicNavBarDelegate.showBackButton(false);

        var tag = ListData.get_tag();

        $scope.titleName = tag;

        $scope.posts = [];

        var page = 1;

        $scope.moreDataCanBeLoaded = true;

        function loadList(page, callback) {
            var tag = ListData.get_tag();

            $scope.titleName = tag;

            console.log(tag);

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
            var tag = ListData.get_tag();

            $scope.titleName = tag;

            console.log("album " + tag);

            page = 1;
            $scope.moreDataCanBeLoaded = true;

            loadList(page, function (newData) {
                $scope.posts = newData;
            });
        };

        $scope.$on('$ionicNavView.enter', function () {
            console.log("album on");
            $scope.loadNew();
        });


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
        };

        $scope.write = function () {
            console.log("Create Click");
            $location.path('/tab/album_create');
        }


        $scope.titleName = tag;
    })


    .controller('AlbumDetailCtrl', function ($scope, $location, $stateParams, $http, $ionicNavBarDelegate, ListData, $rootScope, LoginData, $ionicPopup) {
        $scope.post = "";
        $scope.like = "";
        $scope.comments = [];
        $scope.profile_data = LoginData.get();
        $scope.commentInput = {"data": ""};

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;

        var page = 1;

        $scope.moreDataCanBeLoaded = true;


        $ionicNavBarDelegate.showBackButton(true);

        function loadList(id, callback) {
            $http.get('http://52.78.208.21/api/each_post/' + id + '?api_token=' + LoginData.get().api_token)
                .success(function (response) {
                    var post;
                    // $scope.moreDataCanBeLoaded = false;
                    post = response;
                    callback(post);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function commentsLoad(id, callback) {
            $http.get('http://52.78.208.21/api/comments/' + id + '?page=' + page)
                .success(function (response) {
                    var comments = [];

                    if (response.length === 0) {
                        $scope.moreDataCanBeLoaded = false;
                    }

                    angular.forEach(response, function (data) {
                        console.log(data);
                        comments.push(data);
                    });


                    callback(comments);

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.loadNew = function () {


        };


        $scope.loadMore = function () {
            console.log('hi');
            if (page == 1) {

                loadList($stateParams.id, function (data) {
                    $scope.post = data[0];
                    $scope.like = data[1]["like"];

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }

            commentsLoad($stateParams.id, function (newData) {
                page = page + 1;
                $scope.comments = $scope.comments.concat(newData);
                console.log(newData);


            });

        };

        $scope.likeFunction = function () {
            console.log('like function');
            console.log(LoginData.get().api_token);

            $http.post('api/api/like/' + $scope.post.id + '?api_token=' + LoginData.get().api_token, {})
                .success(function (response) {
                    console.log(response);

                    loadList($stateParams.id, function (newData) {
                        $scope.post = newData[0];
                        $scope.like = newData[1]["like"];
                        console.log(newData[1]["like"]);
                    });

                })
                .error(function (response) {
                    console.log(response);

                    $ionicPopup.alert({
                        title: "에러",
                        template: response
                    });
                });

        };

        var tag = ListData.get_tag();

        $scope.titleName = tag;


        $rootScope.$ionicGoBack = function () {
            $location.path('/tab/album');
        };


        $scope.commentSubmit = function () {
            console.log($scope.commentInput.data);
            $http.post('api/api/comments/' + $stateParams.id + '?api_token=' + LoginData.get().api_token,
                $scope.commentInput)
                .success(function (response) {
                    page = 1;

                    commentsLoad($stateParams.id, function (newData) {
                        page = page + 1;
                        $scope.comments = newData;
                        console.log(newData);
                    });

                    $scope.commentInput.data = null;
                }).error(function (response) {
                console.log(response);
                $ionicPopup.alert({
                    title: "에러",
                    template: response
                });
            });
        };

        $scope.deleteComment = function(id) {
            console.log(id);
            $http.delete('api/api/comments/' + id + '?api_token=' + LoginData.get().api_token,
                {})
                .success(function (response) {
                    page = 1;

                    commentsLoad($stateParams.id, function (newData) {
                        page = page + 1;
                        $scope.comments = newData;
                        console.log(newData);
                    });

                    $scope.commentInput.data = null;
                }).error(function (response) {
                console.log(response);
                $ionicPopup.alert({
                    title: "에러",
                    template: response
                });
            });

        };

    })


    .controller('AlbumCreateCtrl', function ($scope, $location, $stateParams, $http, LoginData, $ionicPopup, ListData, $ionicNavBarDelegate) {
        $scope.post = "";
        var tag = ListData.get_tag();

        $scope.titleName = tag;

        $scope.moreDataCanBeLoaded = true;

        $ionicNavBarDelegate.showBackButton(true);


        var login_data = LoginData.get();
        console.log(login_data);

        $scope.$on('$ionicView.enter', function () {
            tag = ListData.get_tag();

            $scope.create_data = {
                message: "",
                hashtag: "#" + tag,
                picture: ""
            };
        });

        $scope.create_data = {
            message: "",
            hashtag: "#" + tag,
            picture: ""
        };

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

            var formData = new FormData($("#postForm")[0]);
            // formData.append('picture', $scope.create_data.picture);
            formData.append('message', $scope.create_data.message);
            formData.append('hashtag', $scope.create_data.hashtag);

            console.log($scope.create_data);
            console.log($scope.create_data.picture);
            console.log(formData.picture);

            $http.post('api/api/posts' + '?api_token=' + LoginData.get().api_token,
                formData, {
                    headers: {'Content-Type': undefined},
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    mimeType: "multipart/form-data",

                }
            )
                .success(function (response) {
                    console.log(response);

                    $scope.create_data.message = "";
                    $scope.create_data.hashtag = "#" + tag;

                    $location.path('/tab/album_detail/' + response.id);

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