angular.module('mytodos.list', ['mytodos.list-data'])
    .controller('ListCtrl', function ($http, $scope, ListData) {



        // $scope.reorder = false;
        //
        // $scope.todos = TodoData.list();
        //
        // $scope.remove = function (todoId) {
        //     TodoData.remove(todoId);
        // };
        //
        // $scope.move = function (todo, fromIndex, toIndex) {
        //     console.log(fromIndex + '/' + toIndex);
        //     TodoData.move(todo, fromIndex, todoIndex);
        // };
        //
        // $scope.toggleReorder = function () {
        //     $scope.reorder = !$scope.reorder;
        // };
        var tag = ListData.get_tag();
        $http.get('http://52.78.208.21/api/hashtag?tag=수원대학교')
            .success(function (response) {
                console.log(response);

                $scope.hashtags = response;
                
                

            });

        $http.get('http://52.78.208.21/api/hash_tag_picture?tag=' + tag)
            .success(function (response) {


                $scope.picture = response.picture;
                console.log($scope.picture);

            });

        //
        // function loadList(callback) {
        //     var tag = ListData.get_tag();
        //     console.log('hi');
        //     $http.get('/api/api/hash_tag_picture?tag=' + tag)
        //         .success(function (response) {
        //             var picture;
        //
        //             picture = response;
        //
        //             callback(picture);
        //
        //         });
        // }
        //
        // $scope.loadNew = function () {
        //
        //     $scope.moreDataCanBeLoaded = true;
        //
        //     loadList(function (picture) {
        //         $scope.picture = picture;
        //     });
        // };
        // $scope.img_src = img.picture;
    });
// .controller('ListCtrl', function ($scope, TodoData) {
//     $scope.reorder = false;
//
//     $scope.todos = TodoData.list();
//
//     $scope.remove = function (todoId) {
//         TodoData.remove(todoId);
//     };
//
//     $scope.move = function (todo, fromIndex, toIndex) {
//         console.log(fromIndex + '/' + toIndex);
//         TodoData.move(todo, fromIndex, todoIndex);
//     };
//
//     $scope.toggleReorder = function () {
//         $scope.reorder = !$scope.reorder;
//     };
// })