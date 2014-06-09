var mainApp = angular.module('mainApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'heaven'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/login',{templateUrl: '/partials/login.ejs', public: true})
                      .when('/signup',{templateUrl: '/partials/signup.ejs', public: true})
                      .when('/auth',{templateUrl: '/partials/authentication.ejs', public: true})
                      .when('/users',{templateUrl: '/partials/usersprofile.ejs', public: false})
                      .when('/sessions',{templateUrl: '/partials/chatprofile.ejs', public: false})
                      .otherwise({ redirectTo: '/auth'});
    }])
.run( function($rootScope, $location, UserService) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        //console.log(current.templateUrl);
        console.log(next.templateUrl);
        console.log(next);
        console.log('is logged: '+UserService.isLogged+' is public: '+next.public);
        //if(! UserService.isLogged && ! next.public) $location.path('/auth');
    });
});
