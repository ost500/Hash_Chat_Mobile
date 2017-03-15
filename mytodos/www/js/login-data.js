angular.module('mytodos.login-data', [])
    .factory('LoginData', function () {
        var login_data = angular.fromJson(window.localStorage['login-user'] || '[]');
        if (login_data.name == null) {
            login_data.name = "익명" + Math.floor(Math.random() * (10000) + 1);
        }
        if (login_data.email == null) {
            login_data.email = "Anonymouse@osteng.com";
        }
        if (login_data.api_token == undefined) {
            login_data.api_token = Math.random().toString(36).substring(7);
        }
        if (login_data.loggedin == undefined) {
            login_data.loggedin = 0;
        }
        if (login_data.picture == undefined) {
            login_data.picture = "profile_picture/default.png";
        }
        if (login_data.token == undefined) {
            login_data.token = "";
        }

        function saveToStorage(login_val) {
            window.localStorage["login-user"] = angular.toJson(login_data);
        }


        return {

            get: function () {
                return login_data;
            },
            create: function (login) {

                login_data = login;
                login_data.loggedin = 1;
                saveToStorage();

            },
            edit: function (login) {
                login_data = login;

                saveToStorage();
            },

            logout: function () {
                login_data.name = "익명" + Math.floor(Math.random() * (10000) + 1);
                login_data.email = "Anonymouse@osteng.com";
                login_data.api_token = Math.random().toString(36).substring(7);
                login_data.loggedin = 0;
                login_data.picture = "profile_picture/default.png";
                saveToStorage();
            },
            move: function (todo, fromIndex, toIndex) {
                todos.splice(fromIndex, 1);
                todos.splice(toIndex, 0, todo);
                saveToStorage();
            },
            save_token: function (token) {
                login_data.token = token;
                saveToStorage();
            },
            get_token: function () {
                return login_data.token;
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