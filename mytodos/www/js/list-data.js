angular.module('mytodos.list-data', [])
    .factory('ListData', function ($http) {

        var page = 1;
        posts = [];

        return {
            get: function () {
                $http.get('/api/api/posts?page=' + page)
                    .success(function (response) {

                        console.log(response);


                    })
                    .error(function (response) {
                        return response;
                    })

                ;



            }

        }
    });
