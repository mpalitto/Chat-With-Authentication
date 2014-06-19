var mainApp = angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'heaven', 'angularTreeview'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/login',{templateUrl: '/partials/login.ejs', public: true})
            .when('/signup',{templateUrl: '/partials/signup.ejs', public: true})
            .when('/auth',{templateUrl: '/partials/authentication.ejs', public: true})
            .when('/users',{templateUrl: '/partials/usersprofile.ejs', public: false})
            .when('/sessions',{templateUrl: '/partials/chatprofile.ejs', public: false})
            .otherwise({ redirectTo: '/auth'});
    }])
.run( function($rootScope, $http, $window, UserService, ChatService) {
    $http.get('/amIloggedIN').success(function(messages) {
        console.log('messages: '+messages);
        $.each(messages, function( i, message ) {
            console.log(message);
            if(message.from == "username") {
                if(message.username != "") {
                    UserService.isLogged = true;
                    UserService.username = message.username;
                    UserService.sendISlogged();
                    ChatService.connect(UserService.username);
                } else {
                    UserService.isLogged = false;
                    UserService.username = "";
                    UserService.sendISlogged();
                    //console.log('no user logged... redirecting');
                    //$window.location.href = '#/auth';
                }
            } else if(message.from == "loggedINuserList") {
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

    });
    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        //console.log(current.templateUrl);
        console.log(next.templateUrl);
        console.log(next);
        console.log('is logged: '+UserService.isLogged+' is public: '+next.public);
        //if(! UserService.isLogged && ! next.public) $location.path('/auth');
    });
});
