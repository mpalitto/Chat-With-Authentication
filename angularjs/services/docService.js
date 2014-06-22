mainApp.service('DocsService', function($http) {
    var DocTree = [];

    this.subscribe = function(callback) {
        this.callback = callback;
    }

    this.updateTree = function($http) {
        return $http({
            url: '/GetFileTree',
            method: "GET",
            params: { dir: 'Docs' }
        }).success(function(tree) {
            //console.log(tree);
            DocTree = tree;
            return tree;
        });
    };
    this.getTree = function() {
        return DocTree;
    };
});
