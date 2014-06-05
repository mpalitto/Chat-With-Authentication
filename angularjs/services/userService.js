//mainApp.factory('UserService', [function() {
var heaven = angular.module('heaven', [])
  .factory('UserService', [function() {
    var service = {
	isLogged: false,
	username: '',
        users: [],
        userList: ['placeholder']
	};

    service.subscribe = function(callback) {
        service.callback = callback;
    }
    service.sendISlogged = function() {
        service.callback(service.isLogged);
    }
    return service;
}]);
