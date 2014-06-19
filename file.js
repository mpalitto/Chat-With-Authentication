var fs = require('fs');
var util = require('util');
var walk = function(branch, done) {
  var dir = branch.id;
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, branch);
    list.forEach(function(file) {
      var filename = file;
      file = dir + '/' + file;
      var ramus = { "name": filename, "id": file, "children": [] };
      branch.children.push(ramus);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(ramus, function(err, res) {
            //branch = branch.concat(res);
            if (!--pending) done(null, branch);
          });
        } else {
          if (!--pending) done(null, branch);
        }
      });
    });
  });
};
var tree = [ { "name": "angularjs", "id": "angularjs", children: [] } ];
walk(tree[0], function(err, results) {
  if (err) throw err;
  console.log(util.inspect(tree, false, null));
});
