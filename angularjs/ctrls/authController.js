    function authController($scope, $http, $window,  UserService, ChatService) {
        $scope.authData = {};
        $scope.submitAuth = function(type) {
            console.log($scope.authData);
            $http.post('/'+type, $scope.authData)
                .success(function(messages) {
                   console.log(messages);
                   $.each(messages, function( i, message ) {
                       console.log('authController:');
                       console.log(message);
                       if(message.from == "loggedINuserList") {
                           console.log(message.userList);
                           ChatService.userList = message.userList;
                           ChatService.sendUserList();
                       } else if(message.from == "registeredUserList") {
                           console.log(message.userList);
                           UserService.users = message.userList;
                       } else {
                           console.log('message type not recognized: '+message.from)
                       }
                   });

                   UserService.username = $scope.authData.username;
                   UserService.isLogged = true;
                   UserService.sendISlogged();
                   console.log(UserService.isLogged);
                   ChatService.connect($scope.authData.username);
                   if( $scope.authData.username == 'admin') {
                       console.log('redirecting to admin panel');
                       $window.location.href = "#/users";
                   } else {
                       console.log('redirecting to chat panel');
                       $window.location.href = "#/sessions";
                   }
                });
        };
    };
