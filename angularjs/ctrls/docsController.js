//angular module
//var docsApp = angular.module('docsApp', ['angularTreeview']);

//test controller
function docsController($scope, $http) {

  $http({
      url: '/GetFileTree',
      method: "GET",
      params: { dir: 'views' }
  }).success(function(tree) {
      //console.log("tree: " + tree);
      $scope.tree = tree;
  });

	//test tree model 1
  $scope.roleList1 = [
      { "name" : "User", "id" : "role1", "children" : [
        { "name" : "subUser1", "id" : "role11", "children" : [] },
        { "name" : "subUser2", "id" : "role12", "children" : [
          { "name" : "subUser2-1", "id" : "role121", "children" : [
            { "name" : "subUser2-1-1", "id" : "role1211", "children" : [] },
            { "name" : "subUser2-1-2", "id" : "role1212", "children" : [] }
          ]}
        ]}
      ]},

      { "name" : "Admin", "id" : "role2", "children" : [] },

      { "name" : "Guest", "id" : "role3", "children" : [] }
    ];

	//test tree model 2
  $scope.roleList2 = [
      { "name" : "User", "id" : "role1", "children" : [
        { "name" : "subUser1", "id" : "role11", "collapsed" : true, "children" : [] },
        { "name" : "subUser2", "id" : "role12", "collapsed" : true, "children" : [
          { "name" : "subUser2-1", "id" : "role121", "children" : [
            { "name" : "subUser2-1-1", "id" : "role1211", "children" : [] },
            { "name" : "subUser2-1-2", "id" : "role1212", "children" : [] }
          ]}
        ]}
      ]},

      { "name" : "Admin", "id" : "role2", "children" : [
        { "name" : "subAdmin1", "id" : "role11", "collapsed" : true, "children" : [] },
        { "name" : "subAdmin2", "id" : "role12", "children" : [
          { "name" : "subAdmin2-1", "id" : "role121", "children" : [
            { "name" : "subAdmin2-1-1", "id" : "role1211", "children" : [] },
            { "name" : "subAdmin2-1-2", "id" : "role1212", "children" : [] }
          ]}
        ]}
      ]},

      { "name" : "Guest", "id" : "role3", "children" : [
        { "name" : "subGuest1", "id" : "role11", "children" : [] },
        { "name" : "subGuest2", "id" : "role12", "collapsed" : true, "children" : [
          { "name" : "subGuest2-1", "id" : "role121", "children" : [
            { "name" : "subGuest2-1-1", "id" : "role1211", "children" : [] },
            { "name" : "subGuest2-1-2", "id" : "role1212", "children" : [] }
          ]}
        ]}
      ]}
    ];

    
    
  //roleList1 to treeview
  $scope.fileTree = $scope.tree;
  $scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
      if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
          console.log( 'Node Selected!!' );
          console.log( $scope.abc.currentNode );
      }
  }, false);

};
