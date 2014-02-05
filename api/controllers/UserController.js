/**
 * UserController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');

var UserController = {

    index: function(req, res) {
        if (req.session.isAdmin) {
            User.find().done(function (err, user) {
                return res.json(user);
            });
        }

        var userId = req.session.user.id;
        User.findOneById(userId).done(function (err, user) {
            if (err) return res.forbidden();
            return res.json(user);
        });

    },

    create: function(req, res) {
        User.create( req.params.all(), function userCreated (err, user) {
            if (err) return next(err);
            res.json(user);
        });

    },

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

    update: function(req, res) {

    }
}

module.exports = UserController;

//module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
//  _config: {}


  
//};
