angular.module('mytodos.list-data', [])
    .factory('ListData', function ($http) {

        var page = 1;
        posts = [];
        var tag = '수원대학교';

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
            get_tag_picture: function () {
                $http.get('http://52.78.208.21/api/hash_tag_picture?tag=' + tag )
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
