//angular module
//var docsApp = angular.module('docsApp', ['angularTreeview']);

//test controller
function docsController($scope, $http, DocsService) {
  $scope.showDetails = false;
  $scope.showDownload = false;
  $scope.fileOwner = "";
  $scope.filePath = "";

  DocsService.subscribe(function(){$scope.fileTree = DocsService.getTree()});
  $scope.updateTree = function() {
      DocsService.updateTree($http).then(function() { 
          $scope.DocTree = DocsService.getTree(); 
          //console.log($scope.DocTree); 
          $scope.fileTree = $scope.DocTree;
          $scope.$parent.$parent.alert.showRefresh = false;
          $scope.$parent.$parent.alert.msg = 'connected';
          $scope.$parent.$parent.alert.type = 'alert alert-success';
          $scope.abc.currentNode = undefined;
      })
  };
  $scope.updateTree();

  $scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
              $scope.showDetails = false;
              $scope.showDownload = false;
      if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
          console.log( 'Node Selected!!' );
          console.log( $scope.abc.currentNode );
          $scope.filePath = '/' + $scope.abc.currentNode.id;
          $('#versions').html('');
          if( $scope.abc.currentNode.type == 'leaf') {
              $http({
                  url: '/checkFilesPermission',
                  method: "GET",
                  cache: false,
                  params: { 0: '{ "name": "'+ $scope.abc.currentNode.name +'"}' }
              }).success(function(data, status, headers, config) {
                  console.log(data);
                  $scope.fileOwner = data[0].owner;
                  if( data[0].move == 'allow' ) {
                      $scope.showDetails = true;
                      $scope.showDownload = true;
                      $http({
                          url: '/listPreviousVersions',
                          method: "GET",
                          cache: false,
                          params: { "dir": 'versionedDocs/'+ $scope.abc.currentNode.id }
                      }).success(function(files, status, headers, config) {
                          console.log(files);
                          $.each(files, function(ind, file) {$('#versions').prepend('<a href="'+file.id+'">'+file.name.replace(/\.000Z.*/,'')+'</a></br>')});
                      });
                  } else {
                      $scope.showDetails = false;
                      $scope.showDownload = true;
                  }
              });
          } else {
              $scope.showDetails = false;
              $scope.showDownload = false;
          }
      }
  }, false);

};
