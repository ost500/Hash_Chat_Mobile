angular.module('mytodos.album', ['mytodos.list-data'])
    .controller('AlbumCtrl', function ($scope, ListData, $stateParams, $location, $http, $ionicNavBarDelegate, $rootScope) {

        if ($scope.newspeed == null) {
            $scope.newspeed = 'posts';
        }

        $scope.newspeed_change = function (type) {
            console.log('newspeedchange');
            console.log(type);
            $rootScope.page = 1;
            $scope.newspeed = type;
            $scope.loadNew();
        };
        $ionicNavBarDelegate.showBackButton(false);


        var tag = ListData.get_tag();



        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {


            console.log(toState);
            if (toState.url == '/album') {


                if (tag != ListData.get_tag()) {
                    $rootScope.page = 1;
                    $scope.loadNew();
                }
            }
        });


        $scope.titleName = tag;

        $scope.posts = [];

        if (!$rootScope.page) {
            $rootScope.page = 1;
        }

        $scope.moreDataCanBeLoaded = true;

        function loadList(page, callback) {
            var tag = ListData.get_tag();

            $scope.titleName = tag;

            console.log('http://13.124.56.52/api/' + $scope.newspeed + '?tag=' + tag + '&page=' + page);
            $http.get('http://13.124.56.52/api/' + $scope.newspeed + '?tag=' + tag + '&page=' + page)
                .success(function (response) {
                    var posts = [];
                    if (response.length === 0) {
                        $scope.moreDataCanBeLoaded = false;
                        $rootScope.page = $rootScope.page - 1;
                    }
                    angular.forEach(response, function (data) {
                        console.log(data);

                        posts.push(data);

                    });
                    callback(posts);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        $scope.loadNew = function () {
            var tag = ListData.get_tag();

            $scope.titleName = tag;

            console.log("album " + tag);


            $rootScope.page = 1;


            $scope.moreDataCanBeLoaded = true;

            loadList($rootScope.page, function (newData) {
                $scope.posts = newData;
            });
        };


        $scope.loadMore = function () {
            console.log($scope.posts.length);
            if ($scope.posts.length > 0) {
                $rootScope.page = $rootScope.page + 1;
            }
            console.log($rootScope.page);
            loadList($rootScope.page, function (moreData) {
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
        };


        $scope.titleName = tag;
    })


    .controller('AlbumDetailCtrl', function ($scope, $location, $stateParams, $http, $ionicNavBarDelegate, ListData, $rootScope, LoginData, $ionicPopup, $ionicHistory) {
        $ionicNavBarDelegate.showBackButton(true);
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log(toState);
            if (toState.url == '/album_detail') {
                $scope.profile_data = fLoginData.get();
            }
        });

        $scope.post = "";
        $scope.like = "";
        $scope.comments = [];
        $scope.$on('$ionicView.enter', function () {
            $scope.profile_data = LoginData.get();
        });
        $scope.profile_data = LoginData.get();
        $scope.commentInput = {"data": ""};

        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true;

        $scope.mine = false;


        var page = 1;

        $scope.moreDataCanBeLoaded = true;


        $ionicNavBarDelegate.showBackButton(true);

        function loadList(id, callback) {
            $http.get('http://13.124.56.52/api/each_post/' + id + '?api_token=' + LoginData.get().api_token)
                .success(function (response) {
                    var post;
                    // $scope.moreDataCanBeLoaded = false;
                    post = response;
                    callback(post);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function commentsLoad(id, callback) {
            $http.get('http://13.124.56.52/api/comments/' + id + '?page=' + page)
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
                    console.log($scope.profile_data);
                    console.log($scope.post.user_id);
                    if ($scope.profile_data.user_id == $scope.post.user_id ||
                        $scope.profile_data.api_token === $scope.post.api_token) {
                        $scope.mine = true;
                    }
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

            $http.post('http://13.124.56.52/api/like/' + $scope.post.id + '?api_token=' + LoginData.get().api_token, {})
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
            $http.post('http://13.124.56.52/api/comments/' + $stateParams.id + '?api_token=' + LoginData.get().api_token,
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

        $scope.deleteComment = function (id) {
            console.log(id);
            $http.delete('http://13.124.56.52/api/comments/' + id + '?api_token=' + LoginData.get().api_token,
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


        $scope.destroy = function () {
            console.log('ddd');

            var confirmPopup = $ionicPopup.confirm({
                title: '삭제',
                template: '삭제 하시겠습니까?',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: '삭제',
                    type: 'button-positive',
                    onTap: function (e) {
                        $http.delete('http://13.124.56.52/api/posts/' + $stateParams.id + '?api_token=' + LoginData.get().api_token,
                            {})
                            .success(function (response) {

                                $location.path('/tab/album');

                            }).error(function (response) {

                            $ionicPopup.alert({
                                title: "에러",
                                template: response
                            });
                        });
                    }
                }, {
                    text: '취소',
                    type: 'button-default',
                    onTap: function (e) {

                    }
                }]
            });


        }


    })


    .controller('AlbumCreateCtrl', function ($scope, $location, $stateParams, $http, LoginData, $ionicPopup, ListData, $ionicNavBarDelegate, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $cordovaActionSheet, $ionicLoading, $rootScope) {
        $scope.post = "";
        var tag = ListData.get_tag();

        $scope.titleName = tag;

        $scope.moreDataCanBeLoaded = true;

        $ionicNavBarDelegate.showBackButton(true);

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);


        var login_data = LoginData.get();
        console.log(login_data);
        $scope.$on('$ionicView.enter', function () {
            $scope.profile_data = LoginData.get();

            tag = ListData.get_tag();

            $scope.create_data = {
                message: "",
                hashtag: "#" + tag,
                picture: ""
            };
            default_tag = ListData.get_default_tag();

            if (tag != default_tag) {
                $scope.create_data.hashtag = default_tag + "#" + $scope.create_data.hashtag;
            }

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
            $http.get('http://13.124.56.52/api/each_post/' + id)
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

            $http.post('http://13.124.56.52/api/posts' + '?api_token=' + LoginData.get().api_token,
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

        $scope.image = null;

        $scope.showAlert = function (title, msg) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
            });
        };

        $scope.loadImage = function () {
            var options = {
                title: '사진',
                buttonLabels: ['사진 가져오기', '사진 촬영하기'],
                addCancelButtonWithLabel: '취소',
                androidEnableCancelButton: true,
            };
            $cordovaActionSheet.show(options).then(function (btnIndex) {
                var type = null;
                if (btnIndex === 1) {
                    type = Camera.PictureSourceType.PHOTOLIBRARY;
                } else if (btnIndex === 2) {
                    type = Camera.PictureSourceType.CAMERA;
                }
                if (type !== null) {
                    $scope.selectPicture(type);
                }
            });
        };

        $scope.selectPicture = function (sourceType) {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceType,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imagePath) {
                    // Grab the file name of the photo in the temporary directory
                    var currentName = imagePath.replace(/^.*[\\\/]/, '');

                    //Create a new name for the photo
                    var d = new Date(),
                        n = d.getTime(),
                        newFileName = n + ".jpg";

                    // If you are trying to load image from the gallery on Android we need special treatment!
                    if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                        window.FilePath.resolveNativePath(imagePath, function (entry) {
                                window.resolveLocalFileSystemURL(entry, success, fail);
                                function fail(e) {
                                    console.error('Error: ', e);
                                }

                                function success(fileEntry) {
                                    var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                                    // Only copy because of access rights
                                    $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function (success) {
                                        $scope.image = newFileName;
                                    }, function (error) {
                                        $scope.showAlert('Error', error.exception);
                                    });
                                };
                            }
                        );
                    } else {
                        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                        // Move the file to permanent storage
                        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                            $scope.image = newFileName;
                        }, function (error) {
                            $scope.showAlert('Error', error.exception);
                        });
                    }
                },
                function (err) {
                    // Not always an error, maybe cancel was pressed...
                })
        };

        $scope.pathForImage = function (image) {
            if (image === null) {
                return '';
            } else {
                return cordova.file.dataDirectory + image;
            }
        };

        $scope.uploadImage = function () {
            $scope.show();
            // Destination URL
            var url = "http://13.124.56.52/api/posts" + '?api_token=' + LoginData.get().api_token;


            // File name only
            var filename = $scope.image;


            var options = {
                fileKey: "picture",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: {

                    'message': $scope.create_data.message,
                    'hashtag': $scope.create_data.hashtag
                }
            };
            console.log('before if else');
            if ($scope.image == null) {
                console.log('targetPath == null');
                $http.post(url,
                    options.params
                )
                    .success(function (response) {
                        console.log(response);
                        $scope.hide();
                        $scope.create_data.message = "";
                        $scope.create_data.hashtag = "#" + tag;

                        $location.path('/tab/album');

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

                    $scope.hide();

                    $ionicPopup.alert({
                        title: "에러",
                        template: error_message
                    });

                });


            } else {

                // File for Upload
                var targetPath = $scope.pathForImage($scope.image);


                console.log('targetPath != null');
                $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
                    $scope.pathForImage(null);
                    $scope.hide();
                    $location.path('/tab/album');
                }, function (error) {
                    console.log(error);

                    var error_message = "";

                    if (error["message"] != undefined) {
                        error_message = error_message + error.body;
                    }

                    if (error["hashtag"] != undefined) {
                        if (error.message) {
                            error_message = error_message + "<br>";
                        }
                        error_message = error_message + error.hashtag;
                    }

                    $scope.hide();

                    $ionicPopup.alert({
                        title: "에러",
                        template: error_message
                    });
                });
            }

        };


        $scope.show = function () {
            $ionicLoading.show({
                template: '게시물을 올리는 중 입니다...',
                duration: 30000
            }).then(function () {
                console.log("The loading indicator is now displayed");
            });
        };
        $scope.hide = function () {
            $ionicLoading.hide().then(function () {
                console.log("The loading indicator is now hidden");
            });
        };

    });