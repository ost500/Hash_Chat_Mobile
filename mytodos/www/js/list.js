angular.module('mytodos.list', ['mytodos.list-data'])
    .controller('ListCtrl', function ($scope, ListData) {

        

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