angular.module('mytodos.login-data', [])
    .factory('LoginData', function () {
        var login_data = angular.fromJson(window.localStorage['login-user'] || '[]');
        if(login_data.name == null){
            login_data.name = "익명";
        }
        if(login_data.email == null){
            login_data.email = "Anonymouse@osteng.com";
        }
        if(login_data.api_key == null){
            login_data.api_key = "0";
        }

        function saveToStorage(login_val) {
            window.localStorage["login-user"]  = angular.toJson(login_data);
        }

        return {

            get: function () {
                return login_data;
            },
            create: function (login) {
                console.log(login);
                login_data = login;
                console.log(login_data);
                saveToStorage();
            },

            remove: function (todoId) {
                for (var i = 0; i < todos.length; i++) {
                    if (todos[i].id === todoId) {
                        todos.splice(i, 1);
                        saveToStorage();
                    }
                }

            },
            move: function (todo, fromIndex, toIndex) {
                todos.splice(fromIndex, 1);
                todos.splice(toIndex, 0, todo);
                saveToStorage();
            }
        }
    });


// function getTodo(todoId){
//   for(var i=0; i<todos.length; i++){
//     if(todos[i].id === todoId){
//       return todos[i];
//     }
//   }
//   return undefined;
// }
// function updateTodo(todo){
//   for(var i=0; i<todos.length; i++){
//     if(todos[i].id === todo.id){
//       todos[i] = todo;
//       return;
//     }
//   }
// }

// function createTodo(todo){
//   todos.push(todo);
// }