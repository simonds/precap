/**
 * ContactController
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
   * (specific to ContactController)
   */
  //_config: {}
    index: function(req, res) {

        var _filter = req.param('filter') || null;
        var _limit = req.param('limit') || sails.config.precapConf.models.Contact.defaultLimit;
        var _skip = req.param('skip') || 0;
        var _sortField = req.param('sort') || 'createdOn';
        var _sortDirection = req.param('direction') || 'ASC';

        if (req.session.isAdmin) {
            if (_filter) {
                Contact.find({'firstName': {startsWith: req.param('filter') }}).limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, contacts) {
                    return res.json(contacts);
                });
            } else {
                Contact.find().limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, contacts) {
                    return res.json(contacts);
                });
            }
        }

        var userId = req.session.user.id;
        if (_filter) {
            Contact.find({'userId': userId, 'firstName': {startsWith: req.param('filter') }}).limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, contacts) {
                if (err) return res.forbidden();
                return res.json(contacts);
            });
        } else {
            Contact.find({'userId': userId}).limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, contacts) {
                if (err) return res.forbidden();
                return res.json(contacts);
            });
        }

    },
  
};
