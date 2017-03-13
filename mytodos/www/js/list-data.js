angular.module('mytodos.list-data', [])
    .factory('ListData', function ($http, $rootScope) {

        var page = 1;
        posts = [];
        var default_tag = '수원대학교';
        var tag = '수원대학교';
        $rootScope.url = 'api/';

        return {
            get: function () {
                $http.get('http://52.78.239.185/api/posts?tag=수원대학교&page=' + page)
                    .success(function (response) {

                        console.log(response);


                    })
                    .error(function (response) {
                        return response;
                    });
            },
            get_tag: function () {
                return tag;
            },

            get_default_tag: function () {
                return default_tag;
            },

            set_tag: function (newTag) {
                tag = newTag;
            },


            get_tag_picture: function () {
                $http.get('http://13.124.56.52/api/hash_tag_picture?tag=' + tag)
                    .success(function (response) {

                        console.log(response);
                        return response;

                    })
                    .error(function (response) {
                        return response;
                    });
            }

        }
    });
