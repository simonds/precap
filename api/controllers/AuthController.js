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
            referer: req.headers['referer']
        });
    },
 
    process: function(req, res) {
        passport.authenticate('local', function(err, user, info)
        {
            if ((err) || (!user))
            {
                if (err) req.flash('error', err);
                if (!user) req.flash('info', "No user found.");
                res.redirect('/login');
                return;
            }
 
            req.logIn(user, function(err)
            {
                if (err)
                {
                    req.flash('error', err);
                    res.view();
                    return;
                }
                
                req.session.authenticated = true;
                req.session.user = user;
                req.session.isAdmin = user.isAdmin ? true : false;
                res.redirect(req.referer ? req.referer : '/');
                return;
            });
        })(req, res);
    },
 
    logout: function (req,res) {
        req.logout();
        req.session.authenticated = false;
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