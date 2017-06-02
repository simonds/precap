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

var UserController = {

    mailTest: function(req, res) {
        var from = {
            name: req.session.user.fullName,
            email: req.session.user.email
        };
        emailService.sendTemplateTest(from, function(result) {
            return res.json(result);
        });
    },

    index: function(req, res) {

        if (req.session.isAdmin) {
            var _limit = req.param('limit') || sails.config.precapConf.models.User.defaultLimit;
            var _skip = req.param('skip') || 0;
            var _sortfield = req.param('sortfield') || 'createdOn';
            var _sortdirection = req.param('sortdirection') || 'ASC';
            
            User.find().limit(_limit).sort(_sortfield + ' ' + _sortdirection).skip(_skip).done(function (err, user) {
                return res.json(user);
            });
        }

        var userId = req.session.user.id;
        User.findById(userId).done(function (err, user) {
            if (err) return res.forbidden();
            return res.json(user);
        });

    },

    checkEmail: function(req, res) {
        var user = User.findOneByEmail(req.query['email'], function userFound (err, user) {
            if (user) { // a user was found
                return res.send("false");
            } else {
                return res.send("true");
            }
        });

    },

    create: function(req, res, next) {
        var user = User.findOneByEmail(req.params['email'], function userFound (err, user) {
            if (user) { // a user was found
                if (req.isJson || req.isAjax) {
                    res.json({error: 'A user with that email address already exists.'}, 500);
                    return;
                } else {
                    req.flash('error', 'A user with that email address already exists.');
                    req.flash('req', req.params.all());
                    res.redirect('/signup');                    
                    return;
                }
            } else { // no user found with that email address
                User.create( req.params.all(), function userCreated (err, user) {
                    if (err) {
                        if (err.ValidationError) {
                            error_object = validationService(User, err.ValidationError);
                            if (req.isJson || req.isAjax) {
                                res.json(require('util').inspect(error_object, {depth:null}), 500);
                            } else {
                                req.flash('req', req.params.all());
                                req.flash('error', require('util').inspect(error_object, {depth:null}));
                                res.redirect('/signup');
                            }
                        }
                        return;
                    }
                    emailService.verifyEmail(req, function(user) {
                        if (req.isJson || req.isAjax) {
                            res.json(user);
                        } else {
                            res.view('user/complete');
                        }
                    });
                });
            }
        });
    },

    signup: function(req, res) {
        var flashRequest = req.flash('req')[0];
        res.view({
            flashInfo           : req.flash('info'),
            flashError          : req.flash('error'),
            referer             : req.headers['referer'],
            reqEmail            : flashRequest ? flashRequest.email : "",
            reqPassword         : flashRequest ? flashRequest.password : ""
        });
    },
/*
    update: function(req, res) {
        var flashRequest = req.flash('req')[0];
        res.view({
            flashInfo           : req.flash('info'),
            flashError          : req.flash('error'),
            referer             : req.headers['referer'],
            reqFirstName        : flashRequest ? flashRequest.firstName : "",
            reqLastName         : flashRequest ? flashRequest.lastName : "",
            reqEmail            : flashRequest ? flashRequest.email : "",
            reqPassword         : flashRequest ? flashRequest.password : "",
            reqPasswordConfirm  : flashRequest ? flashRequest.passwordConfirm : "",
            reqAddress1         : flashRequest ? flashRequest.address1 : "",
            reqAddress2         : flashRequest ? flashRequest.address2 : "",
            reqCity             : flashRequest ? flashRequest.city : "",
            reqState            : flashRequest ? flashRequest.state : "",
            reqZip              : flashRequest ? flashRequest.zip : ""
        });
    },
*/
    profile: function(req, res) {

        var username = req.param('username');
        var flashRequest = req.flash('req')[0] || null;
        var _err, _user = {};

        if (username) {
            User.findOneByUserName(username).done(function (err, user) {
                _err = err;
                _user = user;

                if (_err) return res.send(_err,500);
                //res.json(user);

                //console.log(_user);
                _user.address1  = (_user.address1 == "-----") ? "" : _user.address1;
                _user.city      = (_user.city == "-----")     ? "" : _user.city;
                _user.zip       = (_user.zip == "00000")      ? "" : _user.zip;

                res.view({
                    flashInfo: req.flash('info'),
                    flashError: req.flash('error'),
                    user: _user,

                    reqFirstName        : flashRequest ? flashRequest.firstName : _user.firstName,
                    reqLastName         : flashRequest ? flashRequest.lastName : _user.lastName,
                    reqEmail            : flashRequest ? flashRequest.email : _user.email,
                    reqPassword         : flashRequest ? flashRequest.password : "",
                    reqPasswordConfirm  : flashRequest ? flashRequest.passwordConfirm : "",
                    reqAddress1         : flashRequest ? flashRequest.address1 : _user.address1,
                    reqAddress2         : flashRequest ? flashRequest.address2 : _user.address2,
                    reqCity             : flashRequest ? flashRequest.city : _user.city,
                    reqState            : flashRequest ? flashRequest.state : _user.state,
                    reqZip              : flashRequest ? flashRequest.zip : _user.zip
                });

            });
        } else {
            var userId = req.session.user.id;
            User.findOneById(userId).done(function (err, user) {
                _err = err;
                _user = user;

                if (_err) return res.send(_err,500);
                //res.json(user);

                //console.log(_user);
                _user.address1  = (_user.address1 == "-----") ? "" : _user.address1;
                _user.city      = (_user.city == "-----")     ? "" : _user.city;
                _user.zip       = (_user.zip == "00000")      ? "" : _user.zip;

                res.view({
                    flashInfo: req.flash('info'),
                    flashError: req.flash('error'),
                    user: _user,

                    reqFirstName        : flashRequest ? flashRequest.firstName : _user.firstName,
                    reqLastName         : flashRequest ? flashRequest.lastName : _user.lastName,
                    reqEmail            : flashRequest ? flashRequest.email : _user.email,
                    reqPassword         : flashRequest ? flashRequest.password : "",
                    reqPasswordConfirm  : flashRequest ? flashRequest.passwordConfirm : "",
                    reqAddress1         : flashRequest ? flashRequest.address1 : _user.address1,
                    reqAddress2         : flashRequest ? flashRequest.address2 : _user.address2,
                    reqCity             : flashRequest ? flashRequest.city : _user.city,
                    reqState            : flashRequest ? flashRequest.state : _user.state,
                    reqZip              : flashRequest ? flashRequest.zip : _user.zip
                });

            });
        }


    },

    forgot: function(req, res) {
        res.view({
            flashInfo: req.flash('info'),
            flashError: req.flash('error'),
            referer: req.headers['referer']
        });
    },


}

module.exports = UserController;

//module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
//  _config: {}


  
//};
