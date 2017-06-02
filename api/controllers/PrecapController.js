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

        var _limit = req.param('limit') || sails.config.precapConf.models.Precap.defaultLimit;
        var _skip = req.param('skip') || 0;
        var _sortField = req.param('order') || 'createdOn';
        var _sortDirection = req.param('direction') || 'ASC';

        if (req.session.isAdmin) {
            Precap.find().limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, precaps) {
                return res.json(precaps);
            });
        }

        var userId = req.session.user.id;
        Precap.find({'userId': userId}).limit(_limit).sort(_sortField + ' ' + _sortDirection).skip(_skip).done(function (err, precap) {
            if (err) return res.forbidden();
            return res.json(precap);
        });

    }

    ,findFirst: function(req, res) {
        var userId = req.session.user.id;
        Precap.findOne({'userId': userId}).sort('createdAt ASC').done(function (err, precap) {
            if (err) return res.forbidden();
            return res.redirect('/view/' + precap.id);
        });
    }

    ,findFirstEmber: function(req, res) {
        var userId = req.session.user.id;
        Precap.findOne({'userId': userId}).sort('createdAt ASC').done(function (err, precap) {
            if (err) return res.forbidden();
            return res.redirect('/ember/' + precap.id);
        });        
    }

    ,view: function (req,res) {
        var _userId = req.user ? req.user.id : null;
        var _precapId = req.param('id') ? req.param('id') : null;
        res.view({
            precapId: _precapId,
            userId: _userId,
            layout: 'layout-app'
        });
    }
  
    ,viewEmber: function (req,res) {
        res.view({
            layout: 'layout-app-ember'
        });
    }

};
