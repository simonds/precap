/**
 * PrecapController
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

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PrecapController)
   */
  //_config: {}

    index: function(req, res) {
        if (req.session.isAdmin) {
            Precap.find().done(function (err, precaps) {
                return res.json(precaps);
            });
        }

        var userId = req.session.user.id;
        Precap.find({'userId': userId}).done(function (err, precap) {
            if (err) return res.forbidden();
            return res.json(precap);
        });

    },

    view: function (req,res) {
        res.view({
            user: req.user
        });
    }
  
};
