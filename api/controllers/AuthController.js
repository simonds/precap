/**
 * AuthController
 *
 */
var passport = require('passport');
module.exports = {


    login: function (req,res) {
        res.view({
            flashInfo: req.flash('info'),
            flashError: req.flash('error'),
            user: req.session.user
        });
    },

    verify: function (req, res) {
        var user = User.findOneByEmailVerificationCode(req.param('verificationCode'), function userFound (err, user) {
            if (user) { // a user was found
                user.emailVerificationCode = "";
                user.emailVerified = true;
                user.save(function(err) {
                    emailService.sendWelcome(req, user);
                    req.flash('info', 'Your email address has been verified!');
                    res.redirect('/login');
                });
            } else { // no user found with that verification code
                res.send(404);
            }
        });
    },
 
    resetPassword: function(req, res) {
        var user = User.findOneByEmailVerificationCode(req.param('verificationCode'), function userFound (err, user) {
            if (user) { // a user was found
                user.emailVerificationCode = "";
                user.password = req.param('password');
                user.isResettingPassword = false;
                user.save(function(err) {
                    req.flash('info', 'Your password has been changed!');
                    res.redirect('/login');
                });
            } else { // no user found with that verification code
                res.send(500);
            }
        });
    },

    showPasswordReset: function(req, res) {
        res.view('auth/reset', {
            verificationCode: req.param('verificationCode')
        });
    },

    process: function(req, res) {

        if (req.param('remember')) {
            require("crypto").randomBytes(48, function(ex, buf) {
                var authCode = buf.toString('hex');
                res.cookie('loginAuth', authCode, { path: '/', httpOnly: true, maxAge: 2592000000 })
            });
        };

        passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
                if (err) req.flash('error', require('util').inspect(err, {depth:null}));
                if (!user) req.flash('info', require('util').inspect(info, {depth:null}));
                res.redirect('/login');
                return;
            }
 
            req.logIn(user, function(err) {
                if (err) {
                    req.flash('error', err);
                    res.view();
                    return;
                }
                
                req.session.authenticated = true;
                req.session.user = user;
                req.session.isAdmin = user.isAdmin ? true : false;

                if (req.param('remember')) {
                    req.session.loginAuthenticationCode = authCode;
                    user.loginAuthenticationCode = authCode;
                    user.save();
                    res.redirect(req.session.returnTo || '/');
                    req.session.returnTo = null;
                    return;
                };

                res.redirect(req.session.returnTo || '/');
                req.session.returnTo = null;
                return;
            });
        })(req, res);
    },

    sendPasswordReset: function(req, res) {
        User.findOneByEmail( req.param('email'), function userFound (err, user) {
            if (err) {
                if (err) req.flash('error', require('util').inspect(err, {depth:null}));
                res.redirect('/forgot');
                return;
            }
            require("crypto").randomBytes(48, function(ex, buf) {
                user.emailVerificationCode = buf.toString('hex');
                user.isResettingPassword = true;
                user.save(function(err) {
                    emailService.sendPasswordReset(req, user);
                    req.flash('info', 'A link to reset your password has been sent!');
                    res.redirect('/forgot');
                    return;
                });
            });
        });
    },

 
    logout: function (req,res) {
        req.logout();
        if (req.session.loginAuthenticationCode) {
            User.findOnByLoginAuthenticationCode(req.session.loginAuthenticationCode, function userFound (err, user) {
                user.loginAuthenticationCode = "";
                res.clearCookie('loginAuth');
                user.save();
            });
        }
        req.session.destroy();
        res.redirect('/');
    },



};



/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 *		REST and CRUD shortcut blueprints are only enabled if a matching model file
 *		(`models/Auth.js`) exists.
 *
 * NOTE:
 *		You may also override the logic and leave the routes intact by creating your own
 *		custom middleware for AuthController's `find`, `create`, `update`, and/or
 *		`destroy` actions.
 */

module.exports.blueprints = {

	// Expose a route for every method,
	// e.g.
	//	`/auth/foo` => `foo: function (req, res) {}`
	actions: true,


	// Expose a RESTful API, e.g.
	//	`post /auth` => `create: function (req, res) {}`
	rest: true,


	// Expose simple CRUD shortcuts, e.g.
	//	`/auth/create` => `create: function (req, res) {}`
	// (useful for prototyping)
	shortcuts: true

};