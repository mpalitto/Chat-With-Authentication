angular.module('myFilters', []).filter('nospace', function() {
  return function(text){ return text.replace(/ /g, '').replace(/\./g, '') };
})

