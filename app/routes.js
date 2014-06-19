// app/routes.js
var mongoose = require('mongoose');

module.exports = function(app, passport, sessionStore, server) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
            console.log('serving: /');
            res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
            console.log('serving: /login');
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	// app.post('/login', do all our passport stuff here);
	app.post('/login', passport.authenticate('local-login', {
            //successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '#/login' // redirect back to the signup page if there is an error
	}), function(req, res) {
            //console.log(req);
            var username = req.user.local.username;
            //console.log(username + req.user.local);
            sendUserLists(req, res, sessionStore, server, username);
        });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
            //successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '#/signup' // redirect back to the signup page if there is an error
	}), function(req, res) {
            var username = req.user.local.username;
            console.log(username + req.user.local);
            sendUserLists(req, res, sessionStore, server, username);
        });

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
            console.log('serving: /profile');
            res.render('profile.ejs', {
            	user : req.user // get the user out of session and pass to template
            });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
            console.log('serving: /logout');
            if (req.user) {
                var username = req.user.local.username;
                console.log(username + req.user.local);
                req.logout();
                req.session.destroy();
                sendUserLists(req, res, sessionStore, server, username);
            }
            res.redirect('/');
	});

	// =====================================
	// USERS PAGE ==========================
	// =====================================
	// app.get('/users', function(req, res) {
        //     mongoose.model('User').find(function(err, users) {
        //         res.send(users);
        //     });
        // });

        // =====================================
        // USERS PAGE ==========================
        // =====================================
        app.get('/users', isAdmin, function(req, res) {
            mongoose.model('User').find(function(err, users) {
               var usernames = [];
               users.forEach(function(user){ username=user.local.username; if(username) { usernames.push(username) } });
               res.render('usersprofile.ejs', {
		        message: req.flash('chgpwdMessage'),
                        users : usernames //
                });

                //res.send(users);
            });
        });



	// =====================================
	// SESSIONS PAGE =======================
	// =====================================
	// app.get('/sessions', function(req, res) {
        //     sessionStore.all(function(err, users) {
        //         res.send(users);
        //     });
        // });
        // =====================================
        // SESSIONS PAGE =======================
        // =====================================
        app.get('/sessions', function(req, res) {
            console.log('serving: /sessions');
            sessionStore.all(function(err, users) {
               var usernames = [];
               users.forEach(function(user){ username=JSON.parse(user).username; if(username) { usernames.push(username) } });
               res.render('chatprofile.ejs', {
                        users : usernames //
                });

                //res.send(users);
            });
        });
 

	// delete user
	app.delete('/users/:username', function(req, res) {
            console.log(req.params.username);
                mongoose.model('User').findOne({ 'local.username': req.params.username }, function(err,user){
                    user.remove();
                    mongoose.model('User').find(function(err, users) {
                        res.send(users);
                    });
		});
	});

	app.post('/chgpwd', passport.authenticate('local-chgpwd', {
		successRedirect : '/users', // redirect to the secure profile section
		failureRedirect : '/users', // redirect back to the signup page if there is an error
		failureFlash : true, // allow flash messages
                successFlash : 'password has been chatnged'
        }));
        // app.post('/chgpwd', function(req, res) {
        //     console.log(req.body.username+req.body.password);
        // });

var partial = {
    usersprofile: { view: { admin: 'allow', Matteo: 'allow' } },
    chatprofile: { view: { all: 'isLogged' } },
    authentication: { view: { all: 'allow' } },
    login: { view: { all: 'allow' } },
    signup: { view: { all: 'allow' } }
};

        app.get('/partials/:page', function (req, res) {
            var isLogged = false;
            var page = req.params.page;
            var name = page.substring(0, page.length - 4);
            console.log(page+': '+partial[name]['view']['all']);
            if(req.user) { isLogged = true } else { isLogged = false };
            console.log(isLogged);
            if(partial[name]['view']['all'] == 'allow') { 
                console.log('rendering... allow all'); 
                res.render('partials/' + page);
            } else if(partial[name]['view']['all'] == 'isLogged' && isLogged) {
                console.log('rendering... allow logged'); 
                res.render('partials/' + page);
            }
            else if(isLogged && partial[name]['view'][req.user.local.username] == 'allow') {
                console.log('rendering... allow user'); 
                res.render('partials/' + page);
            }
            else {
                console.log('not allowed... redirecting'); 
                res.redirect('partials/authentication.ejs');
            }
        });

	app.get('/amIloggedIN', function(req, res) {
            console.log('am I logged IN?');
            var username = "";
            if(req.user) {
                username = req.user.local.username;
                console.log('amIloggedIN: logged as: '+username); 
                sendUserLists(req, res, sessionStore, server, username);
            } else {
                var response = [];
                //res.send([{ from: 'username', username: "" }]);
	        //res.redirect('/', '[{ from: "username", username: "" }]');
                console.log('amIloggedIN: no user logged... redirecting'); 
                //res.redirect('/', '[{ username: "" }]');
                //res.send('[{ from: "username", username: "" }]');
                response.push({ from: 'username', username: '' });
                res.send(response);
            }
	});

	app.get('/GetFileTree', function(req, res) {
            console.log(req.query.dir);
 
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
                  var ramus = {};
                  fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                      ramus = { "name": filename, "id": file, "type": "branch", "children": [] };
                      branch.children.push(ramus);
                      walk(ramus, function(err, res) {
                        //branch = branch.concat(res);
                        if (!--pending) done(null, branch);
                      });
                    } else {
                      ramus = { "name": filename, "id": file, "type": 'leaf', "children": [] };
                      branch.children.push(ramus);
                      if (!--pending) done(null, branch);
                    }
                  });
                });
              });
            };
            var tree = [ { "name": req.query.dir, "id": req.query.dir, "type": "branch", children: [] } ];
            walk(tree[0], function(err, results) {
              if (err) throw err;
              console.log(util.inspect(tree, false, null));
              res.send(tree);
            });
	});
};

function isAdmin(req, res, next) {
console.log(req.user);
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated() && req.user.local.username == 'admin')
		return next();

	// if they aren't redirect them to the home page
	console.log('isAdmin: redirecting to /');
	res.redirect('/');
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	console.log('isloggedIN: redirecting to /');
	res.redirect('/');
}

function sendUserLists(req, res, sessionStore, server, username) {
    sessionStore.all(function(err, loggedINusers) {
        var userList = [];
        var response = [];
        console.log(loggedINusers);
        if(req.user != null) { //it is a login the user is not in the sessionStore yet
            userList = [ username ]; //add it to the list
            response.push({from: 'username', username: username});
        }
        loggedINusers.forEach(function(user){ var un=JSON.parse(user).username; if(un && un != username) { userList.push(un) } });
        if(req.user == null) { //it is a logout the user is still in the sessionStore
            userList.splice(userList.indexOf(username), 1); //remove it from the list
        }
        response.push({ from: 'loggedINuserList', userList: userList });

        //broadcast new user list to all clients connected using websocket
        server.connections.forEach(function(conn) {
            conn.sendText(JSON.stringify({ from: 'userList', userList: userList }));
        });

        userList = [];
        mongoose.model('User').find(function(err, registeredUsers) {
           registeredUsers.forEach(function(user){ var username=user.local.username; if(username) { userList.push(username) } });
            response.push({ from: 'registeredUserList', userList: userList });

            console.log(response);
            res.send(response);
        });
    });
}
