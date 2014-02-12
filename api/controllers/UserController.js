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
        return res.json(emailService.sendTemplateTest());

                var message = {
            "subject": "example subject",
            "to": {
                    "email": "me@marksimonds.net",
                    "name": "Mark",
            },
            "template_name": "welcome-email",
            "template_content": [
                {
                    "name": "header",
                    "content": "<h1>Welcome to Precap</h1>"
                },
                {
                    "name": "main",
                    "content": "<p>Mark, welcome to Precap. We think you will like it.</p><p><a href=\"http://10.10.10.10:5000/\">visit Precap</a></p>"
                }
            ]
        };
        emailService.sendTemplate(message, function(result) {
            console.log(result);
            return res.json(result);

        });
    },

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
                req.flash('error', 'A user with that email address already exists.');
                req.flash('req', req.params.all());
                res.redirect('/signup');
            } else { // no user found with that email address
                User.create( req.params.all(), function userCreated (err, user) {
                    if (err) {
                        if (err.ValidationError) {
                            error_object = validationService(User, err.ValidationError);
                            //req.flash('error', error_object);
                            req.flash('req', req.params.all());
                            req.flash('error', require('util').inspect(error_object, {depth:null}));
                        }
                        res.redirect('/signup');
                        return;
                    }
                    emailService.sendWelcome(req, user);
                    res.view('user/complete');
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

    update: function(req, res) {

    },

    forgot: function(req, res) {
        res.view({
            flashInfo: req.flash('info'),
            flashError: req.flash('error'),
            referer: req.headers['referer']
        });
    },

    sendPasswordReset: function(req, res) {
        User.findOneByEmail( req.params['email'], function userFound (err, user) {
            if (err) {
                if (err) req.flash('error', require('util').inspect(err, {depth:null}));
                res.redirect('/user/forgot');
                return;
            }
            emailService.sendPasswordReset(user);
            res.view('resetSent');
        });
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
