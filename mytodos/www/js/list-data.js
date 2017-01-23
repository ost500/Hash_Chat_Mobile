angular.module('mytodos.list-data', [])
    .factory('ListData', function ($http) {

        var page = 1;
        posts = [];
        var tag = '수원대학교';

        return {
            get: function () {
                $http.get('/api/api/posts?tag=수원대학교&page=' + page)
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
            get_tag_picture: function () {
                $http.get('/api/api/hash_tag_picture?tag=' + tag )
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
