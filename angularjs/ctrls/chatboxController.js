mainApp.controller('chatboxController', function($scope, $compile, ChatService, UserService){
  $scope.userList = [];
  $scope.sendthis = {};
  $scope.alert = {};
  $scope.alert.type = 'alert alert-danger';
  $scope.alert.msg = 'not connected';
  $scope.isLogged = false;
  $scope.username = "";

  //$scope.$watch('userList', function(){console.log('loggedINusers Change detected: '+ $scope.userList)});
  $scope.closeBox = function(chatboxID){
          $('#'+chatboxID).css('display', 'none');
  }

  $scope.CreateBox = function(chatboxID){
    //$scope.sendthis[chatboxID] = "";
    self=$('#'+chatboxID);
    if(self.length == 0){
      self=$('<div id="'+chatboxID+'" class="chatbox"> <div class="chatboxhead"></div> <div class="chatboxbody"></div> <div class="chatboxfoot"></div> </div>');
      self.appendTo('#chatboxes')
      self.find('.chatboxhead').prepend(chatboxID)
        .append('<button class="close" ng-click="closeBox(\''+chatboxID+'\');" >&times</button>');
      self.find('.chatboxbody').html('<div class="messages" style="width:97%; height:222px; overflow-y: auto; word-wrap: break-word;" disabled/>');
      self.find('.chatboxfoot').html("<input type='text' style='width:98%' ng-model='sendthis[\""+chatboxID+"\"]' ng-keyup='$event.keyCode == 13 ? send(username, sendthis[\""+chatboxID+"\"],\""+chatboxID+"\") : null' />");

      //compile the new DOM once it has been modified
      $compile(self)($scope);
    }
    self.css('display', 'block');
  }

  ChatService.subscribe(function(message) {
    console.log(message);
    if(message.from == "sys") {
        $scope.alert.msg = message.msg;
        //$scope.alerttype = message.type;
        $scope.alert.type = 'alert alert-success';
        $scope.$apply();
    } else if(message.from == "userList") {
        $scope.userList = message.userList;
        $scope.$apply();
    } else {
        $scope.CreateBox(message.from);
        $('#'+message.from+' > .chatboxbody > .messages').append('<p><b>'+message.from+': </b>'+message.msg+'</p>').scrollTop(200000);
    }
  });

  UserService.subscribe(function(isLogged) {
    $scope.isLogged = isLogged;
    $scope.username = UserService.username;
  });

  $scope.send = function(from, sendthis, to) {
    console.log(sendthis);
    ChatService.send(JSON.stringify({from: from, msg: sendthis, to: to}));
    $scope.sendthis[to] = "";
    //keep a copy of the message that has been sent
    $('#'+to+' > .chatboxbody > .messages').append('<p><b>'+from+': </b>'+sendthis+'</p>').scrollTop(200000);
  }

  $scope.logout = function() {
    UserService.isLogged = false;
    UserService.ws.close();
  }
});

