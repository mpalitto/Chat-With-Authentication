//angular module
//var docsApp = angular.module('docsApp', ['angularTreeview']);

//test controller
function docsController($scope, $http, DocsService) {

  // $http({
  //     url: '/GetFileTree',
  //     method: "GET",
  //     params: { dir: 'Docs' }
  // }).success(function(tree) {
  //     //console.log("tree: " + tree);
  //     $scope.tree = tree;
  //     $scope.fileTree = $scope.tree;
  // });
  DocsService.subscribe(function(){$scope.fileTree = DocsService.getTree()});
  DocsService.updateTree($http).then(function() { 
      $scope.DocTree = DocsService.getTree(); 
      console.log($scope.DocTree); 
      $scope.fileTree = $scope.DocTree;
  });
//  $scope.fileTree = DocsService.DocTree;
//console.log(DocsService.DocTree);

//  $scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
//      if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
//          console.log( 'Node Selected!!' );
//          console.log( $scope.abc.currentNode );
//      }
//  }, false);

};
