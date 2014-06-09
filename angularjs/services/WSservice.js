mainApp.factory('ChatService', function() {
  var service = {};
  service.userList = [];
 
  service.connect = function(username) {
    if(service.ws) { return; }
    var serverIPaddress = $(location).attr('href').replace(new RegExp('http://',''),'').replace(new RegExp('/.*',''),'').replace(new RegExp(':.*',''),''); 
    //console.log(serverIPaddress);
    var ws = new WebSocket("ws://"+serverIPaddress+":8000");
 
    ws.onopen = function() {
      ws.send(username);
      service.callback({from: 'sys', msg: 'connected', type: 'alert alert-success'});
    };
 
    ws.onclose = function() {
      service.callback({from: 'sys', msg: 'connection closed', type: 'alert alert-danger'});
    };
 
    ws.onerror = function() {
      service.callback({from: 'sys', msg: 'Failed to open a connection', type: 'alert alert-danger'});
    }
 
    ws.onmessage = function(message) {
      console.log(message);
      console.log(message.data);
      service.callback(JSON.parse(message.data));
    };
 
    service.ws = ws;
  }
 
  service.sendUserList = function() {
    service.callback({from: 'userList', userList: service.userList});
  }
 
  service.send = function(message) {
    service.ws.send(message);
  }
 
  service.subscribe = function(callback) {
    service.callback = callback;
  }
 
  return service;
});
