angular.module('mytodos.profile', ['mytodos.login-data'])

    .controller('ProfileCtrl', function ($scope, $state,
                                         $ionicScrollDelegate, $http, LoginData,
                                         $ionicPopup, $ionicNavBarDelegate,
                                         $cordovaCamera, $cordovaFile, $cordovaFileTransfer,
                                         $cordovaDevice, $cordovaActionSheet, $ionicLoading) {

        var login_data = LoginData.get();
        console.log(login_data);

        $scope.profile_data = {};

        $scope.profile_data.name = login_data.name;
        $scope.profile_data.email = login_data.email;
        $scope.profile_data.picture = login_data.picture;
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://52.78.208.21/api/edit_user?api_token=' + login_data.api_token
                + "&name=" + $scope.profile_data.name
                + "&email=" + $scope.profile_data.email
                , {}, config)
                .success(function (response) {
                    console.log(response);

                    $ionicPopup.alert({
                        title: "프로필 수정 성공",
                    });

                    LoginData.edit(response);



                })
                .error(function (response) {

                    $ionicPopup.alert({
                        title: "로그인 에러",
                        template: "이메일과 비밀번호를 다시 확인해 주세요"
                    });
                });


            // LoginData.edit();
            if($scope.new_image_there){
                $scope.uploadImage();
            }

        };

        $ionicNavBarDelegate.showBackButton(true);

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
                                        $scope.new_image_there = true;
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
                            $scope.new_image_there = true;
                        }, function (error) {
                            $scope.showAlert('Error', error.exception);
                        });
                    }

                },
                function (err) {
                    // Not always an error, maybe cancel was pressed...
                })
        };

        $scope.new_image_there = false;

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
            var url = "http://52.78.208.21/api/edit_profile_picture" + '?api_token=' + LoginData.get().api_token;


            // File name only
            var filename = $scope.image;


            var options = {
                fileKey: "profile_picture",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: {
                    name: $scope.profile_data.name,
                    email: $scope.profile_data.email
                }
            };
            console.log('before if else');
            if ($scope.image == null) {
                console.log('targetPath == null');
                $scope.edit();
                $scope.hide();

            } else {

                // File for Upload
                var targetPath = $scope.pathForImage($scope.image);


                console.log('targetPath != null');
                $cordovaFileTransfer.upload(url, targetPath, options).then(function (result, LoginData) {
                    $scope.pathForImage(null);
                    $scope.hide();

                    $ionicPopup.alert({
                        title: "프로필 수정 성공",

                    });

                    LoginData.create(result.response);





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
                template: '프로필을 수정 중 입니다...',
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
